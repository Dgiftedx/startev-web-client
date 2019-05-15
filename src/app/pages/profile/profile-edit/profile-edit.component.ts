import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../../_services';
import { User } from '../../../_models';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgSelectConfig } from '@ng-select/ng-select';


@Component({
	selector: 'app-profile-edit',
	templateUrl: './profile-edit.component.html',
	styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
	private value:any = {};
	public countries : Array<any> = [];
	states: Array<any> = [];
	cities: Array<any> = [];
	careerPaths : Array<any> = [];
	public selectedCountry = {};

	currentUser: User;
	show: boolean = false;
	user;
	profileData;
	roleData;

	progress;
	role;

	userForm: FormGroup;
	studentForm: FormGroup;
	mentorForm: FormGroup;
	businessForm: FormGroup;

	workExperience: FormArray;
	education: FormArray;
	services: FormArray;
	social_handle: FormArray;

	userFormLoading = false;
	userFormSubmitted = false;
	userFormError = '';

	constructor(
		private config: NgSelectConfig,
		private router: Router,
		private formBuilder: FormBuilder,
		private alert: AlertService,
		private userService : UserService,
		private baseService: BaseService,
		private authenticationService: AuthenticationService) {
		this.createForm();
		this.config.notFoundText = 'item not found';
	}



	createWorkExperienceItems(): FormGroup {
		return this.formBuilder.group({
			company: '',
			position: '',
			location: '',
			from_date: '',
			to_date: '',
			till_present: ''
		});
	}


	createEducationItems(): FormGroup {
		return this.formBuilder.group({
			institution: '',
			program: '',
			from_date: '',
			to_date: '',
			till_present: ''
		});
	}


	createServicesItems(): FormGroup {
		return this.formBuilder.group({
			slug: '',
			name: ''
		});
	}

	createSocialHandle(): FormGroup{
		return this.formBuilder.group({
			name: '',
			url: ''
		});
	}


	createForm() {
		this.userForm = this.formBuilder.group({
			name : ['', Validators.required],
			phone : ['', Validators.required],
			email : ['', [Validators.required, Validators.email]],
			dob : [''],
			bio : [''],
			country : [''],
			state : [''],
			city : [''],
			address: ['']
		});

		this.mentorForm = this.formBuilder.group({
			employmentStatus : ['', Validators.required],
			workExperience : this.formBuilder.array([this.createWorkExperienceItems()]),
			education: this.formBuilder.array([this.createEducationItems()]),
			current_job_position : ['', Validators.required]
		});

		this.studentForm = this.formBuilder.group({
			institution: ['', Validators.required],
			faculty: ['', Validators.required],
			department: ['', Validators.required],
			level: ['', Validators.required],
			careerPath: [''],
			secondaryCP: ['']
		});

		this.businessForm = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			phone: ['', Validators.required],
			website: ['', Validators.required],
			services: this.formBuilder.array([this.createServicesItems()]),
			social_handle: this.formBuilder.array([this.createSocialHandle()])
		});
	}


	ngOnInit() {
		this.getProfileData();
		this.getCountries();
	}

	handleProfileResponse(data: any){
		this.user = data.profileData.user;
		this.roleData = data.profileData.roleData;
		this.progress = data.profileData.progress;
		this.role = data.profileData.role;
		this.profileData = data.profileData;

		//Set userForm values
		this.userForm.get('name').setValue(this.user.name);
		this.userForm.get('email').setValue(this.user.email);
		this.userForm.get('phone').setValue(this.user.phone);
		this.userForm.get('bio').setValue(this.user.bio);
		this.userForm.get('dob').setValue(this.user.dob);
		this.userForm.get('country').setValue(this.user.country);
		this.userForm.get('state').setValue(this.user.state);
		this.userForm.get('city').setValue(this.user.city);
		this.userForm.get('address').setValue(this.user.address);

		//toggle Disable State
		this.toggleDisableState();

		//Set role based form values
		if (this.profileData.role === 'student') {
			this.studentForm.get('institution').setValue(this.roleData.institution);
			this.studentForm.get('faculty').setValue(this.roleData.faculty);
			this.studentForm.get('department').setValue(this.roleData.department);
			this.studentForm.get('level').setValue(this.roleData.level);
			this.studentForm.get('careerPath').setValue(this.roleData.careerPath);
			this.studentForm.get('secondaryCP').setValue(this.roleData.secondaryCP);
		}

		if (this.profileData.role ==='business') {
			this.businessForm.get('name').setValue(this.roleData.name);
			this.businessForm.get('description').setValue(this.roleData.description);
			this.studentForm.get('website').setValue(this.roleData.website);
			this.studentForm.get('phone').setValue(this.roleData.phone);
		}


		// console.log(data.profileData);
	}


	toggleDisableState(){
		if (_.size(this.states) === 0) {
			this.userForm.controls['state'].disable();
		}else{
			this.userForm.controls['state'].enable();
		}

		if (_.size(this.cities) === 0) {
			this.userForm.controls['city'].disable();
		}else{
			this.userForm.controls['city'].enable();
		}
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

	get profile(){
		return this.profileData;
	}




	//Add new mentor work experience
	addworkExperience(): void {
		this.workExperience = this.mentorForm.get('workExperience') as FormArray;
		this.workExperience.push(this.createWorkExperienceItems());
	}


	//Add new mentor education background
	addEducation(): void {
		this.education = this.mentorForm.get('education') as FormArray;
		this.education.push(this.createEducationItems());
	}


	//Add new business services
	addServices(): void {
		this.services = this.businessForm.get('services') as FormArray;
		this.services.push(this.createServicesItems());
	}

	//Add new business social handle
	addSocialHandle(): void {
		this.social_handle = this.businessForm.get('social_handle') as FormArray;
		this.social_handle.push(this.createSocialHandle());
	}

	// remove work experience from group
	removeWorkExperience(index) {
		this.workExperience.removeAt(index);
	}

	// remove work education from group
	removeEducation(index) {
		this.education.removeAt(index);
	}

	// remove work experience from group
	removeService(index) {
		this.services.removeAt(index);
	}

	countryChange(e){
		return this.getStates(this.userForm.controls['country'].value);
	}

	stateChange(e){
		return this.getCities(this.userForm.controls['country'].value);
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


	/////////////////////////////////////////////////////////////////////
	// Form submissions

	userFormSubmit(){
		this.userFormError = '';
		this.userFormSubmitted = true;
		
		// stop here if form is invalid
        if (this.userForm.invalid) {
        	console.log(this.userForm.value);
            return;
        }

        this.userFormLoading = true;

	}

}
