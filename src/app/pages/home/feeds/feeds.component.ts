import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models';
import { Router, NavigationEnd } from '@angular/router';
import { AlertService, AuthenticationService, UserService } from '../../../_services';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {

  currentUser : User;
  constructor(
    private router: Router,
    private alert: AlertService,
    private userSerivce : UserService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }


   get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

}
