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
    
    this.currentMentor = this.route.snapshot.data.mentor;
    this.progress = this.profile.progress;
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

}
