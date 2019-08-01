import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap, first } from "rxjs/operators";
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
	selector: 'app-follow',
	templateUrl: './follow.component.html',
	styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {

	currentUser:User;
	public people: Array<any> = [];
	private peopleSubscription : Subscription;


	constructor(
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private formBuilder: FormBuilder,
		private baseService : BaseService,
		private authenticationService: AuthenticationService) {
		this.config.notFoundText = 'item not found';
		// this.getIndustryList();
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		//get people to follow
		this.peopleSubscription = this.baseService.getPeople()
		.subscribe((people: any) => {
			this.people = people;
		});
	}

	ngOnInit() {
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
			return this.authenticationService.baseurl + item;
		}
	}

	count(items:any){
		return _.size(items);
	}

		//Algorithm to show user Job title
	echoJobTitle(roleData: any, role: string){
		return this.baseService.echoJobTitle(roleData, role);
	}


	followUser(id: number){
		this.onFollow(id);
	}

	//========================= Follow Toggle ==========================//

	handleFollowResponse(data){
		this.people = data.people;
		this.alert.successMsg("You started following this user","Now Following");
	}



	onFollow(target: number){
		this.baseService.follow(this.currentUser.id, target)
		.subscribe(

			data => {
				this.handleFollowResponse(data);
			},


			error => {
				//
			}

			)
	}



}
