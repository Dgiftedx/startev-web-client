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
	selector: 'app-store-manager-orders',
	templateUrl: './store-manager-orders.component.html',
	styleUrls: ['./store-manager-orders.component.css']
})
export class StoreManagerOrdersComponent implements OnInit {

	currentUser: User;

	public orders:any = [];
	public temp:any[] = [];

	public singleOrder:any = {};
	public selectedOrders:any[] = [];
	public showModBox:boolean = false;
	public showMainOrders:boolean = true;
	private ordersSubscription:Subscription;

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
		
	}

	ngOnInit() {

		//Get orders
		this.ordersSubscription = this.storeService.storeManagerGetOrders(this.currentUser.id)
		.subscribe(data => {
			this.handleOrdersInit(data);
		});
	}



	stableCall(){
		//Get orders
		this.ordersSubscription = this.storeService.storeManagerGetOrders(this.currentUser.id)
		.subscribe(data => {
			this.handleOrdersInit(data);
		});
	}


	handleOrdersInit(data:any) {
		this.orders = [];
		
		for ( let identifier in data ) {
			this.orders.push({
				name: data[identifier][0].name,
				order_id: identifier,
				items: this.count(data[identifier]),
				date: data[identifier][0].date,
				status: data[identifier][0].status
			});
		}

		this.temp = [...this.orders];
	}


	onSelect({ selected }) {
		this.selectedOrders.splice(0, this.selectedOrders.length);
		this.selectedOrders.push(...selected);
	}
	
	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}



	//================ table filtering ===================//

	updateFilter(event) {
		const val = event.target.value.toLowerCase();

		// filter our data
		const temp = this.temp.filter(function(d) {
			return d.order_id.toLowerCase().indexOf(val) !== -1 || !val;
		});

		// update the rows
		this.orders = temp;
		// Whenever the filter changes, always go back to the first page
		// this.table.offset = 0;
	}


	// ==================== Edit Order ===============================//

	editOrder(order_id: number) {

		this.storeService.getSingleOrder(order_id)
		.subscribe(data => {
			this.singleOrder = data;

			setTimeout(() => {
				this.showMainOrders = false;
				this.showModBox = true;
			});
		});
	}



	closeModBox(){
		this.showModBox = false;
		this.showMainOrders = true;
	}



	finallizeOrder(action:string, identifier:any) {

		let data = {
			action: action,
			order_id: identifier
		};

		this.storeService.storeManagerOrderAction(data)
		.subscribe( data => {
			this.stableCall();
			this.closeModBox();
		})
	}



}
