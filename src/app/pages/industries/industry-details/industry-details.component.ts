import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap, first } from "rxjs/operators";
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-industry-details',
  templateUrl: './industry-details.component.html',
  styleUrls: ['./industry-details.component.css']
})
export class IndustryDetailsComponent implements OnInit {
  industryMentors = [];
  currentUser : User;
  param = null;
  industry:any = {};
  industries = [];
  maximumTrainer:number = 25;
  industriesArray = [];
  selectedIndustry = {};
  connectStatus:string = '';
  public people: Array<any> = [];
  private peopleSubscription : Subscription;


  industryForm: FormGroup;


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

    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    //get people to follow
    this.peopleSubscription = this.baseService.getPeople()
    .subscribe((people: any) => {
      this.people = people;
    });
  }



  createSearchForm(){
    this.industryForm = this.formBuilder.group({
      selected : [''],
    });
  }


  ngOnInit() {
    this.industries = this.route.snapshot.data.industries;
    this.createSearchForm();
    //make request for new single industry details
    this.industry = this.route.snapshot.data.industry;

    setTimeout(() => {
      this.filterConnections(this.route.snapshot.data.industry.connections, false);
    }, 800);
  }

  count(items:any){
    return _.size(items);
  }


  // ============ check null item and return default as required =======//
  checkValue(item:any,  type:string, nullValue:string) {
    if (type === 'text') {
      if (this.count(item) === 0) {
        return nullValue;
      }
      return item;
    }

    if (type === 'avatar') {

      if (this.count(item) === 0) {
        return 'assets/images/default/avatar.jpg';
      }
      return item;
    }
  }


  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
    return this.baseService.echoJobTitle(roleData, role);
  }


  followUser(id: number){
    this.onFollow(id);
  }

  showCurrentIndustry(): void {
    return this.getIndustryDetails(this.industryForm.value.selected);
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  //====================== Get Industry Details ======================//
  handleResponse(data : any){
    this.industry = data;

    setTimeout(() => {
      this.filterConnections(data.connections, false);
    }, 800);
  }

  getIndustryDetails(slug : any){
    this.baseService.getSingleIndustry(slug)
    .subscribe(
      data => {
        this.handleResponse(data);
      },


      error => {
        this.alert.errorMsg(error.error, "Request Failed");
      }

      )
  }


  //========================= Follow Toggle ==========================//

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

  //==================== Connection Toggle =================//

  filterConnections(data:any, isMain:boolean){

    let mentorsId = [];

    if (isMain) {
      data.connections.forEach(item => {
        mentorsId.push(item.trainer_id);
      });
    }else{
      data.forEach(item => {
        mentorsId.push(item.trainer_id);
      });
    }

    this.industry.industry.mentors.forEach(item => {
      if (mentorsId.includes(item.id)) {
        item.is_connected = true;
      }else{
        item.is_connected = false;
      }
    });


    if (data.message) {
      this.connectStatus = data.message;
    }

  }


  toggleConnect(mentor:number) {

    this.baseService.toggleConnection(this.currentUser.id, mentor)
    .subscribe( data => {
      this.filterConnections(data, true);

      setTimeout(() => {
        this.alert.snotSuccess(this.connectStatus);
      }, 400);

    });
  }

}
