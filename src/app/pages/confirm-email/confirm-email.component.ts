import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../../_services';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {


	slug : string;
	public error:string = '';
	returnUrl : string;
	successMsg:string;


  constructor(
  	private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {

  	 // get return url from route parameters or default to '/'
    this.route.queryParams.subscribe(params => {
      this.slug = params['token'];
    });


    let data = {
    	slug : this.slug
    };

    this.authenticationService.verifyEmail(data)
    .subscribe( data => {
    	this.handleVerificationResponse(data)
    }, error => {
    	this.error = error;
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

  }


  handleVerificationResponse(data:any){

  	if (data.message) {
  		this.successMsg = data.message;
  		this.alert.snotSimpleSuccess(data.message);
  		return;
  	}


  	
  	if (data.data.original.user && data.data.original.access_token) {

      this.authenticationService.handleToken(data.data.original.access_token);
      
      this.authenticationService.setUser(data.data.original.user);
      //set user access Data for later reference
      this.authenticationService.setUserData(data.data.original.accessData);
      this.router.navigate([this.returnUrl]);
    }

  }


}
