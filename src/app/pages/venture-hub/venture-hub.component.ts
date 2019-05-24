import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Component, OnInit } from '@angular/core';
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
	  businesses = [];
	  selectedIndustry = {};

    ventures = [];
	  businessForm: FormGroup;

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

  createSearchForm(){
    this.businessForm = this.formBuilder.group({
      selected : [''],
    });
  }

   ngOnInit() {
    this.ventures = this.route.snapshot.data.ventures.ventures;
    this.createSearchForm();
    this.baseService.allBusiness()
    .subscribe((businesses :  any) => {
      this.businesses = businesses.all;
    })
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  isVentureOwner(profile:any, venture:any) {
    return (profile.role == 'business') && (venture.business_id === profile.roleData.id)?true:false;
  }
  
  showCurrentVentures(): void {
    this.getBusinessVentures(this.businessForm.value.selected);
  }

  handleResponse(data : any){
    this.ventures = data.ventures;
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
