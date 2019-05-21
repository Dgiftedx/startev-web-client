import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
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
  public followingIds: Array<any> = [];
  private peopleSubscription : Subscription;

  currentUser: User;
  show: boolean = false;
  profileData: any;
  
  defaultBio = 'Your bio is not yet updated, but you can set it right  now as it captures the attention of other users on the platform.';

  profileTabs: string[] = ['followers','following','partners'];
  selectedTab = this.profileTabs[0];

  constructor(
    private route : ActivatedRoute,
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
   return this.baseService.echoJobTitle(roleData, role);
  }


  ngOnInit() {
    this.profileData = this.route.snapshot.data.profile.profileData;
  	this.getProfileData();
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


  handleFollowToggleResponse(data: any){
    //Update people to follow
    this.people = data.people;
    this.profileData.followers = data.followers;
    this.profileData.following = data.following;
    //update following Ids
    this.updateFollowingIds(data.following);
    this.alert.successMsg(data.message,"Updates");
  }

   handleProfileResponse(data: any){
    this.profileData = data.profileData;
    this.updateFollowingIds(data.profileData.following);
  }

  get profile(){
  	return this.profileData;
  }

   followUser(id: number){
      this.onToggleFollow(id);
  }

  unFollowUser(id: number){
      this.onToggleFollow(id);
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


   onToggleFollow(target: number){
     this.baseService.toggleFollow(this.currentUser.id, target)
    .subscribe(

        data => {
            this.handleFollowToggleResponse(data);
        }
      )
  }

}
