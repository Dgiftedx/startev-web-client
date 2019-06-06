declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Feed } from '../../../_models/feed';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { FeedService } from '../../../_services/feed.service';
import { StoreService } from '../../../_services/store.service';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';




@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css'],
  providers: [FeedService],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [
          animate('200ms ease-out', style({transform: 'translateY(-100%)'}))
        ])
      ]),
    trigger('fadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ],
})
export class FeedsComponent implements OnInit {

  currentUser : User;
  public isImage = false;
  public processedImage = '';
  public content : string = '';
  public title : string = '';
  public post_type: string = '';
  public image: any = null;

  public showCommentBox:boolean = false;
  public comment = {
    feedId: null,
    text: ''
  };

  public commentForm : FormGroup;

  public feeds: Feed[] = [];
  public people: Array<any> = [];

  private feedSubscription: Subscription;
  private localFeedSubscription : Subscription;
  private peopleSubscription : Subscription;
  private partnersSubscription: Subscription;

  public showHelpTip:boolean = false;
  public helpInterval;
  public helpTip:any;
  public partners:any;



  public hasStore:boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private feedService : FeedService,
    private alert: AlertService,
    private store: StoreService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {

    //subscribe to current logged in user
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //check if user has store
    this.store.checkHasStore(this.currentUser.id).subscribe((x:boolean) => this.hasStore = x);
    //First push local feeds on load
    this.localFeedSubscription = feedService
    .getLocalFeeds()
    .subscribe((feed:any) => {
      feed.forEach((item) => {
        item.createdAt = new Date(item.createdAt);
        this.feeds.push(item);
      })
    });

    //Push cuccurrent feeds
    this.feedSubscription = feedService
    .getFeedItems()
    .subscribe((feed: Feed) => {
      if (_.size(feed) > 0) {
        this.feeds.push(feed);
      }
    });

    this.peopleSubscription = this.baseService.getPeople()
    .subscribe((people: any) => {
      this.people = people;
    });


    this.partnersSubscription = this.baseService.getPartners()
    .subscribe((partners:any) => {
      this.partners = partners;
    })
  }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      feedId: [null],
      text: ['']
    });

    //= Shoot Help Tips at regulat interval of 3mins =//
    this.helpInterval = setInterval(() => {
      this.triggerHelpTips();
    }, 6000 * 3);
  }



  // ============ check null item and return default as required =======//
  checkValue(item:any,  type:string, nullValue:string) {
    if (type === 'text') {
      if (this.count(item) === 0) {
        return nullValue;
      }
      return item;
    }

    if (type === 'avatar') {

      if (this.count(item) === 0) {
        return 'assets/images/default/avatar.jpg';
      }
      return item;
    }
  }


  //============= help tips =================//
  triggerHelpTips(){
    if (this.showHelpTip) {
      this.showHelpTip = false;
    }else{
      this.pullHelpTips();
      this.showHelpTip = true;
    }
  }

  handleHelpTipsResponse(data:any){
    this.helpTip = data.tips[Math.floor(Math.random()*data.tips.length)];
  }


  pullHelpTips(){
    this.baseService.getHelpTips(this.currentUser.id)
    .subscribe(
      data => {
        this.handleHelpTipsResponse(data);
      }
     )
  }

  //============= Trigger Post Composer =============//
  writePost(type: any){
    if (type === 'article') {
      this.post_type = 'post';
      $(document).find('#articlePostModal').modal();
    }

    if (type === 'image') {
      this.post_type = 'picture';
      $(document).find('#imagePostModal').modal();
    }

  }

  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
    return this.baseService.echoJobTitle(roleData, role);
  }


  followUser(id: number){
    this.onFollow(id);
  }


  isMore(text: string, level: number): boolean {
    return text.length > level;
  }



  //============ Image Reader ===============//

  imageFileReader(file: File){
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.processedImage = event.target.result; 
    });

    reader.readAsDataURL(file);
  }

  fireImageUpload(){
    $(document).find('#postImageInput').click();
  }

  processPostImage(postImage: any): void {
    const newPostImage : File = postImage.files[0];
    this.imageFileReader(newPostImage);
    this.isImage = true;
    this.image = newPostImage;
  }


  submitArticlePost(){
    this.submitPost();
  }


  submitImagePost(){
    this.submitPost();
  }

  cleanForm(): void {
    this.image = null;
    this.processedImage = null;
    this.title = '';
    this.content = '';
    this.post_type = '';
  }

  //=====Close every single Modal on page ======//

  closeModal(element : any): void {
    $(document).find('#'+element).modal('hide');
  }


  //====== Getter method for Current User Profile =======//

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  //================== Toggle Comment ===================//

  toggleCommentBox(feedId: number){

    //check if the user has toggle the comment for this coming feed

    if (this.showCommentBox) {
      
      if (parseInt(this.comment.feedId) === feedId) {
        this.showCommentBox = false;
        this.comment.feedId = null,
        this.comment.text = '';
      }else{

        this.showCommentBox = false;
        this.comment.feedId = null,
        this.comment.text = '';

        setTimeout(() => {
          this.comment.feedId = feedId;
          this.showCommentBox = true;
          
        }, 100);
      }

    }else{
      this.showCommentBox = true;
      this.comment.feedId = feedId;
    }
    
  }

  //============ submit comment ======================//

  handleCommentResponse(data: any): void {
    this.alert.snotSuccess('Comment Posted');
    //reset comment text. 
    //user might still want to post another comment immediately
    this.comment.text = '';

    //with the update find the feed, update comments array
    let feed = _.findIndex(this.feeds, ['id',data.feed_id]);
    this.feeds[feed].comments = data.comments;
  }


  submitComment(){
    if (!this.comment.feedId || _.size(this.comment.text) === 0) {
      return;
    }

    //else submit comment
     this.baseService.postComment(this.currentUser.id, this.comment)
    .subscribe(
        data => {
            this.handleCommentResponse(data);
        }
      )
  }

  //==================== Toggle likes ===================//

  toggleLike(feedId:number){
    this.onToggleLike(feedId);
  }

  count(items){
    return _.size(items);
  }

  handleLikeToggleResponse(data: any): void {
    this.alert.snotSuccess(data.message);
    let feed = _.findIndex(this.feeds, ['id',data.targetFeed.id]);
    this.feeds[feed].hasLiked = data.targetFeed.hasLiked;
    this.feeds[feed].likers = data.likers;
  }

  onToggleLike(target: number){
     this.baseService.toggleLike(this.currentUser.id, target)
    .subscribe(
        data => {
            this.handleLikeToggleResponse(data);
        }
      )
  }


  //======================= Submit Feeds ===================//
  submitPost(){

    if (_.size(this.content) === 0 || _.size(this.title) === 0) {
      this.alert.errorMsg("Sorry. You can't publish empty content","There is error in form");
      return;
    }

    this.alert.infoMsg("Processing your post....","Processing");

    let formData = new FormData();
    formData.append('post_type',this.post_type);
    formData.append('user_id',this.currentUser.id);
    formData.append('title',this.title);
    formData.append('body',this.content);
    formData.append('image',this.image);
    this.http
    .post(`${this.authenticationService.endpoint}/feed-post-article`, formData)
    .toPromise()
    .then((data: { message: string; status: boolean }) => {
      this.alert.snotSimpleSuccess(data.message);
      $(document).find('.modal').each(function() {
        $(this).modal('hide');
      })
      this.cleanForm();
    })
    .catch(error => {
      this.alert.errorMsg(error, "Post submission failed");
      this.cleanForm();
    });
  }



  //====== Handle Follow & Unfollow ===========//

  handleFollowResponse(data){
    this.people = data.people;
    this.alert.snotSimpleSuccess("You started following this user");
  }


  onFollow(target: number){
    this.baseService.follow(this.currentUser.id, target)
    .subscribe(

        data => {
            this.handleFollowResponse(data);
        }
      )
  }


  ngOnDestroy() {
    if (this.helpInterval) {
      clearInterval(this.helpInterval);
    };
  }

}
