import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService } from './authentication.service';


@Injectable({
	providedIn: 'root'
})
export class BaseService {

	constructor(
		private http: HttpClient,
		private authenticationService : AuthenticationService) { }


	endpoint = this.authenticationService.endpoint;
	endPointAuth = this.authenticationService.endPointAuth;

	fetchIndustries(){
		return this.http.get(`${this.endpoint}/industries`);
	}

	fetchAllIndustries(){
		return this.http.get(`${this.endpoint}/all-industries`);
	}


	getSingleIndustry(slug : any){
		return this.http.get(`${this.endpoint}/single-industry/${slug}`);
	}

}
