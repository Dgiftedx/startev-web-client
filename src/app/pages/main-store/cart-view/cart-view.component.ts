declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";
import { User } from '../../../_models';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, first } from "rxjs/operators";
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BaseService } from '../../../_services/base.service';
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
	transactionTestKey:any = 'pk_live_88361dabf717bb87148ec9858c651c1205f10bbe';
	transactionKey:any = 'pk_test_f85847722722f8f06e9091a4f45c1a6b261c4833';
	public total:number = 0;
	public grandTotal:number = 0;
	public suggestions:any = [];
	public cart:any = [];
	public server:any = [];
	public venturesId:any = [];
	public invoice:any = [];
	public showCart:boolean = true;
	public calculating:boolean = false;
	public showMsgBox:boolean = false;
	public orderMessage:string = '';
	public addressError:string = '';
	public verifyError:string = '';
	public deliveryFee : number;
	public searching:boolean = false;
	public deliveryAddress:string = '';
	public addressConfirmed:boolean = false;
	private cartSubscription: Subscription;
	public showPaymentButton:boolean = false;
	public processingOrder:boolean = false;
	public salePercentage: number;
	public percentage: number = 7.5;
	public proceed: boolean =false;
	date:any = Date.now().toString();
	public identifier: string = '';
	public ischeckout:boolean = true;
	public spin: boolean = false;
	public disabled: boolean = false;
	public off: boolean = false;

	// moderators
	public showConfirmButton:boolean = false;

	public addressNotFound:string = '<span class=\"text-danger apple-font\">Address not found:<span> you can choose the nearest address to your location';

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
		private baseService : BaseService,
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
				this.cart = items;
				this.gatherProductIds();
				//check if address of already logged in user is google verfied
				this.verifyLoggedUserAddress(this.currentUser);

			});
		}else{
			this.gatherProductIds();
			this.cart = this.getSavedCartInStorage();
		}

	}

	ngOnInit() {
		setTimeout(() => {this.cdr.detectChanges();}, 1000);
	}


	gatherProductIds(){
		this.cart.forEach(item => {
			this.venturesId.push({id:item.id, venture_id: item.product.venture_id});
		});
	}


	removeFromProductId(item:any){
		let search = _.findLastIndex(this.venturesId, ['id',item.id]);
		this.venturesId.splice(search,1);
	}


	//=====================================================
	// Address Search Functionality
	//=====================================================

	removeDuplicateWord(address){
		address = address.replace(/[ - ]/g," ").split(" ");
		let result = [];

		//remvoe duplicates
		for(let i =0; i < address.length ; i++){
		    if(result.indexOf(address[i]) == -1) result.push(address[i]);
		}
		//return filtered result
		return result.join(" ").replace(/,/g," ");
	}


	verifyLoggedUserAddress(params:any){
		//only if address is set and is valid
		if (this.count(params.address) > 4) {
			//remove duplicate words to fine tune the address
			let address = this.removeDuplicateWord(params.address);
			this.baseService.googleSearchPlaces(address)
			.subscribe((resp:any) => {
				if (this.count(resp) > 0) {
					//set address and calculate delivery charges
					this.selectEvent(resp[0]);
				}else{
					//address not found
					this.addressError = `Your address; <strong> ${address}. </strong> was not found. Please enter a delivery address above.`;
				}
			});
		}else{
			this.userData.address = '';
			this.addressError = `Your do not have a verified address. Please enter a delivery address above.`;
		}
	}

	selectEvent(item) {
		this.addressError = '';
		this.userData.address = item.name;
		this.calculateDeliveryFee(item, this.venturesId);
	}

	onChangeSearch(val: string) {
		this.verifyError = '';
		this.searching = true;
		this.baseService.googleSearchPlaces(val)
		.subscribe((resp:any) => {
			this.suggestions = resp;
			this.searching = false;
		});
	}


	calculateDeliveryFee(item:any, venturesId:any){
		this.calculating = true;
		let filteredIds:any = [];
		//filter array to hold only venture ids
		venturesId.forEach(item => {
			filteredIds.push(item.venture_id);
		});

		//make the call
		let data = {
			venture_ids : filteredIds,
			place_id : item.place_id
		};
		
		this.storeService.mainStoreCalculateDelivery(data)
		.subscribe((resp:any) => {
			//the response should be delivery fee/charge
			//add it to cart and notify customer
			if (resp.error) {
				this.verifyError = resp.error;
				this.showPaymentButton = false;
				return;
			}else{
				//show delivery price and add to total
				this.showPaymentButton = true;
				this.deliveryFee = resp.result.price;
				this.percentage = resp.result.percentage;
				this.salePercentage = ((this.total * this.percentage) / 100);
				// this.grandTotal = this.total + resp.result.price;
				// this.grandTotal = this.grandTotal + ((this.grandTotal * resp.result.percentage) / 100);
				// this.salePercentage = ((this.total * this.percentage) / 100);
				this.grandTotal = this.total + this.deliveryFee + this.salePercentage;
				setTimeout(() => {
					this.cdr.detectChanges();
				}, 500);
			}
		});
	}


	// Local storage manipulation

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

	calculateTotal() {
		if (this.count(this.cart) > 0) {
			this.total = 0;
			this.cart.forEach(item => {
				this.total += (item.product.product_price * item.quantity);
				item.amount = (item.product.product_price * item.quantity);
			});

			setTimeout(() => {
				this.cdr.detectChanges();
			}, 500);
			// console.log(this.total);
			this.salePercentage = ((this.total * this.percentage) / 100);
			this.grandTotal = this.total + this.deliveryFee + this.salePercentage;
			// this.grandTotal = this.grandTotal + ((this.grandTotal * 7.5) / 100);
			// this.grandTotal = this.grandTotal + ((this.grandTotal * 7.5) / 100);


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
			//remove from venturesId record
			this.removeFromProductId(item);
			let search = 
			this.storeService.mainStoreRemoveFromCart(item.id)
			.subscribe(data => {
				this.cart = data;
			});
		}else{
			this.sliceLocalCart(item);
			this.removeFromProductId(item);
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
		console.log(data);
		this.invoice = data.invoice;
		console.log(this.invoice);
		this.showCart = false;
		this.showMsgBox = true;
	}
	disable() {
		this.disabled = !this.disabled;
	}
	enable() {
		this.disabled = !this.disabled;
	}


	proceedToCheckout() {
		if (_.isEmpty(this.userData.address)) {
			// this.presentToast('Valid address is required');
		} else {
			// this.loader();
			this.spin = true;
			this.enable();
			let address = this.userData.address.name ? this.userData.address.name : this.userData.address;

			this.processingOrder = true;

			this.refreshTransactionRef();

			let formData = new FormData();
			formData.append('items', JSON.stringify(this.cart));
			formData.append('email', this.userData.email);
			formData.append('name', this.userData.name);
			formData.append('phone', this.userData.phone);
			formData.append('delivery_address', address);
			formData.append('user_id', this.currentUser ? this.currentUser.id : 0);

			this.storeService.mainStoreCalculateProduct(formData)
                .subscribe(data => {
					// this.disabled = !this.disabled;
					this.ischeckout = false;
					this.spin = false;
                	this.proceed = true;
                	console.log(data);
					let amount = data["amount"];
					// console.log(amount["amount"]);
					this.total = amount.total;
					this.deliveryFee = amount.deliveryFee;
					this.salePercentage = amount.salePercentage;
					this.grandTotal = amount.grandTotal;
					this.date = amount.order_time;
					this.identifier = amount.identifier;
					// this.showCart = false;
					// this.showCheckout = false;
					// this.orderSummary = true;
					// this.page = 'Order summary';
					// this.dismiss();
				}, error => {
					console.log(error);
				});
		}
	}

	transactionSuccessful(event:any){
		let address = this.userData.address.name?this.userData.address.name:this.userData.address;

		this.processingOrder = true;

		this.refreshTransactionRef();

		let formData = new FormData();

		let items_total:any = this.total;
		let deliveryFee:any = this.deliveryFee;
		let grand_total:any = this.grandTotal;

		formData.append('items', JSON.stringify(this.cart));
		formData.append('transaction_ref', event.reference);
		formData.append('email', this.userData.email);
		formData.append('name', this.userData.name);
		formData.append('phone', this.userData.phone);
		formData.append('items_total', items_total);
		formData.append('grand_total', grand_total);
		formData.append('delivery_fee', deliveryFee);
		formData.append('delivery_address', address);
		formData.append('identifier', this.identifier);
		formData.append('user_id', this.currentUser ? this.currentUser.id : 0);
		this.off = true;
		this.storeService.mainStorePlaceOrder(formData)
		.subscribe(data => {
			this.handleOrderResponse(data);
			this.refreshTransactionRef();
			this.processingOrder = false;
			this.proceed = false;
			this.off = false;
		});

	}



	ngAfterViewInit(){
		// this.cdr.detectChanges();
	}

}
