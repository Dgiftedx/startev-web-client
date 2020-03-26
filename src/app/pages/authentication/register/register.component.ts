import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, BaseService } from '../../../_services';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../../_services';
import { MustMatch } from '../../../_helpers/must-match';
import {AuthService , FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	registrationForm : FormGroup;
	socialregistrationForm : FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	queryParams: string;
    userdata={email:'',name:'',gid:''};

	public error:string = '';
	public showMain:boolean = true;
	public showSocialSignup:boolean = false;
	public showAfterRegister: boolean = false;
	public returnedMail : string = '';
	public returnedSlug: string = '';
	public sendingResendMailLadda:boolean = false;
    // private authService: AuthService;
    private user: SocialUser;
    private loggedIn: boolean;


    constructor(
		private alert : AlertService,
		private http: HttpClient,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private _socioAuthServ:AuthService,
		private authenticationService: AuthenticationService
		) { }

	roles = [
		{id: 1, name: "A Student", alias: "student"},
		{id: 2, name: "A Graduate", alias: "graduate"},
		{id: 3, name: "A Mentor", alias: "mentor"},
		{id: 4, name: "A Business", alias: "business"}
	];

	checkPasswords(group: FormGroup){
		let pass = group.controls.password.value;
		let confirmPass = group.controls.confirmPassword.value;
		return pass === confirmPass ? {notSame: false} : { notSame : true };
	}

	ngOnInit() {
		this.registrationForm = this.formBuilder.group({
			name : ['', Validators.required ],
			email : ['', Validators.required ],
			password : ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword : ['', Validators.required],
			acceptTerms: [false, Validators.requiredTrue],
			role : [''],
			ref_code : [''],
		},{validator : MustMatch('password','confirmPassword')});

		this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
		this.queryParams = this.route.snapshot.queryParamMap.get('ref_code');

        //
        // this.authService.authState.subscribe((user) => {
        //     console.log(JSON.stringify(user,null,'\t'));
        //     this.user = user;
        //     this.loggedIn = (user != null);
        // });
	}




	changeAccessType() {
		// console.log(this.registrationForm.controls['role'].value);
	}

	get f(){
		return this.registrationForm.controls;
	}
	get g(){
		return this.socialregistrationForm.controls;
	}


	public count(items:any) {
		return _.size(items);
	}


	setRefCodeField(){
		if (this.queryParams) {
			this.registrationForm.controls['ref_code'].setValue(this.queryParams);
		}
	}

	handleResponse(data)
	{
		if (data.user && data.access_token) {
           this.authenticationService.handleToken(data.access_token);
           if (!this.authenticationService.loggedIn()) {
             this.error = 'Invalid Token supplied';
             return;
           }
        this.authenticationService.setUser(data.user);
        //set user access Data for later reference
        this.authenticationService.setUserData(data.accessData);
        this.router.navigate([this.returnUrl]);
      }
	}


	handleRegistration(data:any) {
		this.showMain = false;
        this.showSocialSignup=false;
        this.showAfterRegister = true;
		this.returnedMail = data.email;
		this.returnedSlug = data.slug;
	}

	// handleSocialRegistration(data:any) {
	// 	this.returnedMail = data.email;
	// 	this.returnedSlug = data.slug;
	// }


	resendMail() {
		if (_.size(this.returnedMail) === 0) {
			this.error = "Please enter your email address";
			return;
		}

		this.sendingResendMailLadda = true;

		let data = {
			email : this.returnedMail,
			slug : this.returnedSlug
		}

		this.authenticationService.resendEmailConfirmation(data)
		.subscribe(data => {
			this.alert.snotSimpleSuccess("Confirmation Mail Sent");
			this.sendingResendMailLadda = false;
		});
	}

	onSubmit(){
        // this.userdata=data;


        this.setRefCodeField();

		this.error = '';
		this.submitted = true;
		
		// stop here if form is invalid
        if (this.registrationForm.invalid) {
            return;
        }

        this.loading = true;

        this.authenticationService.createUser(this.registrationForm.value)
          .pipe(first())
          .subscribe(
          		data => {
          		    console.log(data)
          			this.handleRegistration(data);
          			this.loading = false;
          		},

          		error => {
          			this.error = error;
          			this.loading = false;
          		}

          	)

		}



handlesocial(){
    console.log(this.userdata);
    this.showSocialSignup=true;
    this.showMain=false ;
}
    // Method to sign in with google.

    getGoogleRes(platform : string): void {
        platform = GoogleLoginProvider.PROVIDER_ID;
        this._socioAuthServ.signIn(platform)
             .then((response) => {
                    this.userdata.email=response.email;
                    this.userdata.name=response.name;
                    this.userdata.gid=response.idToken;
                console.log(JSON.stringify(response,null,'\t'));
                console.log(platform + " logged in user data is= " , response);
    // //             this.user = response;
                     this.handlesocial();
                 });

}





    //To Authenticate User Via FaceBook
    fb_signup(platform : string): void {
        platform = FacebookLoginProvider.PROVIDER_ID;
        this._socioAuthServ.signIn(platform)
            .then((response) => {
                this.userdata.email=response.email;
                this.userdata.name=response.name;
                this.userdata.gid=response.id;
                console.log(JSON.stringify(response,null,'\t'));
                console.log(platform + " logged in user data is= " , response);
                // //             this.user = response;
                this.handlesocial();
            });

    }









}
