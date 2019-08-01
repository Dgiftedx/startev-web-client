import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { BaseService, AuthenticationService } from '../../../_services';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sign-ups-widget',
	templateUrl: './sign-ups-widget.component.html',
	styleUrls: ['./sign-ups-widget.component.css']
})
export class SignUpsWidgetComponent implements OnInit {


	public signUps:any;
	public showSignUps:boolean = false;
	private signUpsSubscription:Subscription;

	constructor(
		private baseService : BaseService, 
		private authenticationService : AuthenticationService) { 
		this.signUpsSubscription = this.baseService.fetchNewSignup()
		.subscribe( data => {
			this.signUps = data;
			if (this.count(data) > 0) {
				this.showSignUps = true;
			}
		});
	}

	ngOnInit() {
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


	count(items:any) {
		return _.size(items);
	}

	//Algorithm to show user Job title
	echoJobTitle(roleData: any, role: string){
		return this.baseService.echoJobTitle(roleData, role);
	}
}
