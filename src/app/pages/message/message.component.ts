declare var $: any;
import * as _ from 'lodash';
import { User, Typing, Message } from '../../_models';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, Observable, interval} from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { switchMap, first, startWith, map} from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService, TypingService} from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
	currentUser:User;

	public navigation:Array<any> = [

	{id: 1, alias: "conversations", name: "Conversations", icon: "fa-comment"},
	{id: 2, alias: "contact_list", name: "Contact List", icon: "fa-list"},
	// {id: 3, alias: "chat_rooms", name: "Chat Rooms", icon: "fa-comments"},
	];

	public selectedNav = this.navigation[0];

	public userData : any = {};

	constructor(
		private http : HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private alert: AlertService,
		private loaderService : NgxUiLoaderService,
		private baseService : BaseService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		this.userData = JSON.parse(this.authenticationService.getUserData());
	}

	ngOnInit() {

		if (this.userData && this.userData.role === 'mentor') {
			this.navigation.push({id:3, alias: 'broadcast_schedule', name: "Broadcast Schedule", icon: "fa-calendar"});
			this.navigation.push({id:4, alias: 'live_broadcast', name: "Live Broadcast", icon: "fa-television"});
		}

		if ( (this.userData && this.userData.role === 'student') || (this.userData && this.userData.role === 'graduate') ) {
			this.navigation.push({id:3, alias: 'join_session', name: "Join Live Sessions", icon: "fa-television"});
		}
	}


	setSelected(nav:any) {
		// this.loaderService.start();
		this.selectedNav = nav;
		// setTimeout(() => {
	 //      this.loaderService.stop(); 
	 //      // stop foreground spinner of the loader "loader-01" with 'default' taskId
	 //    }, 3000);
	}

}
