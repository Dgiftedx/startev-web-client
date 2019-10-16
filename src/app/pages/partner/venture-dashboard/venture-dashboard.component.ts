declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';


@Component({
  selector: 'app-venture-dashboard',
  templateUrl: './venture-dashboard.component.html',
  styleUrls: ['./venture-dashboard.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [
          animate('200ms ease-out', style({transform: 'translateY(-100%)'}))
        ])
      ]),
    trigger('fadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ],
})

export class VentureDashboardComponent implements OnInit {	
  
  currentUser : User;


  //======= Dashboard Navigation ============//
  public navigation: Array<any> = [

  	{id: 1, alias: "dashboard", name: "Dashboard", icon: "fa fa-dashboard"},
  	{id: 2, alias: "view_orders", name: "View Orders", icon: "fa fa-shopping-cart"},
    {id: 3, alias: "order_tracking", name: "Track Order", icon: "fa fa-send"},
    {id: 4, alias: "view_products", name: "View Products", icon: "fa fa-eye"},
  	{id: 5, alias: "venture_products", name: "Products Dropship", icon: "fa fa-download"},
  	// {id: 6, alias: "customer_reviews", name: "Customer Reviews", icon: "fa fa-list-alt"},
    {id: 6, alias: "transactions", name: "Transactions", icon: "fa fa-bank"},
  	{id: 7, alias: "store_settings", name: "Store Settings", icon: "fa fa-cog"},

  ];

  public selectedNavigation = this.navigation[0];

  //========================================================
  // Dashboard
  //========================================================
  public recentOrders:Array<any> = [];
  dashboardData:any = [];

  //========================================================
  // View Orders
  //========================================================
  public sendingOrder:boolean = false;
  public page:number = 1;
  public orders:any = [];
  public orderTemp:any[] = [];

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
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    //Get dashboard data
    this.getDashboardData();
  }


  ngOnInit() {
  }


   count(items:any)
  {
    return _.size(items);
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


  //========================================================
  // Set Active Navigation
  //========================================================
  setActiveNavigation(navigation:any) {

    if (navigation.alias === 'dashboard') {

      //Call recent order method
      this.getDashboardData();

    }

    if (navigation.alias === 'view_orders') {

      //Get All Orders
      this.getOrders();
    }

    setTimeout(() => this.selectedNavigation = navigation);
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  hasAccess() {
    return this.profile.role !== 'student' && this.profile.role !== 'graduate'?false:true;
  }


  //========================================================
  // Dashboard Method
  //========================================================
  getDashboardData() {
    this.storeService.dashboardData(this.currentUser.id)
    .subscribe(data => {this.dashboardData = data; this.handleRecentOrders(data);});
  }

  handleRecentOrders(data:any) {
    let orders = data.recent_orders;

    //clean collection for new update;
    this.recentOrders = [];
    for ( let identifier in orders ) {
      for (let index in orders[identifier]) {
        this.recentOrders.push(orders[identifier][index]);
      }
    }
  }



  //=========================================================
  // View Orders Method
  //=========================================================
  getOrders(){
    //Get orders
    this.storeService.getOrders(this.currentUser.id)
    .subscribe(data => {
      this.handleOrdersInit(data);
    });
  }


  handleOrdersInit(data:any) {
    this.orders = data.orders;
  }

  onSelect({ selected }) {
    this.selectedOrders.splice(0, this.selectedOrders.length);
    this.selectedOrders.push(...selected);
  }

  //================ table filtering ===================//
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.orderTemp.filter(function(d) {
      return d.order_id.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.orders = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  // ==================== Edit Order ===============================//
  viewOrder(order:any) {

    this.singleOrder = order;
    console.log(order);

     setTimeout(() => {
        this.showMainOrders = false;
        this.showModBox = true;
      });
     
    // this.storeService.getSingleOrder(order_id)
    // .subscribe(data => {
    //   this.singleOrder = data;
    //   setTimeout(() => {
    //     this.showMainOrders = false;
    //     this.showModBox = true;
    //   });
    // });
  }

  closeModBox(){
    this.showModBox = false;
    this.showMainOrders = true;
  }



}
