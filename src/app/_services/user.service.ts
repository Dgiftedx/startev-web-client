import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) {}


     //Local
    public endpoint = 'http://startev.server/api';
    public baseurl = 'http://startev.server';
    public endPointAuth = 'http://startev.server/api/auth';


    //Server
    // public endpoint = 'https://bs.educare.school/api/v1';
    // public baseurl = 'https://bs.educare.school';
    // public endpointlogin = 'https://bs.educare.school/api/auth';
    // private school_website = 'https://www.educare.school';


    public getProfile() {
        return this.http.get<User[]>(`${this.endpoint}/get-profile`);
    }
}