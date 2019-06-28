declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { StoreService } from '../../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService} from '../../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';

@Component({
	selector: 'app-user-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css'],
	animations: [
	trigger(
      'enterAnimation', [
        transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [
          animate('200ms ease-out', style({transform: 'translateY(-100%)'}))
        ])
      ]),

	trigger('fadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(300, style({opacity: 0})))
    ])

	]
})
export class SettingsComponent implements OnInit {

	currentUser:User;

	public base_url = window.location.origin;
	public showEdit:boolean = false;
	public image: any = null;
	public isImage = false;
	public processedImage = '';
	public sendingForm:boolean = false;
	public store_name:string = '';
	public store_url:string = '';
	public bank_name:string = '';
  public auto_forward:boolean;
	public account_name:string = '';
	public account_number:number = 0;

	public settings:any = [];
	private settingSubscription:Subscription;
	constructor(
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private alert: AlertService,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		//Get Settings
		this.settingSubscription = this.storeService.getStore(this.currentUser.id, 'get-store-settings')
		.subscribe(data => this.settings = data);
	}

	ngOnInit() {
	}


	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}


// ============ check null item and return default as required =======//
  checkValue(item:any,  type:string, nullValue:string) {
    if (type === 'text') {
      if (this.count(item) === 0) {
        return nullValue;
      }
      return item;
    }

    if (type === 'bool') {
      if (item) {
        return 'Yes';
      }

      return nullValue;
    }


    if (type === 'integer') {
      
      if (item && this.count(item.toString()) === 0) {
        return nullValue;
      }

      return item;
    }

    if (type === 'avatar') {

      if (this.count(item) === 0) {
        return 'assets/images/default/avatar.jpg';
      }
      return item;
    }
  }


	//============== Lock Account Number if set or set default ================//
	restrictAccountNumber(accountNumber:number){
		if (this.count(accountNumber.toString()) > 0) {
			//call the function to lock it and return the value
			return accountNumber;
		}

		return 'XXXXXXXXXX';
	}


	//============ Image Reader ===============//

  imageFileReader(file: File){
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.processedImage = event.target.result; 
    });

    reader.readAsDataURL(file);
  }

  processStoreLogo(storeLogo: any): void {
    const newLogo : File = storeLogo.files[0];
    this.imageFileReader(newLogo);
    this.isImage = true;
    this.image = newLogo;
  }


  //=================== Modify Settings ===================//
  openForModification(){
  	this.store_name  = this.settings.store_name;
  	this.store_url = this.settings.store_url;
    this.auto_forward = Boolean(this.settings.auto_forward);
  	
  	if (this.settings.store_logo) {
  		this.processedImage = this.settings.store_logo;
  		this.isImage = true;
  	}
  	this.bank_name = this.settings.bank_name;
  	this.account_number = this.settings.account_number;
  	this.account_name = this.settings.account_name;
  	this.showEdit = true;
  }

  closeForModification(){
  	this.showEdit = false;
  }

  generateStoreUrl(storeIdentifier:any){
  	this.store_url = this.base_url+"/main-store/"+storeIdentifier;
  }


  convertToFormData(formValues:any): FormData{
  	let formData = new FormData();

  	for ( let key in formValues ){
  		formData.append(key, formValues[key]);
  	}

  	return formData;
  }


  changeAutoForward() {
    this.auto_forward = !this.auto_forward
  }


  validateFields(formValues:any){
  	let errorTitle = "Store Settings Error";


  	// Validate store name
  	if (this.count(formValues.store_name) === 0 || this.count(formValues.store_name) < 8) {
  		this.alert.errorMsg("Store name too short or not defined. Please check the form",errorTitle);
  		return;
  	}


  	// Validate store url
  	if (this.count(formValues.store_url) === 0) {
  		this.alert.errorMsg("You haven't generate your store url. Please generate url.",errorTitle);
  		return;
  	}

  	// validate bank name
  	if (this.count(formValues.bank_name) === 0 || this.count(formValues.bank_name) < 3) {
  		this.alert.errorMsg("Please enter a valid bank full name. Please check",errorTitle);
  		return;
  	}

  	// validate account name
  	if (this.count(formValues.account_name) === 0) {
  		this.alert.errorMsg("Your account name can't be empty. Please fill in your account full name",errorTitle);
  		return;
  	}

  	// Validate account number
  	if (this.count(formValues.account_number.toString()) < 10) {
  		this.alert.errorMsg("Please enter a valid account number.",errorTitle);
  		return false;
  	}

  }

  saveModifications(){
  	let values = {
  		store_name: this.store_name,
  		store_logo: this.image,
  		store_url: this.store_url,
  		bank_name: this.bank_name,
      auto_forward : this.auto_forward,
  		account_name: this.account_name,
  		account_number: this.account_number
  	};

  	// first validate the form fields
  	this.validateFields(values);

  	this.sendingForm = true;

  	// convert to formData
  	let formData: FormData = this.convertToFormData(values);

  	//send Form
  	this.storeService.saveStoreSettings(this.currentUser.id, formData)
  	.subscribe(data => {this.settings = data; this.sendingForm = false; this.alert.snotSuccess("Your Store has been updated.")});
  }

}
