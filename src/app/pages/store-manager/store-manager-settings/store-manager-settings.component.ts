import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Cropper } from '../../../../assets/lib/cropper.js';
import { User } from '../../../_models';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { CustomFilePickerAdapter } from '../../../file-picker.adapter';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService} from '../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
	selector: 'app-store-manager-settings',
	templateUrl: './store-manager-settings.component.html',
	styleUrls: ['./store-manager-settings.component.css']
})
export class StoreManagerSettingsComponent implements OnInit {


	currentUser:User;

	public settings:any = {};
	public sendingSettings:boolean = false;
	public showSettingsView:boolean = true;
	public showModificationBox:boolean = false;
	private settingsSubscription: Subscription;


	constructor(
		private http: HttpClient,
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private baseService: BaseService,
		private formBuilder : FormBuilder,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		this.settingsSubscription = this.storeService.storeManagerGetSettings(this.profile.roleData.id)
		.subscribe(
			data => {this.settings = data;}
		)
	}



	ngOnInit() {
	}


	updateResources()
	{
		this.settingsSubscription = this.storeService.storeManagerGetSettings(this.profile.roleData.id)
		.subscribe(
			data => {this.settings = data;}
		)
	}

	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
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

		if (type === 'bool') {
			if (item) {
				return 'Yes';
			}

			return nullValue;
		}


		if (type === 'integer') {
			
			if (item && this.count(item.toString()) === 0) {
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


	//================== Open Modification Box ====================//
	openModificationBox(){
		this.showSettingsView = false;
		this.showModificationBox = true;
	}

	//=================== Close Modification Box ====================//

	closeModificationBox(){
		this.showSettingsView = true;
		this.showModificationBox = false;
		this.updateResources();
	}



	//================ Submit Settings Form =====================//

	onSubmitSettings(){

		this.sendingSettings = true;

		this.storeService.storeManagerUpdateSettings(this.profile.roleData.id, {
			enable_returns : this.settings.enable_returns,
			max_return_days : this.settings.max_return_days,
			customer_care_line : this.settings.customer_care_line,
			working_days: JSON.stringify(this.settings.working_days)
		})
		.subscribe( data => {
			this.sendingSettings = false;
			this.closeModificationBox();
			this.alert.snotSimpleSuccess("Settings Updated successfully");
		});
	}

}
