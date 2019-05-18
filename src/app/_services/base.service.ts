import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
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

	public fetchIndustries(){
		return this.http.get(`${this.endpoint}/industries`);
	}

	public fetchAllIndustries(){
		return this.http.get(`${this.endpoint}/all-industries`);
	}


	public getSingleIndustry(slug : any){
		return this.http.get(`${this.endpoint}/single-industry/${slug}`);
	}

	public fetchUserProfile(){
		return this.http.get(`${this.endpoint}/get-profile`);
	}


	public fetchCountries(){
		return this.http.get(`${this.endpoint}/countries`);
	}

	public getStates(id : any){
		return this.http.get(`${this.endpoint}/states/${id}`);
	}


	public getCities(id : any){
		return this.http.get(`${this.endpoint}/cities/${id}`);
	}

	// Register a new user
    public updateUserData(formData: any, url : string, id : number){
        return this.http.post<any>(`${this.endpoint}/${url}/${id}`, formData);
    }

    public fetchCareerPaths(){
		return this.http.get(`${this.endpoint}/career-paths`);
	}

	public updateImage(imageData: any, id: number) {
		return this.http.post<any>(`${this.endpoint}/update-user-avatar/${id}`, imageData);
	}

	public updateHeaderImage(imageData: any, id: number){
		let formData = new FormData();
		formData.append('image', imageData);
		return this.http.post<any>(`${this.endpoint}/update-user-header-image/${id}`, formData);
	}


	public promiseAllIndustries(){
		return this.http.get(`${this.endpoint}/all-industries`).pipe(delay(1000));
	}

	public promiseSingleIndustry(slug: any){
		return this.http.get(`${this.endpoint}/single-industry/${slug}`).pipe(delay(1000));
	}


	public promiseUserProfile(){
		return this.http.get(`${this.endpoint}/get-profile`).pipe(delay(1000));
	}

	public promiseMentorProfile(slug : any){
		return this.http.get(`${this.endpoint}/single-mentor-profile/${slug}`).pipe(delay(1000));
	}


}
