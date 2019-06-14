declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';

@Component({
	selector: 'app-general-profile',
	templateUrl: './general-profile.component.html',
	styleUrls: ['./general-profile.component.css']
})
export class GeneralProfileComponent implements OnInit {


	currentUser: User;
	profileData: any;
	currentUserData:any;
	public followingIds: Array<any> = [];


	constructor(
		private route : ActivatedRoute,
		private router: Router,
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
		// this.updateFollowingIds(this.currentUserData.followers);
	}

	//Algorithm to show user Job title
	echoJobTitle(roleData: any, role: string){
		return this.baseService.echoJobTitle(roleData, role);
	}


	// updateFollowingIds(followers: any){
	// 	this.followingIds = [];
	// 	followers.forEach((item) => {
	// 		this.followingIds.push(item.id);
	// 	});
	// }


	// public isFollowing(target: number){
	// 	return this.followingIds.includes(target)?true:false;
	// }


	//============ Profile Getter Method ===================//
	get profile(){
		return this.profileData;
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
