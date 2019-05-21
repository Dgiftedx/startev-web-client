import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap, first } from "rxjs/operators";
import { Subscription } from 'rxjs'
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-partner-view',
  templateUrl: './partner-view.component.html',
  styleUrls: ['./partner-view.component.css']
})
export class PartnerViewComponent implements OnInit {
 currentUser : User;
 param = null;
 partner:any;
 similar:any = [];



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
