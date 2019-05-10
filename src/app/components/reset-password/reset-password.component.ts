import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../../_services';
import { MustMatch } from '../../_helpers/must-match';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	resetForm : FormGroup;
  insertData : FormArray;
	loading = false;
  submitted = false;
  returnUrl: string;
  error = '';


  constructor(
  	private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  	 this.resetForm = this.formBuilder.group({
	      password: ['', [Validators.required, Validators.minLength(6)]],
	      confirmPassword: ['', Validators.required],
        resetToken: [''],
	  }, {validator : MustMatch('password','confirmPassword')});
    this.authenticationService.logout(); // reset login status
  }


   get f(){
  	return this.resetForm.controls;
  }


  handleResponse(data){
  	this.alert.successMsg(data.data, 'Success');
  	//determine what happens to page after success
  }




  onSubmit(){
    this.error = '';
  	this.submitted = true;

    // get return url from route parameters or default to '/'
    this.route.queryParams.subscribe(params => {
      this.resetForm.value.resetToken = params['token'];
    });

      // stop here if form is invalid
      if (this.resetForm.invalid) {
          return;
      }

      this.loading = true;

      this.authenticationService.changePassword(this.resetForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.handleResponse(data);
          this.loading = false;
        },

        error => {
          this.error = error;
          this.loading = false;
        }

       )
  }

}
