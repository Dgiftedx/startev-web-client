import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { BaseService, AuthenticationService} from '../../../_services';

@Component({
  selector: 'app-suggestions-widget',
  templateUrl: './suggestions-widget.component.html',
  styleUrls: ['./suggestions-widget.component.css']
})
export class SuggestionsWidgetComponent implements OnInit {

  currentUser : User;

  public suggestions:any;
  public showSuggestions:boolean = false;
  private suggestionsSubscription: Subscription;

  constructor(private baseService : BaseService, private authenticationService : AuthenticationService) { 
  	//subscribe to current logged in user
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.suggestionsSubscription = this.baseService.fetchSuggestions(this.currentUser.id)
    .subscribe( data => {
    	this.suggestions = data;

    	if (this.count(data) > 0) {
    		this.showSuggestions = true;
    	}
    });
  }

  ngOnInit() {
  }

    //================ Name splitter & shotener ====================//
  shortenName(name:string) {
    let splitted = name.split(" ");

    let firstName = splitted[0];

    if (splitted[this.count(splitted) - 1]) {
      return firstName + " " + splitted[this.count(splitted) - 1];
    }

    return firstName;
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


	count(items:any) {
		return _.size(items);
	}

	//Algorithm to show user Job title
	echoJobTitle(roleData: any, role: string){
		return this.baseService.echoJobTitle(roleData, role);
	}

}
