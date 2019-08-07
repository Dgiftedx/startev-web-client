declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";
import { User } from '../../../_models';
import { Location } from '@angular/common';
import { switchMap, first } from "rxjs/operators";
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService,} from '../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';


@Component({
	selector: 'app-cart-view',
	templateUrl: './cart-view.component.html',
	styleUrls: ['./cart-view.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartViewComponent implements OnInit {


	currentUser : User;
	transactionRef:Guid;
	transactionKey:any = 'pk_test_c76acb3b20e6cdf526d2c722cc0ba0021c411f43';
	public total:number = 0;
	public cart:any = [];
	public invoice:any = [];
	public showCart:boolean = true;
	public showMsgBox:boolean = false;
	public orderMessage:string = '';
	public deliveryAddress:string = '';
	private cartSubscription: Subscription;

	constructor(
		private cdr: ChangeDetectorRef,
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private _location: Location,
		private formBuilder: FormBuilder,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		this.transactionRef = Guid.create();
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
    }

	ngAfterViewInit(){
		this.cdr.detectChanges();
	}

	goBack(){
		this._location.back();
	}


	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	//========= Refresh Transaction Ref =================//
	refreshTransactionRef(){
		return this.transactionRef = Guid.create();
	}

	//============= Count ================//
	count(items:any){
		return _.size(items);
	}

	calculateTotal(){
		this.total = 0;
		this.cart.forEach(item => {
			this.total += (item.product.product_price * item.quantity);
			item.amount = (item.product.product_price * item.quantity);
		});

		setTimeout(() => {
			this.cdr.detectChanges();
		}, 500);

		return this.total;
	}

	increase(item:any){

		if (item.quantity !== 0) {
			item.quantity  += 1;
		}else{
			item.quantity = 1;
		}
	}


	decrease(item:any){
		if (item.quantity !== 1) {
			item.quantity  -= 1;
		}else{
			item.quantity = 1;
		}
	}


	// ===================== Remove ITem From Cart ==================//
	removeFromCart(item:any) {
		this.storeService.mainStoreRemoveFromCart(item.id)
		.subscribe(data => this.cart = data);

		this.calculateTotal();
	}

	// =================== Payment ======================//

	// transaction failled or user cancels the transaction
	transactionCancelled() {
		//refresh transactionRef
		this.refreshTransactionRef();
	}


	handleOrderResponse(data:any) {
		this.cart = data.cartItems;
		this.total = 0;
		this.deliveryAddress = '';
		this.invoice = data.invoice;
		this.showCart = false;
		this.showMsgBox = true;
	}


	transactionSuccessful(event:any){

		this.refreshTransactionRef();

		if (this.count(this.deliveryAddress) === 0 || this.count(this.deliveryAddress) < 7) {
			// empty or invalid address . Set user address as delivery address.
			this.deliveryAddress = this.currentUser.address;
		}

		let formData = new FormData();

		formData.append('items', JSON.stringify(this.cart));
		formData.append('transaction_ref', event.reference);
		formData.append('delivery_address', this.deliveryAddress);
		formData.append('user_id', this.currentUser.id);

		this.storeService.mainStorePlaceOrder(formData)
		.subscribe(data => {
			this.handleOrderResponse(data);
			this.refreshTransactionRef();
		})

	}


}
