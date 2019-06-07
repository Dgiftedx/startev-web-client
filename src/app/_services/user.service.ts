import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient, private authentication : AuthenticationService) {}


    public getProfile() {
        return this.http.get<User[]>(`${this.authentication.endpoint}/get-profile`);
    }
}