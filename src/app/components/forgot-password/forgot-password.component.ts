import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../../_services';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
	resetForm : FormGroup;
	loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    form = {};

   constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
	  this.resetForm = this.formBuilder.group({
	      email: ['', [Validators.required, Validators.email]]
	  });
    this.authenticationService.logout(); // reset login status
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/login';  
  }


  get f(){
  	return this.resetForm.controls;
  }


  handleResponse(data){
  	this.alert.successMsg(data.data, 'Success');
  	//determine what happens to page after success
    this.router.navigate([this.returnUrl]);
  }


  onSubmit(){
    this.error = '';
  	this.submitted = true;

      // stop here if form is invalid
      if (this.resetForm.invalid) {
          return;
      }

      this.loading = true;

      this.authenticationService.sendResetPassword(this.resetForm.value)
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
