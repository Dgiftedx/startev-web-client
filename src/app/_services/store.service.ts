import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../_models';
import * as _ from 'lodash';
import { AuthenticationService } from './authentication.service';


@Injectable({
	providedIn: 'root'
})
export class StoreService {

	constructor(
		private http: HttpClient,
		private authenticationService : AuthenticationService) { }


	endpoint = this.authenticationService.endpoint;


	//======================= Methods Starts Here ==========================//

	public checkHasStore(user_id: number){
		return this.http.get(`${this.endpoint}/store/check-has-store/${user_id}`);
	}

	public dashboardData(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-dashboard-data/${user_id}`);
	}

	public getOrders(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-store-orders/${user_id}`);
	}

}
