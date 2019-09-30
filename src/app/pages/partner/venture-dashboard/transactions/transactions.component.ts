declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../../../_services';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

	currentUser : User;

  public transactions:any = [];
	public showTransactions : boolean  = true;
	public hasTransactions : boolean = false;

   constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private storeService : StoreService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    //Get transactions
    this.getTransactions();
  }

  ngOnInit() {
  }

  getTransactions() {
    this.storeService.mainStoreGetTransactions(this.currentUser.id)
    .subscribe((resp:any) => {
      this.transactions = resp.transactions;
      this.hasTransactions = true;
    });
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

}
