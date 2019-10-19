declare var $: any;
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {User} from '../../../../_models';
import {Component, OnInit} from '@angular/core';
import {switchMap, first} from "rxjs/operators";
import {NgSelectConfig} from '@ng-select/ng-select';
import {StoreService} from '../../../../_services/store.service';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, BaseService} from '../../../../_services';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {trigger, style, animate, state, transition} from '@angular/animations';

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
                animate(600)
            ]),

            // fade out when destroyed. this could also be written as transition('void => *')
            transition(':leave',
                animate(300, style({opacity: 0})))
        ])

    ]
})
export class SettingsComponent implements OnInit {

    currentUser: User;

    public base_url = window.location.origin;
    public showEdit: boolean = false;
    public image: any = null;
    public isImage = false;
    public processedImage = '';
    public sendingForm: boolean = false;
    public store_name: string = '';
    public store_url: string = '';
    public bank_name: string = '';
    public bank_code: string = '';
    public verificationError: string = '';
    public auto_forward: boolean;
    public store_code: string = '';
    public account_name: string = '';
    public account_number: number = 0;
    public ref_code: string = '';
    public readAccountNumber: boolean = false;

    public banks: any = [];
    public settings: any = [];
    private settingSubscription: Subscription;

    constructor(private router: Router,
                private config: NgSelectConfig,
                private route: ActivatedRoute,
                private alert: AlertService,
                private baseService: BaseService,
                private storeService: StoreService,
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

        this.getBanks();

    }

    ngOnInit() {
    }


    //====== Getter method for Current User Profile =======//

    get profile() {
        return JSON.parse(this.authenticationService.getUserData());
    }

    count(items: any) {
        return _.size(items);
    }


    getBanks() {
        this.baseService.getBanks()
            .subscribe((data: any) => {
                this.banks = data;
            });
    }

// ============ check null item and return default as required =======//
    checkValue(item: any, type: string, nullValue: string) {
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
                return '/assets/images/default/avatar.jpg';
            }
            return this.authenticationService.baseurl + item;
        }
    }


    //============== Lock Account Number if set or set default ================//
    restrictAccountNumber(accountNumber: number) {
        if (this.count(accountNumber.toString()) > 0) {
            //call the function to lock it and return the value
            return accountNumber;
        }

        return 'XXXXXXXXXX';
    }


    //============ Image Reader ===============//

    imageFileReader(file: File) {
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.processedImage = event.target.result;
        });

        reader.readAsDataURL(file);
    }

    processStoreLogo(storeLogo: any): void {
        const newLogo: File = storeLogo.files[0];
        this.imageFileReader(newLogo);
        this.isImage = true;
        this.image = newLogo;
    }


    //=================== Modify Settings ===================//
    openForModification() {
        this.store_name = this.settings.store_name;
        this.store_url = this.base_url + "/main-store/";
        // this.store_url = this.settings.store_url;
        this.auto_forward = Boolean(this.settings.auto_forward);
        this.store_code = '';

        if (this.settings.store_logo) {
            this.processedImage = this.settings.store_logo;
        }
        this.bank_code = this.settings.bank_code;
        this.bank_name = this.settings.bank_name;
        this.account_number = this.settings.account_number;
        if (!this.bank_code) {
            this.bank_name = '';
            this.changeAccountNumber();
        }
        this.account_name = this.settings.account_name;
        this.showEdit = true;
    }

    closeForModification() {
        this.showEdit = false;
    }

    generateStoreUrl(storeIdentifier: any) {
        this.store_url = this.base_url + "/main-store/";
        // this.store_url = this.base_url+"/main-store/"+storeIdentifier;
    }

    // generateStoreUrl(storeIdentifier:any){
    //     this.store_code=this.generateRefCode(this.settings.store_name);
    //     console.log(this.store_code);
    // 	this.store_url = this.base_url+"/main-store/"+this.store_code;
    // 	// this.store_url = this.base_url+"/main-store/"+this.settings.store_name.replace(' ','-');
    // }


    generateRefCode(storeIdentifier: any) {
        let formData = {
            store_id: storeIdentifier
        };

        this.baseService.generateStoreUrl(formData)
            .subscribe((data: any) => {
                this.store_code = data;
            })
        console.log(this.store_code)
        return this.store_code;
    }


    convertToFormData(formValues: any): FormData {
        let formData = new FormData();

        for (let key in formValues) {
            formData.append(key, formValues[key]);
        }

        return formData;
    }


    changeAutoForward() {
        this.auto_forward = !this.auto_forward
    }


    changeBank() {
        let search = _.findLast(this.banks, ['code', this.bank_code]);
        this.bank_name = search.name;
    }


    changeAccountNumber() {

        if (!this.account_number) {
            return;
        }

        //we only want to run this when the account number is exactly 10 digits
        if (this.count(this.account_number.toString()) === 10) {

            if (this.count(this.bank_name) === 0) {
                this.alert.warningMsg("Please select your bank to continue", "Select Bank");
                return;
            }

            let query = {
                bank_code: this.bank_code,
                account_number: this.account_number
            };

            //disable field and verify address
            this.readAccountNumber = true;

            this.baseService.postData(query, 'verify-account-number')
                .subscribe((resp: any) => {
                    if (resp.success && resp.success == true) {
                        this.account_name = resp.data.account_name;
                        this.readAccountNumber = false;
                    } else {
                        this.readAccountNumber = false;
                        this.verificationError = "we couldn't find your account. proceed only if you're sure";
                    }
                });


        } else if (this.count(this.account_number.toString()) > 10) {
            return;
        } else {
            //enable input until it completed 10 digits
            this.readAccountNumber = false;
        }
    }

    updateAccount() {

        let errorTitle = "Account Update Error!";

        let values = {
            user_id: this.currentUser.id,
            bank_code: this.bank_code,
            bank_name: this.bank_name,
            account_name: this.account_name,
            account_number: this.account_number
        };


        // validate bank name
        if (this.count(this.bank_name) === 0 || this.count(this.bank_name) < 3) {
            this.alert.errorMsg("Please enter a valid bank full name. Please check", errorTitle);
            return;
        }

        // validate account name
        if (this.count(this.account_name) === 0) {
            this.alert.errorMsg("Your account name can't be empty. Please fill in your account full name", errorTitle);
            return;
        }

        this.baseService.postData(values, 'add-account-details')
            .subscribe((resp: any) => {

                this.alert.snotSimpleSuccess("Your Store has been updated.");
            });
    }


    saveModifications() {
        let values = {
            store_name: this.store_name,
            store_logo: this.image,
            store_url: this.store_url,
            auto_forward: 1,
        };

        let errorTitle = "Store Settings Error";


        // Validate store name
        if (this.count(this.store_name) === 0 || this.count(this.store_name) < 8) {
            this.alert.errorMsg("Store name too short or not defined. Please check the form", errorTitle);
            return;
        }


        // Validate store url
        if (this.count(this.store_url) === 0) {
            this.alert.errorMsg("You haven't generate your store url. Please generate url.", errorTitle);
            return;
        }

        this.sendingForm = true;

        // convert to formData
        let formData: FormData = this.convertToFormData(values);

        //send Form
        this.storeService.saveStoreSettings(this.currentUser.id, formData)
            .subscribe(data => {
                this.settings = data;
                this.sendingForm = false;
                this.alert.snotSimpleSuccess("Your Store has been updated.")
            });
    }

}
