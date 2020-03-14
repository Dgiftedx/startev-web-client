declare var $: any;
import * as _ from 'lodash';
import { first } from 'rxjs/operators';
import { User } from '../../../_models';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgSelectConfig } from '@ng-select/ng-select';
import { MustMatch } from '../../../_helpers/must-match';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService, AlertService, UserService, BaseService} from '../../../_services';

@Component({
	selector: 'app-profile-edit',
	templateUrl: './profile-edit.component.html',
	styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
	private value:any = {};
	public countries : Array<any> = [];
	industries = [];
	industriesArray = [];
	states: Array<any> = [];
	cities: Array<any> = [];
	public account_name:string = '';
	public account_number:number = 0;
	public bank_name:string = '';
	public bank_code:string = '';
	public verificationError:string = '';
	public banks:any = [];
	public savingPayment:boolean = false;
	public readAccountNumber:boolean = false;
	careerPaths : Array<any> = [];
	public selectedCountry = {};
	public selectedIndustries = {};
	public selectedServices: Array<any> = [];
	public mentorCareerInterest: Array<any> = [];

	//================ Verification ============//
	public documentType: string;
	public documentFile : any = {};

	//======= Dashboard Navigation ============//
	public navigation: Array<any> = [

	{id: 1, alias: "platform_profile", name: "Platform Profile", icon: "fa-user"},
	{id: 2, alias: "account", name: "Account Setting", icon: "la-cogs"},
	{id: 3, alias: "change_password", name: "Change Password", icon: "fa-lock"},
	{id: 4, alias: "delete_account", name: "Delete Account", icon: "fa-random"},
	];

	//======= Dashboard Navigation ============//
	public documentTypes: Array<any> = [

	{id: 1, alias: "internation_passport", name: "International Passport"},
	{id: 2, alias: "voters_card", name: "Permanent Voter's Card"},
	{id: 3, alias: "driver_license", name: "Driver's License"},
	{id: 4, alias: "others", name: "Others"},
	];


	public selectedNavigation = this.navigation[0];

	currentUser: User;
	show: boolean = false;
	user;
	profileData;
	roleData: any;

	progress;
	role;

	userForm: FormGroup;
	studentForm: FormGroup;
	mentorForm: FormGroup;
	companyForm: FormGroup;
	passwordForm: FormGroup;

	industryForm: FormGroup;

	// workExperience: FormArray;
	// education: FormArray;
	services: FormArray;
	social_handle: FormArray;

	userFormLoading = false;
	userFormSubmitted = false;
	userFormError = '';


	studentFormLoading = false;
	studentFormSubmitted = false;
	studentFormError = '';

	mentorFormLoading = false;
	mentorFormSubmitted = false;
	mentorFormError = '';

	companyFormLoading = false;
	companyFormSubmitted = false;
	

	avatarLoading = false;

	passSubmitted = false;

	deletingProfile:boolean = false;
	upgradingProfile:boolean = false;

	constructor(
		private cdr: ChangeDetectorRef,
		private config: NgSelectConfig,
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private alert: AlertService,
		private userService : UserService,
		private baseService: BaseService,
		private authenticationService: AuthenticationService) {
		this.config.notFoundText = 'item not found';
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.getCountries();

		this.getBanks();
	}


	// ============ check null item and return default as required =======//
	checkValue(item:any,  type:string, nullValue:string) {
		if (type === 'text') {
			if (this.count(item) === 0) {
				return nullValue;
			}
			return item;
		}

		if (type === 'avatar') {

			if (this.count(item) === 0) {
				return '/assets/images/default/avatar.jpg';
			}
			return this.authenticationService.baseurl+item;
		}

		if (type === 'banner') {
			
			if (this.count(item) === 0) {
				return '/assets/images/default/default.png';
			}

			return this.authenticationService.baseurl+item;
		}
	}


	getBanks(){
		this.baseService.getBanks()
		.subscribe((data : any) => {
			this.banks = data;
		});
	}


	changeBank(){
    let search = _.findLast(this.banks, ['code',this.bank_code]);
    this.bank_name = search.name;
  }


  changeAccountNumber(){

    if (!this.account_number) {
      return;
    }
      console.log(this.account_number);

    //we only want to run this when the account number is exactly 10 digits
    if (this.count(this.account_number.toString()) === 10) {

      if (this.count(this.bank_name) === 0) {
          this.alert.warningMsg("Please select your bank to continue","Select Bank");
          return;
      }

      let query = {
        bank_code : this.bank_code,
        account_number : this.account_number
      };

      //disable field and verify address
      this.readAccountNumber = true;

      this.baseService.postData(query, 'verify-account-number')
      .subscribe((resp:any) => {
        if (resp.success) {
          this.account_name = resp.data.account_name;
          this.readAccountNumber = false;
        }else{
          this.readAccountNumber = false;
          this.verificationError = "we couldn't find your account. proceed only if you're sure";
        }
      });


    }else if (this.count(this.account_number.toString()) > 10) {
      return;
    }else{
      //enable input until it completed 10 digits
      this.readAccountNumber = false;
    }
  }


	updateAccount() {

		this.savingPayment = true;

		let errorTitle = "Account Update Error!";

		let values = {
			user_id : this.currentUser.id,
			bank_code : this.bank_code,
			bank_name: this.bank_name,
			account_name: this.account_name,
			account_number: this.account_number
		};


		// validate bank name
		if (this.count(this.bank_name) === 0 || this.count(this.bank_name) < 3) {
			this.alert.errorMsg("Please enter a valid bank full name. Please check",errorTitle);
			return;
		}

		// validate account name
		if (this.count(this.account_name) === 0) {
			this.alert.errorMsg("Your account name can't be empty. Please fill in your account full name",errorTitle);
			return;
		}

		this.baseService.postData(values, 'add-business-account-details')
		.subscribe((resp:any) => {
			this.savingPayment = false;
			this.alert.snotSimpleSuccess("Your Store has been updated.");
		});
	}


	count(items:any){
		return _.size(items);
	}
	//============= Set Active Navigation ==================//
	setActiveNavigation(navigation:any) {
		this.selectedNavigation = navigation;
	}


	imageChangedEvent: any = '';
	croppedImage: any = '';

	createSocialHandle(): FormGroup{
		return this.formBuilder.group({
			name: '',
			url: ''
		});
	}


	createForm() {
		this.userForm = this.formBuilder.group({
			name : ['', Validators.required],
			phone : [''],
			email : ['', [Validators.required, Validators.email]],
			dob : [''],
			country : [''],
			state : [''],
			city : [''],
			address: ['']
		});

		this.mentorForm = this.formBuilder.group({
			total_trainee: [0],
			current_job_position : ['', Validators.required],
			organization : [''],
			bio : ['']
		});

		this.studentForm = this.formBuilder.group({
			institution: ['', Validators.required],
			bio : [''],
			careerPath: [''],
			secondaryCP: ['']
		});

		this.companyForm = this.formBuilder.group({
			name: [''],
			description: [''],
			phone: [''],
			website: [''],
			services: [],
			partnership_terms: ['']
			// social_handle: this.formBuilder.array([this.createSocialHandle()])
		});

		this.passwordForm = this.formBuilder.group({
			password : ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword : ['', Validators.required],
		}, {validator : MustMatch('password','confirmPassword')})

		this.industryForm = this.formBuilder.group({
			industries: [[], Validators.required]
		});
	}


	ngOnInit() {
		this.getProfileData();
		this.getCountries();
		this.getCareerPaths();
		this.industries = this.route.snapshot.data.industries;
		this.createForm();
	}


	ngAfterViewInit(){
		this.cdr.detectChanges();
	}


	uploadVerDocument(document:any) {
		this.documentFile = document.files;
	}


	submitVerificationRequest() {
		
		if (_.size(this.documentType) === 0) {
			this.alert.errorMsg("Please select a document type", "Submission Error");
			return;
		}

		if (_.size(this.documentFile) === 0) {
			this.alert.errorMsg("Please upload your document", "Submission Error");
			return;
		}



		//submit verification document
		let formData = new FormData();

		formData.append('document_type', this.documentType);
		formData.append('document_file', this.documentFile[0]);
		formData.append('user_id', this.currentUser.id);
		formData.append('role', this.profile.role);

		this.baseService.sendVerDoc(formData)
		.subscribe( (data : any) => {
			this.alert.snotSimpleSuccess(data.message);
			this.profile.roleData = data.roleData.data;
		}, 
		(error : any) => {
			this.alert.infoMsg(error.error, "Information");
		});
	}


	handleProfileResponse(data: any){
		this.user = data.profileData.user;
		this.roleData = data.profileData.roleData;
		this.progress = data.profileData.progress;
		this.role = data.profileData.role;
		this.profileData = data.profileData;

		//Set payment account details
		this.bank_name = this.roleData.bank_name;
		this.bank_code = this.roleData.bank_code;
		this.account_name = this.roleData.account_name;
		this.account_number = this.roleData.account_number;

		//Set userForm values
		this.userForm.get('name').setValue(this.user.name);
		this.userForm.get('email').setValue(this.user.email);
		this.userForm.get('phone').setValue(this.user.phone);
		// this.userForm.get('bio').setValue(this.user.bio);
		
		//set date of birth
		if (_.size(this.user.dob) > 0) {
			// converts dob to datepicker readable form
			this.userForm.get('dob').setValue(new Date(this.user.dob));
		}

		//set country value if it's set.
		if (_.size(this.user.country) > 0) {
			let country = this.findStackByName(this.countries, this.user.country);

			if (country) {
				this.userForm.get('country').setValue(country.id);
			}
		}

		//set state value if it's set.
		if (_.size(this.user.state) > 0 ) {

			//fetch all states and pull user state
			let country2 = this.findStackByName(this.countries, this.user.country);
			setTimeout(() => {
				if (country2) {
					this.getStates(country2.id);
					setTimeout(() => {
						let state = this.findStackByName(this.states, this.user.state);
						if (state) {
							this.userForm.get('state').setValue(state.id);
						}
					}, 200)
				}
			})

		}

		this.userForm.get('city').setValue(this.user.city);
		this.userForm.get('address').setValue(this.user.address);

		//toggle Disable State
		this.toggleDisableState();

		//Set role based form values
		if (this.profileData.role === 'student' || this.profileData.role === 'graduate') {
			this.setStudentFormFields();
		}

		if (this.profileData.role === 'mentor') {
			this.setMentorFormFields();
			this.setIndustryField();
		}

		if (this.profileData.role ==='business') {
			this.setBusinessFields();
			this.setIndustryField();
		}


		// console.log(data.profileData);
	}


	setStudentFormFields(){
		this.studentForm.get('institution').setValue(this.roleData.institution);
		this.studentForm.get('bio').setValue(this.user.bio);
		let career1 = this.findStackByName(this.careerPaths, this.roleData.careerPath);
		let career2 = this.findStackByName(this.careerPaths, this.roleData.secondaryCP);

		setTimeout(() => {
			if (career1) {
				this.studentForm.get('careerPath').setValue(career1.id);
			}

			if (career2) {
				this.studentForm.get('secondaryCP').setValue(career2.id);
			}
		}, 200)
	}


	mockSocialHandle(data:any): FormGroup{
		return this.formBuilder.group({
			name: data.name,
			url: data.url
		});
	}

	setMentorFormFields(){
		this.mentorForm.get('current_job_position').setValue(this.roleData.current_job_position);
		this.mentorForm.get('bio').setValue(this.user.bio);
		this.mentorForm.get('organization').setValue(this.roleData.organization);
	}


	setBusinessFields(){
		this.companyForm.get('name').setValue(this.roleData.name);
		this.companyForm.get('description').setValue(this.roleData.description);
		this.companyForm.get('website').setValue(this.roleData.website);
		this.companyForm.get('phone').setValue(this.roleData.phone);
		this.companyForm.get('services').setValue(this.roleData.services);
		this.companyForm.get('partnership_terms').setValue(this.roleData.partnership_terms);

		// if (_.size(this.roleData.social_handle) > 0) {
			// 	let socialArray: FormArray = this.companyForm.get('social_handle') as FormArray;
			// 	socialArray.removeAt(0);

			// 	this.roleData.social_handle.forEach((item, index) => {
				// 		socialArray.push(this.mockSocialHandle(item));
				// 	});

				// 	//detect DOM changes
				// 	setTimeout(() => {
					// 		this.cdr.detectChanges();
					// 	}, 200);
					// }
				}


				setIndustryField(){
					this.handleUpdatedUserIndustry(this.user);
				}

				// convenience getter for easy access to form fields
				get f() { return this.userForm.controls; }

				get s() { return this.studentForm.controls; }

				get m() { return this.mentorForm.controls; }

				get b() { return this.companyForm.controls; }

				get pass() { return this.passwordForm.controls; }

				toggleDisableState(){
					if (_.size(this.states) === 0) {
						this.userForm.controls['state'].disable();
					}else{
						this.userForm.controls['state'].enable();
					}
				}


				// Object finder
				findStackById(collection: Array<any>, key: any){
					return _.findLast(collection, ['id',key]);
				}

				// Object finder
				findStackByName(collection: Array<any>, key: any){
					return _.findLast(collection, ['name',key]);
				}

				handleCountriesResponse(data){
					this.countries = data.countries;
				}


				handleStatesResponse(data){
					this.states = data.states;
					this.toggleDisableState();
				}

				handleCitiesResponse(data){
					this.cities = data.cities;
					this.toggleDisableState();
				}

				handleRoledataResponse(data){
					this.roleData = data.roleData;
					//update localStorage
					let update: any = this.authenticationService.getUserData();
					//converts string to json
					update = JSON.parse(update);
					//reset role data
					update.roleData = data.roleData;
					//reset progress
					update.progress = data.progress;
					//remove userData from local storage
					this.authenticationService.removeUserData();

					//update
					this.authenticationService.setUserData(update);

					if (this.roleData.role === 'student' || this.roleData.role === 'graduate') {
						//update form fields
						this.setStudentFormFields();
					}

					if (this.roleData.role === 'mentor') {
						this.setMentorFormFields();
					}

					if (this.roleData.role === 'business') {
						this.setBusinessFields();
					}

				}


				handleCareersResponse(data){
					this.careerPaths = data.careers;
				}



				handleImageResponse(data: any): void{
					this.authenticationService.removeUser();
					this.authenticationService.setUser(data.user);
					this.user = data.user;
				}


				handleIndustriesResponse(data: any){
					data.industries.forEach((item) => {
						this.industries.push({id: item.id, name: item.name});
					});
				}



				handleUpdatedUserIndustry(data : any){
					this.industryForm.get('industries').setValue(this.user.industries);
				}


				get profile(){
					return this.profileData;
				}

				//Add new business social handle
				addSocialHandle(): void {
					this.social_handle = this.companyForm.get('social_handle') as FormArray;
					this.social_handle.push(this.createSocialHandle());
				}

				//return a new object of added tag
				addTag(name){
					return {name: name, tag: true}
				}

				// remove work education from group
				removeSocialHandle(index) {
					this.social_handle.removeAt(index);
				}

				countryChange(e){
					return this.getStates(this.userForm.controls['country'].value);
				}

				getCareerPaths(){
					this.baseService.fetchCareerPaths()
					.subscribe(
						data => {
							this.handleCareersResponse(data);
						},
						error => {
							this.alert.errorMsg(error.error,"Request Failed");
						}
						)
				}

				getProfileData(){
					this.baseService.fetchUserProfile()
					.subscribe(
						data => {
							this.handleProfileResponse(data);
						},
						error => {
							this.alert.errorMsg(error.error,"Request Failed");
						}
						)
				}

				getCountries(){
					this.baseService.fetchCountries()
					.subscribe(
						data => {
							this.handleCountriesResponse(data);
						},
						error => {
							this.alert.errorMsg(error.error,"Request Failed");
						}
						)
				}

				getStates(id: number){
					this.baseService.getStates(id)
					.subscribe(
						data => {
							this.handleStatesResponse(data);
						},
						error => {
							this.alert.errorMsg(error.error,"Request Failed");
						}
						)
				}

				getCities(id: number){
					this.baseService.getCities(id)
					.subscribe(
						data => {
							this.handleCitiesResponse(data);
						},
						error => {
							this.alert.errorMsg(error.error,"Request Failed");
						}
						)
				}


				updateLocalStorage(data : any){
					this.authenticationService.removeUserData();
					this.authenticationService.setUserData(data.profileData);

					//update global current user
					this.authenticationService.removeUser();
					this.authenticationService.setUser(data.profileData.user);
				}

				openModal(): void {
					$(document).find('#imageCropperModal').modal();
				}


				// PROFILE AVATAR & IMAGE UPLOAD
				uploadProfileAvatar(event: any): void {
					this.openModal();
					this.imageChangedEvent = event;
				}

				imageCropped(event: ImageCroppedEvent) {
					this.croppedImage = event.base64;
				}
				imageLoaded() {
					// show cropper
				}
				cropperReady() {
					// cropper ready
					console.log("image crop ready");
				}
				loadImageFailed() {
					// show message
					console.log("image crop failed");
				}



				uploadHeaderImage(profileHeaderInput: any): void {
					const headerImage : File = profileHeaderInput.files[0];
					this.saveHeaderImage(headerImage);
				}

				saveImage(): void {
					this.avatarLoading = true;
					let imageObject: any = {image: this.croppedImage};

					this.baseService.updateImage(imageObject, this.user.id)
					.subscribe(
						data => {
							this.handleImageResponse(data);
							this.avatarLoading = false;
							$('#closeImageModal').click();
						},

						error => {
							this.avatarLoading = false;
						}
						)
				}


				saveHeaderImage(imageData : any): void {
					this.baseService.updateHeaderImage(imageData, this.user.id)
					.subscribe(
						data => {
							this.handleImageResponse(data);
						},
						error => {
							//do nothing
						}
						)
				}


				public removeBgImage(){
					this.baseService.removeHeaderImage(this.currentUser.id)
					.subscribe(data => {
						this.authenticationService.removeUser();
						this.authenticationService.setUser(data);
						this.user = data;
					})
				}


				/////////////////////////////////////////////////////////////////////
				// Form submissions

				userFormSubmit(){
					this.userFormError = '';
					this.userFormSubmitted = true;

					// stop here if form is invalid
					if (this.userForm.invalid) {
						return;
					}

					this.userFormLoading = true;

					this.baseService.updateUserData(this.userForm.value, 'update-user-data', this.user.id)
					.pipe(first())
					.subscribe(
						data => {
							// Update user data
							this.handleProfileResponse(data);
							this.userFormLoading = false;
							// update localstorage data
							this.updateLocalStorage(data);
							this.alert.successMsg("Your profile has been updated","Account Update Successful");
						},
						error => {
							this.alert.errorMsg(error, "Error");
							this.userFormLoading = false;
						});

				}


				studentFormSubmit(){
					this.studentFormError = '';
					this.studentFormSubmitted = true;

					// stop here if form is invalid
					if (this.studentForm.invalid) {
						return;
					}

					this.studentFormLoading = true;

					this.baseService.updateUserData(this.studentForm.value, 'update-student-data/'+this.profile.role, this.user.id)
					.pipe(first())
					.subscribe(
						(data :any) => {
							// Update user data
							this.studentFormLoading = false;
							this.handleRoledataResponse(data);
							this.alert.successMsg("Your profile has been updated","Account Update Successful");
						},
						error => {
							this.alert.errorMsg(error, "Error");
							this.studentFormLoading = false;
						});

				}

				mentorFormSubmit(){
					this.mentorFormError = '';
					this.mentorFormSubmitted = true;

					// stop here if form is invalid
					if (this.mentorForm.invalid) {
						return;
					}

					this.mentorFormLoading = true;

					this.baseService.updateUserData(this.mentorForm.value, 'update-mentor-data', this.user.id)
					.pipe(first())
					.subscribe(
						data => {
							// Update user data
							this.mentorFormLoading = false;
							this.handleRoledataResponse(data);
							this.alert.successMsg("Your profile has been updated","Account Update Successful");
						},
						error => {
							this.alert.errorMsg("Unable to update account.","There was an error");
							this.mentorFormLoading = false;
						});

				}


				industryFormSubmit(){

					if (this.industryForm.invalid) {
						return;
					}
					this.baseService.updateUserData(this.industryForm.value, 'update-industry-data', this.user.id)
					.pipe(first())
					.subscribe(
						data => {
							// Update user data
							this.alert.successMsg("Industry List updated successfully","Account Update Successful");
						},
						error => {
							this.alert.errorMsg("Unable to update account.","There was an error");
						});

				}


				passwordFormSubmit(){
					this.passSubmitted = true;

					// stop here if form is invalid
					if (this.passwordForm.invalid) {
						return;
					}

					this.baseService.updateUserData(this.passwordForm.value, 'update-password-data', this.user.id)
					.pipe(first())
					.subscribe(
						data => {
							// Update user data
							this.alert.successMsg("Your Account Password has been updated. Next time you login, use it.","Account Update Successful");
						},
						error => {
							this.alert.errorMsg("Unable to update account.","There was an error");
						});

				}


				companyFormSubmit(){
					this.companyFormSubmitted = true;

					// stop here if form is invalid
					if (this.companyForm.invalid) {
						return;
					}

					this.companyFormLoading = true;

					this.baseService.updateUserData(this.companyForm.value, 'update-business-data', this.user.id)
					.pipe(first())
					.subscribe(
						data => {
							// Update user data
							this.companyFormLoading = false;
							this.handleRoledataResponse(data);
							this.alert.successMsg("Your profile has been updated","Account Update Successful");
						},
						error => {
							this.alert.errorMsg("Unable to update account.","There was an error");
							this.companyFormLoading = false;
						});

				}


				//=========================== Delete Account ===============================//

				handleDeletionResponse( data:any ):void {
					if (data.success) {
						//wipe localStorage and reload page
						this.authenticationService.logout();
						window.location.reload();
					}else{

						this.alert.snotSimpleSuccess(data.error);
					}
				}

				deleteAccount() {

					this.deletingProfile = true;

					let data = {
						user_id : this.currentUser.id
					};

					this.baseService.removeAccount(data)
					.subscribe(data => {
						this.handleDeletionResponse(data);
					});
				}


				//=============================== Upgrade Student Account ==========================//
				upgradeAccount():void {
					// console.log(this.currentUser.id);
				}

			}
