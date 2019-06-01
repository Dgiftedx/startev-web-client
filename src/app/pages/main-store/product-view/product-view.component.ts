declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService,} from '../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
	selector: 'app-product-view',
	templateUrl: './product-view.component.html',
	styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
	currentUser : User;


	public singleProduct:any = {};
	public selectedSingleImage:any = '';
	private productSubscription: Subscription;

	constructor(
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private _location: Location,
		private formBuilder: FormBuilder,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		this.config.notFoundText = 'item not found';
		// this.getIndustryList();
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		//subscribe to product
		this.productSubscription = this.storeService.mainStoreSingleProduct(this.route.snapshot.params.id)
		.subscribe( data => {
			this.singleProduct = data;
			this.selectedSingleImage = this.singleProduct.images[0];
		});
	}

	 productTabs: string[] = ['description','review'];
  	selectedTab = this.productTabs[0];


	ngOnInit() {
	}	

	goBack(){
		this._location.back();
	}


	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	//============= Count ================//
	count(items:any){
		return _.size(items);
	}




	//================= Mangement Methods ================//

	getFirstLetter(word:string){
		return word.charAt(0);
	}



}
