declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";
import { User } from '../../../_models';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

	userData:any = {};

	currentUser : User;
	transactionRef:Guid;
	transactionKey:any = 'pk_live_88361dabf717bb87148ec9858c651c1205f10bbe';
	public total:number = 0;
	public cart:any = [];
	public server:any = [];
	public invoice:any = [];
	public showCart:boolean = true;
	public showMsgBox:boolean = false;
	public orderMessage:string = '';
	public deliveryAddress:string = '';
	private cartSubscription: Subscription;

	constructor(
		private http: HttpClient,
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


		if (this.currentUser && this.currentUser.id) {
			//user cart items
			this.cartSubscription = this.storeService.mainStoreGetCartItems()
			.subscribe(items => {
				this.userData.name = this.currentUser.name;
				this.userData.email = this.currentUser.email;
				this.userData.phone = this.currentUser.phone?this.currentUser.phone:0;
				this.userData.address = this.currentUser.address;
				this.cart = items;
			});
		}else{
			this.cart = this.getSavedCartInStorage();
		}


	}

	ngOnInit() {

		setTimeout(() => {this.cdr.detectChanges();}, 1000);
	}

	removeLocalStorageCart(){
		return localStorage.removeItem('cartItems');
	}

	getSavedCartInStorage(){
		return JSON.parse(localStorage.getItem('cartItems'));
	}

	clearCart(){
		this.removeLocalStorageCart();
		this.cart = [];
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
		if (this.count(this.cart) > 0) {
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
		if (this.currentUser) {
			this.storeService.mainStoreRemoveFromCart(item.id)
			.subscribe(data => this.cart = data);
		}else{
			this.sliceLocalCart(item);
		}

		this.calculateTotal();
	}


	updateLocalCart(){
		localStorage.setItem('cartItems', JSON.stringify(this.cart));
	}


	sliceLocalCart(item) {
		let cartItems = this.getSavedCartInStorage();
		let search = _.findLastIndex(cartItems, ['product_id',item.product_id]);

		cartItems.splice(search,1);
		this.cart = cartItems;
		this.updateLocalCart();
	}

	// =================== Payment ======================//

	// transaction failled or user cancels the transaction
	transactionCancelled() {
		//refresh transactionRef
		this.refreshTransactionRef();
	}


	handleOrderResponse(data:any) {
		this.clearCart();
		this.cart = [];
		this.total = 0;
		this.deliveryAddress = '';
		this.invoice = data.invoice;
		this.showCart = false;
		this.showMsgBox = true;
	}


	transactionSuccessful(event:any){

		this.refreshTransactionRef();

		let formData = new FormData();

		formData.append('items', JSON.stringify(this.cart));
		formData.append('transaction_ref', event.reference);
		formData.append('email', this.userData.email);
		formData.append('name', this.userData.name);
		formData.append('phone', this.userData.phone);
		formData.append('delivery_address', this.userData.address);
		formData.append('user_id', this.currentUser?this.currentUser.id:0);

		this.storeService.mainStorePlaceOrder(formData)
		.subscribe(data => {
			this.handleOrderResponse(data);
			this.refreshTransactionRef();
		})

	}



	ngAfterViewInit(){
		// this.cdr.detectChanges();
	}

}
