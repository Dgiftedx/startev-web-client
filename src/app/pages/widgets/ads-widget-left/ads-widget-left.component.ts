declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';

@Component({
  selector: 'app-ads-widget-left',
  templateUrl: './ads-widget-left.component.html',
  styleUrls: ['./ads-widget-left.component.css']
})
export class AdsWidgetLeftComponent implements OnInit {


  currentUser : User;
  public adverts:any = [];

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.config.notFoundText = 'item not found';
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.getAdverts();
  }

  ngOnInit() {
  }


  getAdverts() {
  	this.baseService.getAdverts()
  	.subscribe((resp:any) => {
  		this.adverts = resp.adverts;
  	});
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
      return this.authenticationService.baseurl+"/storage" + item;
    }
  }


  count(items:any){
    return _.size(items);
  }

}
