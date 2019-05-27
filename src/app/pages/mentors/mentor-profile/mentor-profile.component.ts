import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap, first } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.css']
})
export class MentorProfileComponent implements OnInit {
	currentUser : User;
	progress;
  param;
  currentMentor;
  public followingIds: Array<any> = [];
  public mentors: Array<any> = [];

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


  profileTabs: string[] = ['followers','following','trainees'];
  selectedTab = this.profileTabs[0];



  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
   return this.baseService.echoJobTitle(roleData, role);
  }


  ngOnInit() {
    
    this.currentMentor = this.route.snapshot.data.mentor.profile;
    this.progress = this.profile.progress;
    //update following Ids
    this.updateFollowingIds(this.currentMentor.following);
  }

  get profile(){
    return this.currentMentor;
  }


  updateFollowingIds(followers: any){
    this.followingIds = [];
    followers.forEach((item) => {
      this.followingIds.push(item.id);
    });
  }

  public isFollowing(target: number){
    return this.followingIds.includes(target)?true:false;
  }

}
