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

	public cart:any = [];
	public singleProduct:any = {};
	public selectedSingleImage:any = '';
	private cartSubscription: Subscription;
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

		//user cart items
	    this.cartSubscription = this.storeService.mainStoreGetCartItems()
	    .subscribe(items => {
	      this.cart = items;
	    });

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


	 //================== Add to cart ==============================//


  checkForError(data:any){
    if (data.message) {
      this.alert.infoMsg(data.message,"Info");
      return true;
    }
  }

  addToCart(productSku: any, productId:number) {

      let toCart = {
        product_id: productId, 
        product_sku: productSku,
        store_identifier: this.route.snapshot.params.identifier,
        user_id: this.currentUser.id
      };

      this.storeService.mainStoreAddToCart(toCart)
      .subscribe( items => {

        //first check for notice
        if (!this.checkForError(items)) {
          this.cart = items;
          this.alert.snotSimpleSuccess("Added to cart");
        }
        
      });
  }



}
