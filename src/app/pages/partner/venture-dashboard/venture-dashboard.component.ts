declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
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

  	{id: 1, alias: "dashboard", name: "Dashboard"},
  	{id: 2, alias: "manage_orders", name: "Manage Orders"},
  	{id: 3, alias: "venture_products", name: "Venture Products"},
  	{id: 4, alias: "customer_reviews", name: "Customer Reviews"},
  	{id: 5, alias: "store_settings", name: "Store Settings"},
  	{id: 6, alias: "order_tracking", name: "Track Order"}

  ];

  public selectedNavigation = this.navigation[0];

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }


  ngOnInit() {
  }


  //============= Set Active Navigation ==================//
  setActiveNavigation(navigation:any) {
  	this.selectedNavigation = navigation;
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  hasAccess() {
    return this.profile.role !== 'student'?false:true;
  }

}
