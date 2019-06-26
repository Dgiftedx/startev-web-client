import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { BaseService } from '../../../_services';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-mentors-widget',
	templateUrl: './mentors-widget.component.html',
	styleUrls: ['./mentors-widget.component.css']
})
export class MentorsWidgetComponent implements OnInit {



	public featuredMentors:any;
	public showMentors:boolean = false;
	private featuredMentorsSubscription: Subscription;
	constructor(
			private baseService : BaseService
	) { 

		this.featuredMentorsSubscription = this.baseService.fetchFeaturedMentors()
		.subscribe( data => {
			this.featuredMentors = data;
			if (_.size(data) > 0) {
				this.showMentors = true;
			}
		})

	}

	ngOnInit() {
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
