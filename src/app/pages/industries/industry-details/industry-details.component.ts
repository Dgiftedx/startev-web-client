import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap, first } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-industry-details',
  templateUrl: './industry-details.component.html',
  styleUrls: ['./industry-details.component.css']
})
export class IndustryDetailsComponent implements OnInit {
  industryMentors = [];
  currentUser : User;
  param = null;
  industry = {};
  industries = [];
  industriesArray = [];
  selectedIndustry = {};


  industryForm: FormGroup;


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
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }



  createSearchForm(){
    this.industryForm = this.formBuilder.group({
      selected : [''],
    });
  }


  ngOnInit() {
    this.getIndustryList();
    this.createSearchForm();
    this.route.paramMap.subscribe(params => {
      this.param = params.get("slug")
    })
    //make request for new single industry details
    this.getIndustryDetails(this.param);
  }


  showCurrentIndustry(): void {
    return this.getIndustryDetails(this.industryForm.value.selected);
  }




  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  handleResponse(data : any){
    this.industry = data.industry;
  }

  getIndustryList(){
    this.baseService.fetchAllIndustries().subscribe(data => {
            this.industriesArray = data.industries;
            this.industries = [...this.industriesArray];
        });
  }

  getIndustryDetails(slug : any){
    this.baseService.getSingleIndustry(slug)
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
