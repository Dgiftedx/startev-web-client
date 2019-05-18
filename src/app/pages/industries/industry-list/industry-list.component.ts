import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  ngOnInit() {
    this.industries = this.route.snapshot.data.industries;
  }

   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  total(mentor){
    return _.size(mentor);
  }

}
