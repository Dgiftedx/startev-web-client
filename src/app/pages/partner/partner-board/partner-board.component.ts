declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';

@Component({
  selector: 'app-partner-board',
  templateUrl: './partner-board.component.html',
  styleUrls: ['./partner-board.component.css']
})
export class PartnerBoardComponent implements OnInit {

 currentUser : User;
 partner:any;
 similar:any = [];

 userIsPartner: any;
 venturePartners : any;

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
    this.partner = this.route.snapshot.data.partnerView.result;
    this.userIsPartner = this.partner.userIsPartner;
    this.venturePartners = this.partner.venturePartners;
    this.partner.similar.forEach((item) => {
    	if (item.id !== this.partner.venture.id) {
    		this.similar.push(item);
    	}
    })
  }


   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }



}
