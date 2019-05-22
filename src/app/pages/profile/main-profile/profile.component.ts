import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd , ActivatedRoute} from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public people: Array<any> = [];
  public followingIds: Array<any> = [];
  private peopleSubscription : Subscription;
  private ventureSubscription: Subscription;

  public ventures:any;
  public partners:any;
  currentUser: User;
  show: boolean = false;
  profileData: any;
  ventureName: string = '';
  ventureDescription: string = '';
  ventureUrl:string = '';
  ventureButton = '';
  
  defaultBio = 'Your bio is not yet updated, but you can set it right  now as it captures the attention of other users on the platform.';

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
    });

    
  }

  profileTabs: string[] = ['followers','following','partnerships'];
  selectedTab = this.profileTabs[0];


  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
   return this.baseService.echoJobTitle(roleData, role);
  }


  ngOnInit() {
    this.profileData = this.route.snapshot.data.profile.profileData;
  	this.getProfileData();
    if (this.profileData.role === 'business') {
        this.profileTabs = ['followers','following','partners','ventures'];
     }

     this.ventureSubscription = this.baseService.businessVentures(this.profileData.roleData.id)
    .subscribe((ventures: any) => {
      this.ventures = ventures.ventures;
      this.partners = ventures.partners;
    })

     // this.getVentures(this.profileData.roleData.id);
  }

  updateFollowingIds(followers: any){
    this.followingIds = [];
    followers.forEach((item) => {
      this.followingIds.push(item.id);
    });
  }


  acceptPartner(partner: any){
    this.baseService.applyToPartner(partner.id, partner.user.id, 'accept-partnership')
    .subscribe(
        data => {
          this.partners = data;
        }
     )
  }

  newVenture(): void {
    this.ventureButton = 'Create Venture';
    this.ventureUrl = 'new-venture';
    $(document).find('#ventureModal').modal();
  }


  editVenture(id: number){
    this.ventureButton = 'Update Venture';
    let venture = _.findLast(this.ventures, ['id',id]);

    if (venture) {
      this.ventureName = venture.venture_name;
      this.ventureDescription = venture.venture_description;

      this.ventureUrl = 'update-venture/'+id;
      $(document).find('#ventureModal').modal();

    }
  }



  public isFollowing(target: number){
    return this.followingIds.includes(target)?true:false;
  }


  closeModal(){
    $(document).find('.modal').each(function() {
        $(this).modal('hide');
      })
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

  handleVentureResponse(data){
    this.ventures = data.ventures;
    this.closeModal();
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


  getVentures(businessId: number){
    this.baseService.businessVentures(businessId)
    .subscribe(
        data => {
          this.handleVentureResponse(data);
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


  submitVenture(){

    if (_.size(this.ventureName) === 0 || _.size(this.ventureDescription) === 0) {
      this.alert.warningMsg("Sorry! you can't submit empty felds","Please review form");
      return false;
    }

    let formData = {
      business_id: this.profileData.roleData.id,
      venture_name: this.ventureName,
      venture_description: this.ventureDescription
    };

    this.baseService.updateVenture(formData, this.ventureUrl)
    .subscribe(
        data => {
          this.handleVentureResponse(data)
        }

      )
  }


  deleteVenture(id: number){
    this.baseService.removeVenture(this.profileData.roleData.id, id)
    .subscribe(

      data => {
        this.handleVentureResponse(data);
      }
      )
  }

}
