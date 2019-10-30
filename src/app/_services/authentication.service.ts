import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    // public endpoint = 'http://startev.server/api';
    // public baseurl = 'http://startev.server';
    // public endPointAuth = 'http://startev.server/api/auth';

    //Local My
    // public endpoint = 'http://startev.test/api';
    // public baseurl = 'http://startev.test';
    // public endPointAuth = 'http://startev.test/api/auth';

    //Mobile
    // public endpoint = 'http://10.1.1.63:8087/api';
    // public baseurl = 'http://10.1.1.63:8087';
    // public endPointAuth = 'http://10.1.1.63:8087/api/auth';

    //James Local
    // public endpoint = 'http://startevserver.test/api';
    // public baseurl = 'http://startevserver.test';
    // public endPointAuth = 'http://startevserver.test/api/auth';

    // Server
    public endpoint = 'https://server.startev.africa/api';
    public baseurl = 'https://server.startev.africa';
    public endPointAuth = 'https://server.startev.africa/api/auth';



    private iss = {
        login: `${this.endPointAuth}/login`,
        register : `${this.endPointAuth}/register`
    }


    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    // Login user
    login(email: string, password: string) {
        return this.http.post<any>(`${this.endPointAuth}/login`, { email, password });
    }


    // Register a new user
    public createUser(formData: any){
        return this.http.post<any>(`${this.endPointAuth}/register`, formData);
    }

    // Send Password Reset Request
    public sendResetPassword(email : object) {
        return this.http.post<any>(`${this.endpoint}/reset-password`, email);
    }

     // Re-Send Email Confirmation Mail
    public resendEmailConfirmation(data : any) {
        return this.http.post<any>(`${this.endpoint}/resend-email-confirmation`, data);
    }

    // change Password
    public changePassword(resetData : object) {
        return this.http.post<any>(`${this.endpoint}/change-password`, resetData);
    }

    // Verify Email
    public verifyEmail(data : any) {
        return this.http.post<any>(`${this.endPointAuth}/verify`, data);
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

    //set basic user data
    setUserData(data){
        localStorage.setItem('userData', JSON.stringify(data));
    }

    // Set access token
    setToken(token){
        localStorage.setItem('access_token', token);   
    }


    removeUser(){
        return localStorage.removeItem('currentUser');
    }

    //get user data from storage
    getUserData(){
        return localStorage.getItem('userData');
    }

    //remove user data from storage
    removeUserData(){
        return localStorage.removeItem('userData');
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
        this.removeUser();
        this.removeUserData();
        // remove access_token
        this.removeToken();
        this.currentUserSubject.next(null);
    }
}
