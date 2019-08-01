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
	selector: 'app-store-manager-ventures',
	templateUrl: './store-manager-ventures.component.html',
	styleUrls: ['./store-manager-ventures.component.css']
})
export class StoreManagerVenturesComponent implements OnInit {

	currentUser: User;

	public ventures:any = [];
	public ventureSubscription: Subscription;

	public formUrl:string = '';
	public formTitle:string = '';
	public noticeText:string ='';
	public buttonTitle:string = '';
	public ventureName:string = '';
	public ventureAddress:string = '';
	public ventureDescription:string = '';
	public showMainView:boolean = true;
	public updateVentureLadda:boolean = false;
	public showModificationBox:boolean = false;
	public showMaxVentureNotice:boolean = false;

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

		this.ventureSubscription = this.storeService.storeManagerGetVentures(this.currentUser.id)
		.subscribe(data => {this.ventures = data});
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


	updateResource() {
		this.ventureSubscription = this.storeService.storeManagerGetVentures(this.currentUser.id)
		.subscribe(data => {this.ventures = data});
	}


	
	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}


	// ====================== Detach Products From Venture ==================//

	handleDetachResponse(data:any){
		if (data.success) {
			this.alert.snotSimpleSuccess(data.message);
		}else{
			this.alert.infoMsg(data.message, "Request Failed");
		}

		this.updateResource();
	}

	detachProducts(venture_id:number) {
		this.storeService.storeManagerDetachPFromVenture(venture_id)
		.subscribe(data => this.handleDetachResponse(data));	
	}


	closeModificationBox(){
		this.ventureName = '';
		this.ventureDescription = '';
		this.ventureAddress = '';
		this.showMainView = true;
		this.showModificationBox = false;
		this.formTitle = '';
		this.formUrl = '';
		this.noticeText = '';
	}


	//===================== Edit Venture ==========================//

	findVenture(id:number) {
		return _.findLast(this.ventures, ['id',id]);
	}


	editVenture(venture_id:number){
		this.noticeText = 'Venture will be updated across the entire platform, and this will take effect immediately';
		this.formTitle = 'Modify';
		this.buttonTitle = 'Update Venture';
		this.showMaxVentureNotice = true;
		//get the venture to edit.
		let toEdit = this.findVenture(venture_id);

		this.formUrl = 'update-venture/'+venture_id;
		this.ventureName = toEdit.venture_name;
		this.ventureDescription = toEdit.venture_description;
		this.ventureAddress = toEdit.venture_address;

		setTimeout(() => {
			this.showMainView = false;
			this.showModificationBox = true;
		}, 1000);

	}

	//================== Add new Venture ====================//
	addNewVenture(){
		this.noticeText = 'Base on <strong>Startev</strong> policy,'
		+'you can only create maximum of 4 ventures. More that that? contact our support team.';

		this.formUrl = 'add-venture';
		this.formTitle = 'Create';
		this.buttonTitle = 'Create Venture';
		this.showMaxVentureNotice = true;

		this.ventureName = '';
		this.ventureDescription = '';
		this.ventureAddress = '';

		setTimeout(() => {
			this.showMainView = false;
			this.showModificationBox = true;
		}, 1000);

	}

	//=============== Validator =========================//
	validateFields(){
		if (this.count(this.ventureName) === 0) {
			this.alert.errorMsg("Please enter venture name","Error in Form");
			return;
		}

		if (this.count(this.ventureAddress) === 0) {
			this.alert.errorMsg("Please enter venture location address","Error in Form");
			return;
		}


		if (this.count(this.ventureDescription) < 20) {
			this.alert.errorMsg("Please enter valid venture description","Error in Form");
			return;
		}
	}


	//============== submission Handler =======================//

	handleVentureCreationResponse(data:any){
		if (!data.success) {
			this.alert.errorMsg(data.message, "Error has ocurred");
		}else{
			this.alert.snotSimpleSuccess(data.message);
		}

		this.updateResource();
		this.closeModificationBox();
	}

	onSubmitVenture(){
		this.updateVentureLadda = true;
		this.validateFields();

		let formData = new FormData();
		formData.append('venture_name',this.ventureName);
		formData.append('venture_address',this.ventureAddress);
		formData.append('venture_description',this.ventureDescription);
		// No errors, so submit
		this.storeService.storeManagerUpdateVenture(formData, this.profile.roleData.id, this.formUrl)
		.subscribe(data => {
			this.handleVentureCreationResponse(data);
			this.updateVentureLadda = false;
		});
	}

}
