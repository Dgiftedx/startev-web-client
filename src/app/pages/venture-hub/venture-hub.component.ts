declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-venture-hub',
  templateUrl: './venture-hub.component.html',
  styleUrls: ['./venture-hub.component.css']
})
export class VentureHubComponent implements OnInit {

	currentUser : User;
	  param = null;
	  industry = {};
    ventures = [];

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.config.notFoundText = 'item not found';
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

 

   ngOnInit() {
    this.ventures = this.route.snapshot.data.ventures.ventures;
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


  count(items:any){
    return _.size(items);
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  isVentureOwner(profile:any, venture:any) {
    return (profile.role == 'business') && (venture.business_id === profile.roleData.id)?true:false;
  }


  clearSearch(){
    this.baseService.allVentures()
    .subscribe( (data : any) => {
      this.ventures = data.ventures;
    })

    $('#ventureSearch').val("");
  }
  
  searchVentures(event: Event): void {
    const stringEmitted = (event.target as HTMLInputElement).value;

    let data = {
      query: stringEmitted
    };

    this.ventureCustomSearch(data);
  }

  handleResponse(data : any){
    this.ventures = data.ventures;
  }


  ventureCustomSearch(queryForm:any) {

    this.baseService.searchVentures(queryForm)
    .subscribe( (data : any) => {
      this.ventures = data;
    });
  }

  getBusinessVentures(id : any){
    this.baseService.ventureByBusiness(id)
    .subscribe(
      data => {
        this.handleResponse(data);
      },

      error => {
        this.alert.errorMsg(error.error, "Request Failed");
      }

      )
  }
}
