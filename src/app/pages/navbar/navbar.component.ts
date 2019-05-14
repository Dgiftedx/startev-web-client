import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../_services';
import { User } from '../../_models';
import { Functions } from '../../_helpers';
import * as _ from 'lodash';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User;
  show: boolean = false;
  industries = [];

  constructor(
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  ngOnInit() {
    this.navBarIndustryList();
  }


  handleIndustriesResponse(data: any){
    this.industries = data.industries;
    this.industries.forEach(item => {
        item.totalMentors = _.size(item.mentors);
    });
  }

  navBarIndustryList(){
    this.baseService.fetchIndustries()
    .subscribe(
        data => {
          this.handleIndustriesResponse(data);
        },

        error => {
          this.alert.errorMsg(error.error,"Request Failed");
        }
      )
  }

  toggleMenu(){
    this.show = this.show === false ? true : false;
  }

  progress(){
    return this.profile.progress + '%';
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
