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

	public getStore(user_id: number, url:string){
		return this.http.get(`${this.endpoint}/store/${url}/${user_id}`);
	}

	public checkHasStore(user_id: number){
		return this.http.get(`${this.endpoint}/store/check-has-store/${user_id}`);
	}

	public dashboardData(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-dashboard-data/${user_id}`);
	}

	public getOrders(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-store-orders/${user_id}`);
	}

	public getVentures(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-ventures/${user_id}`);
	}


	public getReviews(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-reviews/${user_id}`);
	}

	public saveStoreSettings( user_id:number, formData: FormData ){
		return this.http.post(`${this.endpoint}/store/save-store-settings/${user_id}`, formData);
	}

}
