import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService} from '../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-store-manager-settlements',
  templateUrl: './store-manager-settlements.component.html',
  styleUrls: ['./store-manager-settlements.component.css']
})
export class StoreManagerSettlementsComponent implements OnInit {
  
  currentUser: User;

  	public totalPayout:number = 0;
  	public pendingPayout:number = 0;
  	public paidSettlement:number = 0;
	public settlements:any = [];
	public settlementSubscription: Subscription;

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

		this.settlementSubscription = this.storeService.getCommonData(`payout/get-business-settlements/${this.currentUser.id}`)
		.subscribe((data:any) => {
			this.settlements = data.result; 
			this.settlements.forEach(item => {

				//Get total payout
				this.totalPayout += item.total;

				//Get pending payout
				if (item.status === 'pending') {
					this.pendingPayout += item.total;
				}

				//Get paid payout
				if (item.status === 'processed') {
					this.paidSettlement += item.total;
				}
			})
		});
	}

	ngOnInit() {

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

	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}

}
