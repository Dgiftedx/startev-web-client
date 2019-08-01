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
	selector: 'app-user-ventures',
	templateUrl: './ventures.component.html',
	styleUrls: ['./ventures.component.css']
})
export class VenturesComponent implements OnInit {

	currentUser:User;

	public importingId:number = 0;
	public syncId:number = 0;
	public detachId:number = 0;
	public manageLadda:boolean = false;

	public ventureList:any = [];

	private venturesSubscription: Subscription;

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

		//Get Ventures
		this.venturesSubscription = this.storeService.getVentures(this.currentUser.id)
		.subscribe(data => this.ventureList = data);
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


	updateResources(){
		//Get Ventures
		this.venturesSubscription = this.storeService.getVentures(this.currentUser.id)
		.subscribe(data => this.ventureList = data);
	}



	handleSuccessResponse(data:any){
		this.alert.snotSimpleSuccess(data.message);
		this.updateResources();
	}

	//================== Import Products From Venture ===============//
	importProducts( ventureId: number ){
		
		this.importingId = ventureId;
		
		this.storeService.importProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleSuccessResponse(data);
			this.importingId = 0;
		});
	}


	//================== Syncronize Products ========================//
	syncronizeProducts( ventureId: number ){
		this.syncId = ventureId;

		this.storeService.syncProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleSuccessResponse(data);
			this.syncId = 0;
		});
	}


	//=================== Detach Imported Products ====================//
	detachProducts( ventureId: number ){
		this.detachId = ventureId;
		
		this.storeService.detachProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleSuccessResponse(data);
			this.detachId = 0
		});
	}

	//=================== Manage Imported Products ====================//
	manageProducts( ventureId: number ){
		this.manageLadda = true;
		setTimeout(() => this.manageLadda = false, 5000);
	}

}
