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
  selector: 'app-partner-view',
  templateUrl: './partner-view.component.html',
  styleUrls: ['./partner-view.component.css']
})
export class PartnerViewComponent implements OnInit {
 currentUser : User;
 partner:any;
 similar:any = [];
 sendingRequest:boolean = false;
 products:any = [];
 userIsPartner: any;
 venturePartners : any;
 partnershipLetter : string = '';

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
    this.products = this.partner.products;
    this.userIsPartner = this.partner.userIsPartner;
    this.venturePartners = this.partner.venturePartners;
    this.partner.similar.forEach((item) => {
    	if (item.id !== this.partner.venture.id) {
    		this.similar.push(item);
    	}
    })
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
      return this.authenticationService.baseurl + item;
    }
  }


  count(items: Array<any>) {
    return _.size(items);
  }

  isPending(partnerObj:any, partner: any){
    return (parseInt(partnerObj.venture_id) === parseInt(partner.venture.id)) && (partnerObj.status === 'pending')?true:false;
  }

  isRejected(partnerObj:any, partner: any){
    return (parseInt(partnerObj.venture_id) === parseInt(partner.venture.id)) && (partnerObj.status === 'rejected')?true:false;
  }

  isAccepted(partnerObj:any, partner: any){
    return (parseInt(partnerObj.venture_id) === parseInt(partner.venture.id)) && (partnerObj.status === 'accepted')?true:false;
  }

  isVentureOwner(profile:any, venture:any) {
    return (profile.role == 'business') && (venture.business_id === profile.roleData.id)?true:false;
  }

  applyToPartner( id: number ): void{

    this.sendingRequest = true;

    let data:any = {
      id : id,
      user_id : this.currentUser.id
    }

    if (_.size(this.partnershipLetter) > 0) {
      data.letter = this.partnershipLetter;
    }

    this.baseService.applyToPartner(data, 'apply-to-partner')
    .subscribe(

      data => {
        this.userIsPartner = data;
        this.alert.snotSimpleSuccess("Application Submitted");
        this.sendingRequest = false;
      }

     )
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }



}
