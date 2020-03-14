import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
    	private http: HttpClient, 
    	private authentication : AuthenticationService
    	) {}


    public getProfile() {
        return this.http.get(`${this.authentication.endpoint}/get-profile`);
    }
}