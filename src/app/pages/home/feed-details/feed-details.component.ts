declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Feed } from '../../../_models/feed';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { FeedService } from '../../../_services/feed.service';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';


@Component({
  selector: 'app-feed-details',
  templateUrl: './feed-details.component.html',
  styleUrls: ['./feed-details.component.css']
})
export class FeedDetailsComponent implements OnInit {
	currentUser : User;
	public people: Array<any> = [];
	private peopleSubscription : Subscription;


	public feed:any;
	public likers:any;

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private feedService : FeedService,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) { 
  		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  		//disable resuable route
	    this.router.routeReuseStrategy.shouldReuseRoute = function () {
	      return false;
	    };

  		this.peopleSubscription = this.baseService.getPeople()
	    .subscribe((people: any) => {
	      this.people = people;
	    });
    }

  ngOnInit() {
  	this.feed = this.route.snapshot.data.details.feed;
  	this.likers = this.route.snapshot.data.details.likers;
  }


  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
    return this.baseService.echoJobTitle(roleData, role);
  }

  count(items: any){
  	return _.size(items);
  }


  //====== Getter method for Current User Profile =======//

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


}
