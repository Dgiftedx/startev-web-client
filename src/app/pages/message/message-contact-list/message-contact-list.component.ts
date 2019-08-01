declare var $: any;
import * as _ from 'lodash';
import { User } from '../../../_models';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, interval} from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService} from '../../../_services';
import { trigger, style, animate,state, transition } from '@angular/animations';

@Component({
	selector: 'app-message-contact-list',
	templateUrl: './message-contact-list.component.html',
	styleUrls: ['./message-contact-list.component.css']
})
export class MessageContactListComponent implements OnInit {


	currentUser : User;
	contactList : Array<any> = [];
	connections : Array<any> = [];
	contactListSubscriptions : Subscription;
	connectionsSubscription : Subscription;

	constructor(
		private http : HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private alert: AlertService,
		private baseService : BaseService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

	}

	ngOnInit() {
		this.getData();
	}


	getData(){
		this.contactListSubscriptions = this.baseService.getUserContactList(this.currentUser.id)
		.subscribe( (data: any) => {
			this.connections = data.connections;
			this.contactList = data.contacts;
		})
	}

	//================ Count ITems ===============//
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
          return '/assets/images/default/avatar.jpg';
        }
        return this.authenticationService.baseurl+item;
      }
    }

    searchFromContact(user:any) {
    	let search = _.findLast(this.contactList, ['id', user.id]);
    	return search?true:false;
    }

    addToContact(user:any){
    	if (this.searchFromContact(user)) {
    		this.alert.snotSimpleSuccess("User already on your contact list");
    		return;
    	}

    	let data = {
    		user_id : this.currentUser.id,
    		contact_id : user.id
    	};

    	this.baseService.addToContact(data)
    	.subscribe(data => {
    		this.getData();
    		this.alert.snotSimpleSuccess("Contact list updated");
    	})
    }


    removeFromContact(contact:any) {

    	let data = {
    		user_id : this.currentUser.id,
    		contact_id : contact.id
    	};


    	this.baseService.removeFromContact(data)
    	.subscribe(data => {
    		this.getData();
    	});
    }


    checkInContact(user_id:number) {
    	let found = _.findLast(this.contactList, ['id',user_id]);
    	return found?true:false;
    }

}
