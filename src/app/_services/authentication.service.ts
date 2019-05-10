import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../_models';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    //Local
    public endpoint = 'http://startev.server/api';
    public baseurl = 'http://startev.server';
    public endPointAuth = 'http://startev.server/api/auth';


    //Server
    // public endpoint = 'https://bs.educare.school/api/v1';
    // public baseurl = 'https://bs.educare.school';
    // public endpointlogin = 'https://bs.educare.school/api/auth';
    // private school_website = 'https://www.educare.school';


     private iss = {
        login: `${this.endPointAuth}/login`,
        register : `${this.endPointAuth}/register`
    }


    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    // Login user
    login(username: string, password: string) {
        return this.http.post<any>(`${this.endPointAuth}/login`, { username, password });
    }


    // Register a new user
    public createUser(formData: any){
        return this.http.post<any>(`${this.endPointAuth}/register`, formData);
    }

    // Send Password Reset Request
    public sendResetPassword(email : object) {
        return this.http.post<any>(`${this.endpoint}/reset-password`, email);
    }

    // change Password
    public changePassword(resetData : object) {
        return this.http.post<any>(`${this.endpoint}/change-password`, resetData);
    }


    //handle token
    handleToken(token){
        this.setToken(token);
    }


    //setUser
    setUser(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    // Set access token
    setToken(token){
         localStorage.setItem('access_token', token);   
    }


    getToken(){
        return localStorage.getItem('access_token');
    }


    removeToken()
    {
        return localStorage.removeItem('access_token');
    }

    isValidToken(){

        const token = this.getToken();

        if (token) {
            
            const payload = this.payload(token);

            if (payload) {
               return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
            }
        }


        return false;
    }

    
    payload(token){
        const payload =  token.split(".")[1];

        return this.decode(payload);
    }


    decode(payload){
        return JSON.parse(atob(payload));
    }

    loggedIn(){
        return this.isValidToken();
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        // remove access_token
        this.removeToken();
        this.currentUserSubject.next(null);
    }
}
