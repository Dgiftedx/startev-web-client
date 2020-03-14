import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { BaseService } from '../../../_services';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-career-fields',
	templateUrl: './career-fields.component.html',
	styleUrls: ['./career-fields.component.css']
})
export class CareerFieldsComponent implements OnInit {

	public careerFields: Array<any> = [];
	public showFields:boolean = false;
	private careerFieldsSubscription: Subscription;
	constructor(
		private baseService : BaseService
		) { 


		this.careerFieldsSubscription = this.baseService.fetchIndustries()
		.subscribe(
			(data : any) => {
				
				if (_.size(data) > 0) {
					this.showFields = true;
					this.careerFields = data.industries;
					this.careerFields.forEach(item => {
						item.totalMentors = _.size(item.mentors);
					});
				}
		});
	}

	ngOnInit() {
	}

}
