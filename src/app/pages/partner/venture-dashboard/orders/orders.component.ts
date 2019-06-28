import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService} from '../../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
	selector: 'app-user-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {


	currentUser:User;

	public sendingOrder:boolean = false;
	public page:number = 1;
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
		this.ordersSubscription = this.storeService.getOrders(this.currentUser.id)
		.subscribe(data => {
			this.handleOrdersInit(data);
		});
	}


	handleOrdersInit(data:any) {
		for ( let identifier in data ) {
			this.orders.push({
				name: data[identifier][0].name,
				order_id: identifier,
				items: this.count(data[identifier]),
				date: data[identifier][0].date.date,
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



	// =================== Forward orders =====================//
	forwardOrders(combinedOrder:any) {
		let orderIds = [];

		combinedOrder.orders.forEach(item  => {
			orderIds.push(item.product_id);
		});

		let data = {
			identifier: combinedOrder.orders[0].identifier,
			store_id: combinedOrder.orders[0].store_id,
			order_ids: orderIds
		};

		this.sendingOrder = true;

		this.storeService.forwardOrder(data)
		.subscribe(data => {
			this.alert.snotSimpleSuccess("Order has been forwarded for delivery");
			this.sendingOrder = false;
			this.singleOrder.forwarded = true;
			this.storeService.getOrders(this.currentUser.id)
			.subscribe(data => {
				this.handleOrdersInit(data);
			});
		})
	}


}
