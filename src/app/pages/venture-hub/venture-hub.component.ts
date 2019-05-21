import { Component, OnInit } from '@angular/core';
import { User } from '../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../_services';
import { switchMap, first } from "rxjs/operators";
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { VentureResolve } from '../../_resolvers/venture.resolver'

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
