declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { Lightbox } from 'ngx-lightbox';
import { User } from '../../../_models';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';

@Component({
	selector: 'app-general-profile',
	templateUrl: './general-profile.component.html',
	styleUrls: ['./general-profile.component.css']
})
export class GeneralProfileComponent implements OnInit {


	currentUser: User;
	profileData: any;
	people : any = [];
	currentUserData:any;
	public followingIds: Array<any> = [];


	profileTabs:any = [
	{id: 1, name: "Feeds", alias: "feeds", image: "/assets/images/ic1.png"},
	{id: 2, name : "Profile", alias : "Basic Info", image: "/assets/images/ic2.png"},
	{id: 3, name : "Connections", alias : "Connections", image: "/assets/images/ic3.png"},
	];



	public selectedTab = this.profileTabs[0];
	public userFeeds:any;
	private feedsSubscription: Subscription;

	public showCommentBox:boolean = false;
	public comment = {
		feedId: null,
		text: ''
	};

	constructor(
		private cdr: ChangeDetectorRef,
		private route : ActivatedRoute,
		private router: Router,
		private lightbox: Lightbox,
		private alert: AlertService,
		private userService : UserService,
		private baseService: BaseService,
		private storeservice: StoreService,
		private authenticationService: AuthenticationService) {
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.currentUserData = this.authenticationService.getUserData();

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

	}


	ngOnInit() {
		this.profileData = this.route.snapshot.data.profile.profileData;
		this.updateFollowingIds(this.route.snapshot.data.profile.myFollowers);
		this.getUserFeeds();
	}

	getUserFeeds(){
		this.feedsSubscription = this.baseService.fetchMyFeeds(this.profileData.user.id)
		.subscribe( data => {
			this.userFeeds = data;
		});
	}


	selectTab (tabIndex) {
		this.selectedTab = this.profileTabs[tabIndex];
	}


	isMore(text: string, level: number): boolean {
		return this.count(text) > level ? true:  false;
	}

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


	handleResponse(data:any) {
		this.profileData = data.profileData,
		this.updateFollowingIds(data.myFollowers);
	}

	stableData() {
		this.baseService.fetchGeneralProfile(this.profileData.user.slug)
		.subscribe(data => {
			this.handleResponse(data);
		});
		this.cdr.detectChanges();
	}

	//Algorithm to show user Job title
	echoJobTitle(roleData: any, role: string){
		return this.baseService.echoJobTitle(roleData, role);
	}

	ngAfterViewInit(){
		this.cdr.detectChanges();
	}


	updateFollowingIds(followers: any){
		this.followingIds = [];
		followers.forEach((item) => {
			this.followingIds.push(item.id);
		});


	}


	public isFollowing(target: number){
		return this.followingIds.includes(target)?true:false;
	}


	handleFollowToggleResponse(data: any){
		//Update people to follow
		this.people = data.people;
		this.profileData.followers = data.followers;
		this.profileData.following = data.following;
		//update following Ids
		this.updateFollowingIds(data.following);
		this.alert.successMsg(data.message,"Updates");
		this.stableData();
	}


	followUser(id: number){
		this.onToggleFollow(id);
	}

	unFollowUser(id: number){
		this.onToggleFollow(id);
	}

	onToggleFollow(target: number){
		this.baseService.toggleFollow(this.currentUser.id, target)
		.subscribe(

			data => {
				this.handleFollowToggleResponse(data);
			});
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



	//============ Profile Getter Method ===================//
	get profile(){
		return this.profileData;
	}


	get currentProfile () {
		return JSON.parse(this.authenticationService.getUserData());
	}

	//============= Item counter ==============//
	public count( items:any ) {
		return _.size(items);
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


}
