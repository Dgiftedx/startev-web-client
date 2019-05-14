import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService, AlertService, BaseService } from '../../../_services';
import * as _ from 'lodash';


@Component({
  selector: 'app-industry-list',
  templateUrl: './industry-list.component.html',
  styleUrls: ['./industry-list.component.css']
})
export class IndustryListComponent implements OnInit {

  currentUser : User;
  industries = [];
  
  constructor(
    private router: Router,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  ngOnInit() {
    this.allIndusries();
  }

   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

    handleIndustriesResponse(data: any){
    this.industries = data.industries;
    this.industries.forEach(item => {
        item.totalMentors = _.size(item.mentors);
    });
  }

   allIndusries(){
    this.baseService.fetchAllIndustries()
    .subscribe(
        data => {
          this.handleIndustriesResponse(data);
        },

        error => {
          this.alert.errorMsg(error.error,"Request Failed");
        }
      )
  }

}
