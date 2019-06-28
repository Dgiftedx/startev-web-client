declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Lightbox } from 'ngx-lightbox';
import { Feed } from '../../../_models/feed';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { FeedService } from '../../../_services/feed.service';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';


@Component({
  selector: 'app-feed-details',
  templateUrl: './feed-details.component.html',
  styleUrls: ['./feed-details.component.css'],
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
export class FeedDetailsComponent implements OnInit {
	currentUser : User;
	public people: Array<any> = [];
	private peopleSubscription : Subscription;


	public feed:any;
  public showCommentBox:boolean = false;
  public comment = {
    feedId: null,
    text: ''
  };

  public commentForm : FormGroup;

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
    private lightbox: Lightbox,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private feedService : FeedService,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.peopleSubscription = this.baseService.getPeople()
    .subscribe((people: any) => {
      this.people = people;
    });
  }

  ngOnInit() {
  	this.feed = this.route.snapshot.data.details.feed;
  }


  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
    return this.baseService.echoJobTitle(roleData, role);
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
    this.feed.comments = data.comments;
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
  openStackedImages(images: Array<any>, index, title:string) {

    let imageArray: Array<any> = [];

    images.forEach((item) => {
      imageArray.push({
        src : item,
        caption : title
      });
    });
    
    this.lightbox.open(imageArray, index);
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
    this.feed.hasLiked = data.targetFeed.hasLiked;
    this.feed.likers = data.likers;
  }

  onToggleLike(target: number){
    this.baseService.toggleLike(this.currentUser.id, target)
    .subscribe(
      data => {
        this.handleLikeToggleResponse(data);
      }
      )
  }


}
