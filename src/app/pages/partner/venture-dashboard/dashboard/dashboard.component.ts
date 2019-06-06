import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService} from '../../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
	selector: 'app-user-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	currentUser: User;

	public recentOrders:Array<any> = [];
	dashboardData:any = [];
	private dashboardSubscription : Subscription;


	constructor(
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		this.dashboardSubscription = this.storeService.dashboardData(this.currentUser.id)
		.subscribe(data => {this.dashboardData = data; this.handleRecentOrders(data);});
	}

	ngOnInit() {

		//
	}



  
	handleRecentOrders(data:any) {
		let orders = data.recent_orders;
		for ( let identifier in orders ) {
			for (let index in orders[identifier]) {
				this.recentOrders.push(orders[identifier][index]);
			}
		}
	}

	
  //====== Getter method for Current User Profile =======//

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  count(items:any)
  {
  	return _.size(items);
  }

}
