declare var $: any;
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
import { trigger, style, animate,state, transition } from '@angular/animations';

@Component({
	selector: 'app-user-tracker',
	templateUrl: './tracker.component.html',
	styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {


	currentUser:User;

	public order:any = {};
	public orderId:any = '';
	public tracking:boolean = false;
	public noticeMsg:string = '';
	public showNotice : boolean = false;
	public trackingInformation:any;

	constructor(
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}


	ngOnInit() {
	}



	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}

	closeNoticeBox(){
		this.showNotice = false;
	}


	// ================= Handle tracking response ===============//

	handleTrackingResponse(data){
		if (!data.success) {
			
			this.noticeMsg = data.message;

		}else{
			this.order = data.order;
			this.alert.successMsg(data.message, "Success");
		}
	}


	//================= Track Order ==================//
	trackOrder(){
		this.tracking = true;


		if (this.orderId && this.count(this.orderId.toString()) === 0) {
			this.alert.infoMsg("Enter valid orderId","Some Value Missing");
			return;
		}
		this.storeService.trackOrder(this.orderId, this.currentUser.id)
		.subscribe(data => {this.handleTrackingResponse(data); this.showNotice = true; this.tracking = false;});
	}
	

}
