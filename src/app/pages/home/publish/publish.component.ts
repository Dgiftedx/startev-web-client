declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { FeedService } from '../../../_services/feed.service';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';


@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  currentUser : User;
  publicationForm : FormGroup;
  processedImage: File;
  publicationImage = null;
  submitted:  boolean = false;

  videoSource:string = '';
  videoLink:string = '';
  loading:boolean = false;

  //Audience
  audienceSelection: Array<any> = [
  	{id : 1, alias: "public", name: "Public", description: "visible to the general public"},
  	{id : 2, alias: "trainee", name: "Only Trainee", description: "visible only to your connected trainee"}
  ];

  //Video Source
  sourceSelection: Array<any> = [
  	{id : 1, alias: "youtube", name: "Youtube"},
  	{id : 2, alias: "vimeo", name: "Vimeo"},
  	{id : 3, alias: "dailymotion", name: "Dailymotion"},
  ];

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private feedService : FeedService,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) { 
  		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }



  ngOnInit() {

  	this.publicationForm = this.formBuilder.group({
  		title: ['', [Validators.required]],
  		audience : [],
  		content : ['', Validators.required],
  	});


    this.makeDefaultAudience();
  }


  count(items: any){
  	return _.size(items);
  }


  //====== Getter method for Current User Profile =======//

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  //======== Getter method for publication form ============//
  get f(){
  	return this.publicationForm.controls;
  }


  //============ if user is business entity, disable trainee audience selection

  makeDefaultAudience(){
    if (this.profile.role === 'business') {
      this.audienceSelection.pop();
      this.publicationForm.get('audience').setValue(this.audienceSelection[0].alias);
    }
  }

  //============ Image Reader ===============//

  imageFileReader(file: File){
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.processedImage = event.target.result; 
    });

    reader.readAsDataURL(file);
  }


  processPostImage(postImage: any): void {
    const newPostImage : File = postImage.files[0];
    this.imageFileReader(newPostImage);
    this.publicationImage = newPostImage;
  }


  validateVideoField(){
  	return _.size(this.videoSource) > 0 && _.size(this.videoLink) > 0?true:false; 
  }

  validateImage() {
    return _.size(this.publicationImage) === 0 || this.publicationImage === null || typeof this.processedImage === 'undefined'? false:true;
  }

  //=================== Submit Publication =================//


  handlePublicationResponse(data){
  	this.alert.snotSuccess(data.message);

  	//clean form
  	this.videoSource = '';
  	this.videoLink = '';
  	this.processedImage = null;
  	this.publicationImage = null;
  	this.publicationForm.get('title').setValue("");
  	this.publicationForm.get('content').setValue("");
  	this.publicationForm.get('audience').setValue("");
  }

  onPublicationSubmit(){

  	this.submitted = true;

  	if (this.publicationForm.invalid) {
  		this.alert.errorMsg("You have some empty fields left, Please check form","Error")
  		return;
  	}

  	if (!this.validateVideoField() && !this.validateImage()) {
  		this.alert.errorMsg("You can either upload a cover image or a video training which is not more than 10mins","Error");
  		return;
  	}

  	this.loading = true;

  	let formData = new FormData();

  	formData.append('user_id', this.currentUser.id);
  	formData.append('videoSource', this.videoSource);
  	formData.append('videoLink', this.videoLink);
  	formData.append('image', this.publicationImage);
  	formData.append('title', this.publicationForm.controls['title'].value);
  	formData.append('content', this.publicationForm.controls['content'].value);
  	formData.append('audience', this.publicationForm.controls['audience'].value);

  	this.baseService.publishPublication(formData)
  	.subscribe(

  		data => {
  			this.submitted = false;
  			this.loading = false;
  			this.handlePublicationResponse(data);
  		}
   )
  }
}
