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

	public importLadda:boolean = false;
	public syncLadda:boolean = false;
	public detachLadda:boolean = false;
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
		this.alert.snotSuccess(data.message);
		this.updateResources();
	}

	//================== Import Products From Venture ===============//
	importProducts( ventureId: number ){
		this.importLadda = true;
		
		this.storeService.importProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleSuccessResponse(data);
			this.importLadda = false;
		});
	}


	//================== Syncronize Products ========================//
	syncronizeProducts( ventureId: number ){
		this.syncLadda = true;

		this.storeService.syncProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleSuccessResponse(data);
			this.syncLadda = false;
		});
	}


	//=================== Detach Imported Products ====================//
	detachProducts( ventureId: number ){
		this.detachLadda = true;
		
		this.storeService.detachProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleSuccessResponse(data);
			this.detachLadda = false;
		});
	}

	//=================== Manage Imported Products ====================//
	manageProducts( ventureId: number ){
		this.manageLadda = true;
		setTimeout(() => this.manageLadda = false, 5000);
	}

}
