declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { switchMap, first } from "rxjs/operators";
import { EmbedVideoService } from 'ngx-embed-video';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-my-publications',
  templateUrl: './my-publications.component.html',
  styleUrls: ['./my-publications.component.css']
})
export class MyPublicationsComponent implements OnInit {

  currentUser : User;
  submitted:boolean = false;
  public showMain:boolean = true;
  public showEdit:boolean = false;
  public showCreateNew:boolean = false;


  publicationCurrentId:any;

  publicationTitle : string = '';
  publicationContent : string = '';
  publicationCategory : string = '';
  publicIndustry : string = '';
  publicationId:string = '';

  public options: Object = {
  placeholderText: 'Start typing your content!',
    charCounterCount: true,
    height: 200,
    htmlExecuteScripts: false
  }


  public publications: any = [];

  public isImage = false;
  public images: Array<any> = [];
  public pubFiles: Array<any> = [];
  public categories : any = [];
  public industries : any = [];
  public processedImages: Array<any> = [];
  public showCategories : boolean = false;
  public showIndustries : boolean = false;
  private allowedExtensions:Array<any> = ['xlsx','xls','ppt', 'pdf', 'txt', 'docx' ,'doc'];
  private categoriesSubscription: Subscription;
  private industriesSubscription: Subscription;
  private publicationSubscription : Subscription;


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private embedService: EmbedVideoService,
    private formBuilder: FormBuilder,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.categoriesSubscription = this.baseService.fetchPublicationCat()
    .subscribe( (data : any) => {
      this.categories = data.categories;
      this.industries = data.industries;

      if (this.count(this.categories) > 0) {
        this.showCategories = true;
      }
    });


    this.publicationSubscription = this.baseService.fetchMyPublications(this.currentUser.id)
    .subscribe( data => {
      this.publications = data;
    });

  }

  ngOnInit() {
  }

  getMyPublications() {
     this.publicationSubscription = this.baseService.fetchMyPublications(this.currentUser.id)
    .subscribe( data => {
      this.publications = data;
    });
  }

  openPublications() {
    this.getMyPublications();
    this.showMain = true;
    this.showEdit = false;
    this.showCreateNew = false;
  }


  createNewPublication() {
    this.showMain = false;
    this.showEdit = false;
    this.showCreateNew = true;
  }



  editPublication(publication:any) {
    this.publicationCurrentId = publication.id;
    this.publicationTitle = publication.title;
    this.publicationContent = publication.content;

    let category = _.findLast(this.categories, ['id', publication.category_id]);
    if (category) {
      this.publicationCategory = category.category_slug;
    }

    if (publication.industry_id) {
      this.publicationId = publication.industry_id;
      this.showIndustries = true;
    }

    this.showMain = false;
    this.showCreateNew = false;
    this.showEdit = true;
  }


  cancelUpdate() {
    this.publicationCurrentId = null;
    this.resetForm();
    this.openPublications();
  }

  count(items:any) {
    return _.size(items);
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  //Algorithm to show user Job title
  echoJobTitle(roleData: any, role: string){
    return this.baseService.echoJobTitle(roleData, role);
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
        return 'assets/images/default/avatar.jpg';
      }
      return item;
    }
  }


  changeCategory() {
    if (this.publicationCategory === 'all_career_fields') {
      if (this.count(this.industries) > 0) {
        this.showIndustries = true;
      }
    }  
  }


  resetForm() {
    this.publicationTitle = '';
    this.publicationContent = '';
    this.publicationCategory = '';
    this.publicationId = '';
    
    $('#file-upload').val("");
    $('#pub-file').val("");

    this.processedImages = [];
    this.pubFiles = [];
  }

    //============ Image Reader ===============//

  setupReader(file : File) {
      var name = file.name;
      var reader = new FileReader();  
     reader.addEventListener('load', (event: any) => {
          this.processedImages.push(event.target.result); 
      });
      reader.readAsDataURL(file);
  }

  processPubImage(postImage: any): void {
    this.processedImages = [];

    if (postImage.files.length > 5) {
      this.alert.errorMsg("You can only upload maximum of 5 pictures", "You Exceeded Upload Limit");
      return;
    }

    for (var i = 0; i < postImage.files.length; i++) {
        this.setupReader(postImage.files[i]);
        this.images.push(postImage.files[i]);
    }

    this.isImage = true;

  }

  processPubFiles(pubFiles:any) {

    this.pubFiles = [];

    if (pubFiles.files.length > 5) {
      this.alert.errorMsg("You can only upload maximum of 5 files at once", "Upload limit");
    }

    for (let i = 0; i < pubFiles.files.length; i++) {
        let b = pubFiles.files[i].name.split('.').pop();
        

        //validate extension
        if (this.allowedExtensions.includes(b)) {
          this.pubFiles.push(pubFiles.files[i]);
          
        }else{
          this.alert.errorMsg("Invalid file extension detected. It has been skipped automatically", "Invalid File exytension");
        }
    }
    
  }


  removeFile(index){
    this.pubFiles.splice(index, 1);

    if (this.pubFiles.length === 0) {
      
    }
  }


  public initialize(initControls) {
    initControls.getEditor()('html.set', '');
  }


    //=================== Submit Publication =================//


  handlePublicationResponse(data){
    this.alert.snotSuccess(data.message);

    //clean form
    this.resetForm();

  }

  onPublicationSubmit(){

    if (this.count(this.publicationTitle) === 0) {
      this.alert.errorMsg("publication title can't be empty", "Form Error!!!");
      return;
    }

     if (this.count(this.publicationContent) === 0) {
      this.alert.errorMsg("publication content can't be empty", "Form Error!!!");
      return;
    }

     if (this.count(this.publicationCategory) === 0) {
      this.alert.errorMsg("publication category can't be empty", "Form Error!!!");
      return;
    }


    let formData = new FormData();

    formData.append("title", this.publicationTitle);
    formData.append("content", this.publicationContent);
    formData.append("category", this.publicationCategory);
    formData.append("user_id", this.currentUser.id);

    if (this.publicationId) {
      formData.append("industry_id", this.publicationId);
    }

    if (this.pubFiles.length > 1) {
      for (let i = 0; i < this.pubFiles.length; i++) {
        formData.append("files[]", this.pubFiles[i], this.pubFiles[i]['name']);
      }
    }

    if (this.pubFiles.length === 1) {
      formData.append("files[]", this.pubFiles[0]);
    }

    if (this.images.length > 0) {
      for (let i = 0; i < this.images.length; i++) {
        formData.append("images[]", this.images[i], this.images[i]['name']);
      }
    }

    this.baseService.publishPublication(formData)
    .subscribe(
      data => {
        this.submitted = false;
        this.handlePublicationResponse(data);
      }
   )
  }


  onPublicationUpdate(){


    if (this.count(this.publicationTitle) === 0) {
      this.alert.errorMsg("publication title can't be empty", "Form Error!!!");
      return;
    }

     if (this.count(this.publicationContent) === 0) {
      this.alert.errorMsg("publication content can't be empty", "Form Error!!!");
      return;
    }

     if (this.count(this.publicationCategory) === 0) {
      this.alert.errorMsg("publication category can't be empty", "Form Error!!!");
      return;
    }


    let formData = new FormData();

    formData.append("title", this.publicationTitle);
    formData.append("content", this.publicationContent);
    formData.append("category", this.publicationCategory);
    formData.append("user_id", this.currentUser.id);

    if (this.publicationId) {
      formData.append("industry_id", this.publicationId);
    }

    this.baseService.updatePublication(formData, this.publicationCurrentId)
    .subscribe(
      data => {
        this.submitted = false;
        this.cancelUpdate();
      }
   )
  }

  //============== Fetch Publication ==================//
  removePublication(pub_id:number,) {
    let index =  _.findIndex(this.publications, ['id', pub_id]);
    //remove feed item
    this.publications.splice(index, 1);
  }

 // =============== Delete Publication if pub author ==================//
  deletePublication(pub:any){

    this.baseService.deletePublication(pub.id)
    .subscribe( data => {
      this.alert.snotSimpleSuccess("publicaiton removed");
      this.removePublication(pub.id);
    });
  }

}
