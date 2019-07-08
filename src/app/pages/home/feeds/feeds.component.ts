declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Lightbox } from 'ngx-lightbox';
import { Feed } from '../../../_models/feed';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
// import { Cloudinary } from '@cloudinary/angular-5.x';
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
  public profileData:any;
  public isImage = false;
  public processedImages: Array<any> = [];
  public content : string = '';
  public title : string = '';
  public post_type: string = '';
  public images: Array<any> = [];
  public haltInfiniteScroll : boolean = false;
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
  private topProfileSubscription: Subscription;

  public showHelpTip:boolean = false;
  public helpInterval;
  public helpTip:any;
  public partners:any;
  public topProfiles:any;
  public showTopProfiles:boolean = false;

  public hasStore:boolean = false;
  public followingIds: Array<any> = [];

  slideConfig = {"slidesToShow": 3, "slidesToScroll": 1, "autoplay": true, "autoplaySpeed": 2000};

  feedSlideConfig = {"slidesToShow": 1, "slidesToScroll": 1, "autoplay": true, "autoplaySpeed": 3000};

  editorConfig:any = {
   toolbar: [
     ['bold','italic','background','color'],
     ['link']
   ]
  };

  postEditorConfig:any = {
    removePlugins : 'save,font'
  }


  public hasMoreFeeds : boolean = true;
  public currentPage : number;
  public nextPage : number;

    constructor(
      private route : ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private formBuilder: FormBuilder,
      private feedService : FeedService,
      private alert: AlertService,
      private lightbox: Lightbox,
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
         //process feeds pagination url
         this.processPaginationUrl(feed);

        feed.data.forEach((item) => {
          item.createdAt = new Date(item.createdAt);
          this.feeds.push(item);
        });

      });

      //Push cuccurrent feeds
      this.feedSubscription = feedService
      .getFeedItems()
      .subscribe((feed: Feed) => {
        if (_.size(feed) > 0) {
          this.feeds.unshift(feed);
        }
      });

      this.peopleSubscription = this.baseService.getPeople()
      .subscribe((people: any) => {
        this.people = people;
      });


      this.partnersSubscription = this.baseService.getPartners()
      .subscribe((partners:any) => {
        this.partners = partners;
      });


      this.getTopProfiles();


    }

    ngOnInit() {

      this.profileData = this.route.snapshot.data.profile.profileData;
      this.updateFollowingIds(this.profileData.following);

      this.commentForm = this.formBuilder.group({
        feedId: [null],
        text: ['']
      });

      //= Shoot Help Tips at regulat interval of 3mins =//
      this.helpInterval = setInterval(() => {
        this.triggerHelpTips();
      }, 6000 * 3);
    }



    //================ Name splitter & shotener ====================//
    shortenName(name:string) {
      let splitted = name.split(" ");

      let firstName = splitted[0];

      if (splitted[this.count(splitted) - 1]) {
        return firstName + " " + splitted[this.count(splitted) - 1];
      }

      return firstName;
    }



    //======================= Get top profiles =======================//
    getTopProfiles(){
      this.topProfileSubscription = this.baseService.fetchTopProfiles()
      .subscribe(data => {
        this.topProfiles = data;
        this.showTopProfiles = true;
      });
    }


    //======================= Update followings Id ===================//
    updateFollowingIds(followers: any){
      this.followingIds = [];
      followers.forEach((item) => {
        this.followingIds.push(item.id);
      });
    }

    //====== Check if current user is following target ====//
    public isFollowing(target: number){
      return this.followingIds.includes(target)?true:false;
    }

    unFollowUser(id: number){
      this.onToggleFollow(id);
    }

    handleFollowToggleResponse(data: any){
      //Update people to follow
      this.people = data.people;
      this.profileData.followers = data.followers;
      this.profileData.following = data.following;
      //update following Ids
      this.updateFollowingIds(data.following);
      this.alert.successMsg(data.message,"Updates");
    }


    onToggleFollow(target: number){
      this.baseService.toggleFollow(this.currentUser.id, target)
      .subscribe(

        data => {
          this.handleFollowToggleResponse(data);
        });
    }


    jqueryMethods() {
      //
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
      this.onToggleFollow(id);
    }


    isMore(text: string, level: number): boolean {
      return this.count(text) > level ? true:  false;
    }

    submitArticlePost(){
      this.submitPost();
    }


    submitImagePost(){
      this.submitPost();
    }

    cleanForm(): void {
      this.images = [];
      this.processedImages = [];
      this.title = '';
      this.content = '';
      this.post_type = '';
    }

    //=====Close every single Modal on page ======//

    closeModal(element : any): void {
      $(document).find('#'+element).modal('hide');
      this.cleanForm();
    }


    //============= Open Image ===============//
    openImage(feed:any) {
      let imageArray: Array<any> = [];

      imageArray.push({
        src : feed.image,
        caption : feed.title
      });

      this.lightbox.open(imageArray, 0);
    }

    //============= Open Image ===============//
    openMultipleImages(images:Array<any>, title:string) {
      let imageArray: Array<any> = [];

      images.forEach((item) => {
        imageArray.push({
          src : item,
          caption : title
        });
      });

      this.lightbox.open(imageArray, 0);
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



    //============ Image Reader ===============//

    setupReader(file : File) {
      var name = file.name;
      var reader = new FileReader();  
      reader.addEventListener('load', (event: any) => {
        this.processedImages.push(event.target.result); 
      });
      reader.readAsDataURL(file);
    }

    fireImageUpload(){
      $(document).find('#postImageInput').click();
    }

    processPostImage(postImage: any): void {
      this.processedImages = [];

      if (postImage.files.length > 5) {
        this.alert.errorMsg("You can only upload maximum of 5 pictures", "You Exceeded Upload Limit");
        return;
      }

      for (var i = 0; i < postImage.files.length; i++) {
        this.setupReader(postImage.files[i]);
        this.images.push(postImage.files[i]);
      }

      this.isImage = true;

    }



    //======================= Submit Feeds ===================//
    submitPost(){

      if (_.size(this.content) === 0 || _.size(this.title) === 0) {
        this.alert.errorMsg("Sorry. You can't publish empty content","There is error in form");
        return;
      }

      // this.alert.infoMsg("Processing your post....","Processing");

      let formData = new FormData();
      formData.append('post_type',this.post_type);
      formData.append('user_id',this.currentUser.id);
      formData.append('title',this.title);
      formData.append('body',this.content);

      for (let i = 0; i < this.images.length; i++) {
        formData.append("images[]", this.images[i], this.images[i]['name']);
      }

      this.http
      .post(`${this.authenticationService.endpoint}/feed-post-article`, formData)
      .toPromise()
      .then((data: { message: string; status: boolean }) => {
        this.alert.snotSimpleSuccess(data.message);
        $(document).find('.modal').each(function() {
          $(this).modal('hide');
        });
        this.cleanForm();
      })
      .catch(error => {
        this.alert.errorMsg(error, "Post submission failed");
        this.cleanForm();
      });
    }




    //============== Fetch Feed ==================//
    removeFeedFromThread(feed_id:number) {
      let index =  _.findIndex(this.feeds, ['id', feed_id]);
      //remove feed item
      this.feeds.splice(index, 1);
    }

    //============= Hide Feed ====================//

    hideFeed(feed_id:number) {

      //first remove from feeds collection
      this.removeFeedFromThread(feed_id);

      let data = {
        user_id : this.currentUser.id,
        feed_id: feed_id
      };

      //effect the changes on server
      this.baseService.FeedManageAction(data, 'hide-feed')
      .subscribe(data => {
        //feed hidden
      })
    }


    //============== Delete Feed ====================//
    deleteFeed(feed:any){
      //first remove from feeds collection
      this.removeFeedFromThread(feed.id);

      let data = {
        user_id : this.currentUser.id,
        feed_id: feed.id
      };

      this.baseService.FeedManageAction(data, 'delete-feed')
      .subscribe(data => {
        //feed removed
      });
    }




    //============ Process pagination Url =======================//
    processPaginationUrl(feed:any) {
       this.currentPage = feed.current_page;
        if (this.count(feed.next_page_url) > 0) {
          let page = feed.next_page_url.split("page=")[1];
          this.nextPage = parseInt(page);
        }else{
          this.nextPage = 0;
        }
    }

    //================ Feeds Infinite scroll ===================//
    onLoadMore() {
      this.haltInfiniteScroll = true;

      //if there is no page to load, halt callback
      if (this.nextPage === 0) {
        this.hasMoreFeeds = false;
        return;
      }

      this.baseService.getFeeds(this.nextPage)
      .subscribe((feed:any) => {
        //process pagination url
        this.processPaginationUrl(feed);

        //load feeds
        feed.data.forEach((item) => {
          item.createdAt = new Date(item.createdAt);
          this.feeds.push(item);
        });

        //enable infinite scroll.
        setTimeout(() => {
          this.haltInfiniteScroll = false;
        }, 200);

      });

    }


    ngOnDestroy() {
      if (this.helpInterval) {
        clearInterval(this.helpInterval);
      };
    }

  }
