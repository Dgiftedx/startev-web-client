import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Subscription } from 'rxjs'
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
  public industries:any = [];
  public people: Array<any> = [];
  private peopleSubscription : Subscription;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.peopleSubscription = this.baseService.getPeople()
    .subscribe((people: any) => {
      this.people = people;
    })
  }


  ngOnInit() {
    this.industries = this.route.snapshot.data.industries.industries;
  }

   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  total(mentor){
    return _.size(mentor);
  }

  followUser(id: number){
    this.onFollow(id);
  }

  
  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
   return this.baseService.echoJobTitle(roleData, role);
  }


  handleFollowResponse(data){
    this.people = data.people;
    this.alert.successMsg("You started following this user","Now Following");
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
