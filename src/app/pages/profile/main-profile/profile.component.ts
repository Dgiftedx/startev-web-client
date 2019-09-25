declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
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
export class ProfileComponent implements OnInit {
  public people: Array<any> = [];
  public followingIds: Array<any> = [];
  private peopleSubscription : Subscription;
  private ventureSubscription: Subscription;

  public ventures:any;
  public partners:any;
  currentUser: User;
  show: boolean = false;
  profileData: any;
  ventureName: string = '';
  ventureDescription: string = '';
  ventureUrl:string = '';
  ventureButton = '';

  public showCommentBox:boolean = false;
    public comment = {
    feedId: null,
    text: ''
  };

  public userFeeds:any;
  private feedsSubscription: Subscription;

  feedSlideConfig = {"slidesToShow": 1, "slidesToScroll": 1, "autoplay": true, "autoplaySpeed": 3000};
  
  defaultBio = 'Your bio is not yet updated, but you can set it right  now as it captures the attention of other users on the platform.';

  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private lightbox: Lightbox,
    private baseService: BaseService,
    private storeservice: StoreService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.peopleSubscription = this.baseService.getPeople()
    .subscribe((people: any) => {
      this.people = people;
    });

    this.getMyFeeds();
    
  }

  profileTabs:any = [
    {id: 1, name: "My Feeds", alias: "feeds", image: "/assets/images/ic1.png"},
    {id: 2, name : "basic", alias : "Basic Info", image: "/assets/images/ic2.png"},
    {id: 3, name : "followers", alias : "Followers", image: "/assets/images/ic2.png"},
    {id: 4, name : "following", alias : "Following", image: "/assets/images/ic2.png"},
    {id: 5, name: "partnerships", alias : "Partnerships", image: "/assets/images/ic3.png"}

  ];

  public selectedTab = this.profileTabs[0];

  getMyFeeds(){
    this.feedsSubscription = this.baseService.fetchMyFeeds(this.currentUser.id)
    .subscribe( data => {
      this.userFeeds = data;
    });
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
        return '/assets/images/default/avatar.jpg';
      }
      return this.authenticationService.baseurl+item;
    }

    if (type === 'banner') {
      
      if (this.count(item) === 0) {
        return '/assets/images/default/default.png';
      }

      return this.authenticationService.baseurl+item;
    }
  }


  selectTab (tabIndex) {
    if (this.profileTabs[tabIndex].alias === 'feed') {
      // this.getMyFeeds();
    }

    this.selectedTab = this.profileTabs[tabIndex];
  }


  ngOnInit() {
    this.profileData = this.route.snapshot.data.profile.profileData;
    this.getProfileData();

    if (this.profileData.role === 'business') {
        this.profileTabs = [
          {id: 1, name: "My Feeds", alias: "feeds", image: "/assets/images/ic1.png"},
          {id: 2, name : "basic", alias : "Basic Info", image: "/assets/images/ic2.png"},
          {id: 3, name : "followers", alias : "Followers", image: "/assets/images/ic2.png"},
          {id: 4, name : "following", alias : "Following", image: "/assets/images/ic2.png"},
          {id: 5, name: "partnerships", alias : "Partnerships", image: "/assets/images/ic3.png"}
        ];


      this.ventureSubscription = this.baseService.fetchBusinessPartners(this.currentUser.id)
      .subscribe((data: any) => {
        this.partners = data;
        this.ventures = [];
      });
    }


    if (this.profileData.role !== 'business') {
  
      this.ventureSubscription = this.baseService.fetchMyPartners(this.currentUser.id)
      .subscribe( (data : any) => {
        this.partners = data;
        this.ventures = [];
      });

    }

    // this.getVentures(this.profileData.roleData.id);

    this.selectTab(0);
  }


  //============= Count Items ================//
  count(items:any) {
    return _.size(items);
  }


  isMore(text: string, level: number): boolean {
    return this.count(text) > level ? true:  false;
  }


  updateResources(){
    this.ventureSubscription = this.baseService.businessVentures(this.profileData.roleData.id)
    .subscribe((ventures: any) => {
      this.ventures = ventures.ventures;
      this.partners = ventures.partners;
    });
  }

  updateFollowingIds(followers: any){
    this.followingIds = [];
    followers.forEach((item) => {
      this.followingIds.push(item.id);
    });
  }


  acceptPartner(partner: any){

    let data:any = {
      partner_id : partner.id,
      user_id : partner.user.id
    };

    this.baseService.applyToPartner(data, 'accept-partnership')
    .subscribe(
      data => {
        this.partners = data;
      })
  }

  newVenture(): void {
    this.clearnVenture();

    this.ventureButton = 'Create Venture';
    this.ventureUrl = 'add-venture';
    $(document).find('#ventureModal').modal();
  }


  editVenture(id: number){
    this.clearnVenture();

    this.ventureButton = 'Update Venture';
    let venture = _.findLast(this.ventures, ['id',id]);

    if (venture) {
      this.ventureName = venture.venture_name;
      this.ventureDescription = venture.venture_description;

      this.ventureUrl = 'update-venture/'+id;
      $(document).find('#ventureModal').modal();

    }
  }


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

  public isFollowing(target: number){
    return this.followingIds.includes(target)?true:false;
  }


  closeModal(){
    $(document).find('.modal').each(function() {
      $(this).modal('hide');
    })
  }



  //============== Fetch Feed ==================//
  removeFeedFromThread(feed_id:number) {
    let index =  _.findIndex(this.userFeeds, ['id', feed_id]);
    //remove feed item
    this.userFeeds.splice(index, 1);
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
        this.alert.snotSimpleSuccess("Feed hidden");
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
        this.alert.snotSimpleSuccess("feed has been removed");
      });
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

  handleProfileResponse(data: any){
    this.profileData = data.profileData;
    this.updateFollowingIds(data.profileData.following);
  }

  handleVentureResponse(data){

    if (!data.success) {
      this.alert.errorMsg(data.message, "Error has ocurred");
    }else{

      this.alert.snotSuccess(data.message);
      this.updateResources();
      this.closeModal();
    }

    this.clearnVenture();
  }

  get profile(){
  	return this.profileData;
  }

  followUser(id: number){
    this.onToggleFollow(id);
  }

  unFollowUser(id: number){
    this.onToggleFollow(id);
  }

  getProfileData(){
    this.baseService.fetchUserProfile()
    .subscribe(
      data => {
        this.handleProfileResponse(data);
      },
      error => {
        this.alert.errorMsg(error.error,"Request Failed");
      }
      )
  }


  getVentures(businessId: number){
    this.baseService.businessVentures(businessId)
    .subscribe(
      data => {
        this.handleVentureResponse(data);
      },
      error => {
        this.alert.errorMsg(error.error,"Request Failed");
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


  onToggleFollow(target: number){
    this.baseService.toggleFollow(this.currentUser.id, target)
    .subscribe(

      data => {
        this.handleFollowToggleResponse(data);
      });
  }


  clearnVenture(){
    this.ventureUrl = '';
    this.ventureName = '';
    this.ventureDescription = '';
  }

  submitVenture(){

    if (_.size(this.ventureName) === 0 || _.size(this.ventureDescription) === 0) {
      this.alert.warningMsg("Sorry! you can't submit empty felds","Please review form");
      return false;
    }

    let formData = {
      business_id: this.profileData.roleData.id,
      venture_name: this.ventureName,
      venture_description: this.ventureDescription
    };

    this.storeservice.storeManagerUpdateVenture(formData, this.profileData.roleData.id, this.ventureUrl)
    .subscribe(
      data => {
        this.handleVentureResponse(data)
      });
  }


  deleteVenture(id: number){
    this.baseService.removeVenture(this.profileData.roleData.id, id)
    .subscribe(

      data => {
        this.handleVentureResponse(data);
      }
      )
  }

}
