declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

	currentUser: User;

	notifications:any = [];
	notificationSubscription: Subscription;

	constructor(
		private route : ActivatedRoute,
		private router: Router,
		private alert: AlertService,
		private userService : UserService,
		private baseService: BaseService,
		private storeservice: StoreService,
		private authenticationService: AuthenticationService) {
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

	}


	ngOnInit() {
		this.notificationSubscription = this.baseService.getWidgetNotifications(this.currentUser.id)
		.subscribe( data => {
			this.notifications = data;
		})
	}



	public count(items:any){
		return _.size(items);
	}

	//=========== Profile Getter Method ==================//
	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

}
