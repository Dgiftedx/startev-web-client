import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { switchMap } from "rxjs/operators";
import { User } from '../../../_models';

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.css']
})
export class MentorProfileComponent implements OnInit {
	currentUser : User;
	progress;

   constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private baseSerivce : BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  ngOnInit() {
  	this.progress = this.profile.progress;
  }

   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

}
