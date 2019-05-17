import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap } from "rxjs/operators";

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


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private baseSerivce : BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }


  ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.param = params.get("slug")
  })
    //make request for new single industry details
   this.getIndustryDetails(this.param);
  }

   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  handleResponse(data : any){
    this.industry = data.industry;
  }

  getIndustryDetails(slug : any){
    this.baseSerivce.getSingleIndustry(slug)
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
