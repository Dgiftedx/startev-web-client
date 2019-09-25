import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
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
	 // Decorator wires up blockUI instance
  	 @BlockUI('products-list') blockUIList: NgBlockUI;

	currentUser:User;

	public loadingProducts:boolean = false;
	public ventureId:number = 0;
	public syncId:number = 0;
	public detachId:number = 0;
	public manageLadda:boolean = false;
	public showAttachmentView:boolean = false;
	public ventureList:any = [];
	public fetchedProducts:any = [];
	public checkItems:any = [];
	public checkAll:any;

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

	//================ Count ITems
	count(items:any)
	{
		return _.size(items);
	}


	updateResources(){
		//Get Ventures
		this.venturesSubscription = this.storeService.getVentures(this.currentUser.id)
		.subscribe(data => this.ventureList = data);
	}



	handleFetchedProducts(data:any){
		this.fetchedProducts = data.products;
		//give a time to close loader
		setTimeout(() => {
			this.blockUIList.stop();
			this.loadingProducts = false;
		}, 2000);
	}


	//================== Check all products =========================//
	changeCheckAll(){
		if (this.checkAll) {
			this.checkItems = [];
			this.fetchedProducts.forEach(item => {
				item.selected = true;
				this.checkItems.push(item.id);
			});
		}else{
			this.fetchedProducts.forEach(item => {
				item.selected = false;
			});
			this.checkItems = [];
		}
	}

	//================= Check Single Product ========================//
	changeSingleCheck(product:any){
		if (product.selected) {
			//push to array
			this.checkItems.push(product.id);
		}else{
			//remove from array
			this.checkItems = this.checkItems.filter(item => item !== product.id);
		}
	}

	//================== Fetch Importable Products From Venture ===============//
	fetchProducts( ventureId: number ){
		this.showAttachmentView = true;
		this.ventureId = ventureId;
		this.loadingProducts = true;
		this.blockUIList.start();
		
		this.storeService.fetchProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.handleFetchedProducts(data);
		});
	}

	closeView(){
		this.showAttachmentView = false;
	}


	//================ Import Selected Products ========================//
	importSelected(){

		if (this.count(this.checkItems) === 0) {
			this.alert.infoMsg("no product is selected for import", "Import Error!");
			return;
		}

		let importData = {
			user_id : this.currentUser.id,
			venture_id : this.ventureId,
			imports : this.checkItems
		};

		this.storeService.importProducts(importData)
		.subscribe(data => {
			this.showAttachmentView = false;
			this.updateResources();
			this.checkAll = false;
			this.checkItems = [];
			this.alert.successMsg("Products has been imported successfully and now avaliable in your store. Auto sync has been activated", "Import Successful");
		});
	}


	//=================== Detach Imported Products ====================//
	detachProducts( ventureId: number ){
		this.detachId = ventureId;
		
		this.storeService.detachProducts(this.currentUser.id, ventureId)
		.subscribe(data => {
			this.updateResources();
			this.detachId = 0
		});
	}

	//=================== Manage Imported Products ====================//
	manageProducts( ventureId: number ){
		this.manageLadda = true;
		setTimeout(() => this.manageLadda = false, 5000);
	}

}
