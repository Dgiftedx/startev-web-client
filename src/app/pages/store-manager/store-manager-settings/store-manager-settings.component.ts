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
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';

@Component({
	selector: 'app-store-manager-settings',
	templateUrl: './store-manager-settings.component.html',
	styleUrls: ['./store-manager-settings.component.css']
})
export class StoreManagerSettingsComponent implements OnInit {


	currentUser:User;

	selectForm2: FormGroup;

	public selectedVenture:number;
	public lockView:boolean = false;
	public settings:any = {};
	public sendingSettings:boolean = false;
	public showSettingsView:boolean = true;
	public showModificationBox:boolean = false;
	private settingsSubscription: Subscription;
	public bank_name: string = '';
	public bank_code: string = '';
	public readAccountNumber: boolean = false;
	public banks: any = [];
	public account_name: string = '';
	public account_number: string = '0';
	public verificationError: string = '';
	public isImage = false;
	public processedImage = '';
	public ventures:any = [];
	public ventureSubscription: Subscription;
	public sendingForm: boolean;
	private ventureData: any;
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
		);
		this.getBanks();
		this.selectForm2 = new FormGroup({
			selected: new FormControl()
		});
		this.ventureSubscription = this.storeService.storeManagerGetVentures(this.currentUser.id)
            .subscribe(data => {this.ventures = data;
				if (this.count(this.ventures) > 0) {
					this.selectForm2.controls['selected'].setValue(this.ventures[0].id);
					this.selectedVenture = this.ventures[0].id;
					this.getVentureData(this.ventures[0].id);
				}else{
					setTimeout(() => {
						this.lockView = true;
					}, 1000);
				}
			});

	}

	count(items: any) {
		return _.size(items);
	}

	getVentureData(ventureId:number) {
		if (ventureId) {
			this.storeService.storeManagerVentureData(ventureId, this.currentUser.id)
                .subscribe((data:any) => {
					this.ventureData = data;
					console.log(this.ventureData);
					if(this.ventureData.bank_code){
						this.bank_name=this.ventureData.bank_name;
						this.account_name=this.ventureData.account_name;
						this.account_number=this.ventureData.account_number;
						this.bank_code=this.ventureData.bank_code;
					}
				});
		}
	}

	changeAccountNumberBiz() {

		if (!this.account_number) {
			return;
		}
		console.log(this.account_number)

		//we only want to run this when the account number is exactly 10 digits
		if (this.count(this.account_number.toString()) === 10) {
			if (this.count(this.bank_name) === 0) {
				this.alert.warningMsg("Please select your bank to continue", "Select Bank");
				return;
			}

			let query = {
				bank_code: this.bank_code,
				account_number: this.account_number
			};

			//disable field and verify address
			this.readAccountNumber = true;

			this.baseService.postData(query, 'verify-account-number')
                .subscribe((resp: any) => {
					if (resp.success && resp.success == true) {
						this.account_name = resp.data.account_name;
						this.readAccountNumber = false;
					} else {
						this.readAccountNumber = false;
						this.verificationError = "we couldn't find your account. proceed only if you're sure";
					}
				});


		} else if (this.count(this.account_number.toString()) > 10) {
			return;
		} else {
			//enable input until it completed 10 digits
			this.readAccountNumber = false;
		}
	}

	getBanks() {
		this.baseService.getBanks()
            .subscribe((data: any) => {
				this.banks = data;
			});
	}

	setCurrentVenture(){
		this.selectedVenture = this.selectForm2.value.selected;
		// console.log(this.selectedVenture,this.selectForm2.value.selected)
	}


// ============ check null item and return default as required =======//
	updateAccountBusiness() {

		let errorTitle = "Account Update Error!";

		let values = {
			user_id: this.currentUser.id,
			venture_id: this.selectedVenture,
			bank_code: this.bank_code,
			bank_name: this.bank_name,
			account_name: this.account_name,
			account_number: this.account_number
		};


		// validate bank name
		if (this.count(this.bank_name) === 0 || this.count(this.bank_name) < 3) {
			this.alert.errorMsg("Please enter a valid bank full name. Please check", errorTitle);
			return;
		}

		// validate account name
		if (this.count(this.account_name) === 0) {
			this.alert.errorMsg("Your account name can't be empty. Please fill in your account full name", errorTitle);
			return;
		}
		this.sendingForm=true;
		this.baseService.postData(values, 'add-account-details-biz')
            .subscribe((resp: any) => {
				this.alert.snotSimpleSuccess("Your Venture Account has been updated.");
				this.sendingForm=false;
			});
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

	changeBankBiz() {
		let search = _.findLast(this.banks, ['code', this.bank_code]);
		this.bank_name = search.name;
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
