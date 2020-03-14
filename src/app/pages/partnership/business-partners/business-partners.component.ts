declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { StoreService } from '../../../_services/store.service';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';

@Component({
  selector: 'app-business-partners',
  templateUrl: './business-partners.component.html',
  styleUrls: ['./business-partners.component.css']
})
export class BusinessPartnersComponent implements OnInit {

	currentUser: User;
	public currentPartner:any = {};
	public partnerships:any = [];
	public partnershipSubscription : Subscription;

  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private lightbox: Lightbox,
    private baseService: BaseService,
    private storeservice: StoreService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.partnershipSubscription = this.baseService.fetchBusinessPartners(this.currentUser.id)
      .subscribe((data: any) => {
        this.partnerships = data;
      });
    
  }

  ngOnInit() {
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

    if (type === 'banner') {
      
      if (this.count(item) === 0) {
        return '/assets/images/default/default.png';
      }

      return this.authenticationService.baseurl+item;
    }
  }

//============= Count Items ================//
  count(items:any) {
    return _.size(items);
  }


  viewLetter(partner:any) {
  	this.currentPartner = partner;
  	setTimeout(() => $(document).find('#letterModal').modal());
  }


  acceptPartner(partner: any){

    let data:any = {
      partner_id : partner.id,
      user_id : partner.user.id
    };

    this.baseService.applyToPartner(data, 'accept-partnership')
    .subscribe(
      data => {
        this.partnerships = data;
      })
  }

  rejectPartner(partner: any){

    let data:any = {
      partner_id : partner.id,
      user_id : partner.user.id
    };

    this.baseService.applyToPartner(data, 'reject-partnership')
    .subscribe(
      data => {
        this.partnerships = data;
      })
  }

  closeModal(){
    $(document).find('.modal').each(function() {
      $(this).modal('hide');
    })
  }

}
