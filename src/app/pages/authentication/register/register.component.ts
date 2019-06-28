import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, BaseService } from '../../../_services';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../../_services';
import { MustMatch } from '../../../_helpers/must-match';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	registrationForm : FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	public error:string = '';
	public showMain:boolean = true;
	public showAfterRegister: boolean = false;
	public returnedMail : string = '';
	public returnedSlug: string = '';
	public sendingResendMailLadda:boolean = false;

	constructor(
		private alert : AlertService,
		private http: HttpClient,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
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
			username: ['', Validators.required],
			phone : ['', Validators.required ],
			email : ['', Validators.required ],
			password : ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword : ['', Validators.required],
			acceptTerms: [false, Validators.requiredTrue],
			role : ['']
		}, {validator : MustMatch('password','confirmPassword')});
		this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
	}

	get f(){
		return this.registrationForm.controls;
	}


	public count(items:any) {
		return _.size(items);
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
		this.showAfterRegister = true;
		this.returnedMail = data.email;
		this.returnedSlug = data.slug;
	}


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
          			this.handleRegistration(data);
          			this.loading = false;
          		},

          		error => {
          			this.error = error;
          			this.loading = false;
          		}

          	)

		}

}
