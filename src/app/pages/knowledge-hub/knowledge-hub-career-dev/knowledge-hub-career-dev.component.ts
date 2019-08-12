declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Lightbox } from 'ngx-lightbox';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';

@Component({
  selector: 'app-knowledge-hub-career-dev',
  templateUrl: './knowledge-hub-career-dev.component.html',
  styleUrls: ['./knowledge-hub-career-dev.component.css']
})
export class KnowledgeHubCareerDevComponent implements OnInit {

 
  currentUser: User;

  public query = '?q=career_development';
  public showPublications:boolean = false;
  public publications:any = [];
  private resultsSubscription : Subscription;

  public showMain:boolean = true;
  public showDetails:boolean = false;

  public currentView:any = {};

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private lightbox: Lightbox,
    private formBuilder: FormBuilder,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.config.notFoundText = 'item not found';
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
   
   this.resultsSubscription = this.baseService.fetchHubMaterials(this.query)
   .subscribe( data => {
   	this.publications = data;
   })
  }


  public count(items:any) {
    return _.size(items);
  }


  openPublication(publication) {
    this.currentView = publication;
    this.showMain = false;
    this.showDetails = true;
  }

  filterFilePath(path:string, base_dir:string) {
    let newPath = path.split(base_dir);
    return newPath[1];
  }

  get basePath() {
    return this.authenticationService.baseurl;
  }


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
  }

 //============= Open Image ===============//
  openStackedImages(images: Array<any>, index, title:string) {

    let imageArray: Array<any> = [];

    images.forEach((item) => {
      imageArray.push({
        src : this.authenticationService.baseurl+item,
        caption : title
      });
    });
    
    this.lightbox.open(imageArray, index);
  }
  
  
  downloadFile(material:any, index:any, type:string) {
    if (type === 'file') {
      let file_name = this.filterFilePath(material.files[index], "/uploads/");
      let formatted = file_name.replace(" ", "-");
      return window.open(this.basePath + "/download-file?file="+formatted, "_blank");
    }else{
      let image_name = this.filterFilePath(material.images[index], "/storage/publication/header");
      let formattedImg = image_name.replace(" ", "-");
      return window.open(this.basePath + "/download-file?image="+formattedImg, "_blank");
    }
  }

}
