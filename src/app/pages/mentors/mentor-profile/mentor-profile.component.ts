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


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.param = params.get("slug")
    })
    //make request for new single industry details
    this.getMentorProfile(this.param);

    this.progress = this.profile.progress;

    console.log(this.currentMentor);
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  set mentor(mentor){
    this.currentMentor = mentor;
  }

  get mentor(){

    if (typeof this.currentMentor === 'undefined') {
      setTimeout(() => {
        this.mentor(this.currentMentor);
      })
    }
    return this.currentMentor;
  }

  getMentorProfile(slug : any){
    this.baseService.getMentorProfile(slug)
    .subscribe(
      data => {
        return this.currentMentor = data.profile;
      }

      )
  }

}
