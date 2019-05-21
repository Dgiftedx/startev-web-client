import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import * as _ from 'lodash';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public people: Array<any> = [];
  private peopleSubscription : Subscription;

  currentUser: User;
  show: boolean = false;
  profileData = {};
  defaultBio = 'Your bio is not yet updated, but you can set it right  now as it captures the attention of other users on the platform.';

  profileTabs: string[] = ['followers','following','partners'];
  selectedTab = this.profileTabs[0];

  constructor(
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.peopleSubscription = this.baseService.getPeople()
    .subscribe((people: any) => {
      this.people = people;
    })
  }



  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
    if (role === 'student') {
      return roleData.institution;
    }

    if (role === 'mentor') {
      
      if (roleData.employmentStatus === 'Own a Business') {
        return 'Business Owner';
      }

      if (roleData.employmentStatus === 'Employed' && _.size(roleData.workExperience) > 0) {
        let presentWork;

        roleData.workExperience.forEach((experience, index) => {
          if (experience.till_present) {
            presentWork = roleData.workExperience[index];
          }
        });

        return presentWork.position;
      }
    }
  }


  ngOnInit() {
  	this.getProfileData();
  }


  followUser(id: number){
    this.onFollow(id);
  }


  handleFollowResponse(data){
    this.people = data.people;
    this.alert.successMsg("You started following this user","Now Following");
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


   onFollow(target: number){
    this.baseService.follow(this.currentUser.id, target)
    .subscribe(

        data => {
            this.handleFollowResponse(data);
        },


        error => {
          //
        }

      )
  }

}
