import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';
import { User } from '../../../_models';
import * as _ from 'lodash';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User;
  show: boolean = false;
  profileData = {};
  defaultBio = 'Your bio is not yet updated, but you can set it right  now as it captures the attention of other users on the platform.';

  profileTabs: string[] = ['connections','mentions','partners'];
  selectedTab = this.profileTabs[0];

  constructor(
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  	this.getProfileData();
  }

   handleProfileResponse(data: any){
    this.profileData = data.profileData;
    // console.log(data.profileData);
  }

  get profile(){
  	return this.profileData;
  }

  getProfileData(){
    this.baseService.fetchUserProfile()
    .subscribe(
        data => {
          this.handleProfileResponse(data);
        },
        error => {
          this.alert.errorMsg(error.error,"Request Failed");
        }
      )
  }

}
