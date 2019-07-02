declare var $: any;
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  public error:string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });



    this.authenticationService.logout(); // reset login status

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  togglePasswordVisibility() {

    let password = $('#password');

    if (password.attr("type") === 'password') {
      password.attr("type", "text");
    }else{
      password.attr("type", "password");
    }
  }


  handleResponse(data){
    if (data.user && data.access_token) {
      this.authenticationService.handleToken(data.access_token);
      if (!this.authenticationService.loggedIn()) {
        this.error = "Invalid Token supplied";
        return;
      }
      this.authenticationService.setUser(data.user);
      //set user access Data for later reference
      this.authenticationService.setUserData(data.accessData);
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    this.error = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
    .pipe(first())
    .subscribe(
      data => {
        this.handleResponse(data);
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      });
  }
}
