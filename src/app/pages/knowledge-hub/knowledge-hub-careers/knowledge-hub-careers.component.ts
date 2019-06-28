declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { EmbedVideoService } from 'ngx-embed-video';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';

@Component({
  selector: 'app-knowledge-hub-careers',
  templateUrl: './knowledge-hub-careers.component.html',
  styleUrls: ['./knowledge-hub-careers.component.css']
})
export class KnowledgeHubCareersComponent implements OnInit {



  currentUser: User;

  public query = '?q=all_career_fields';
  public showPublications:boolean = false;
  public industries:any = [];
  public showMain:boolean = true;
  public showMaterials:boolean = false;
  public showDetails:boolean = false;
  public currentView : any = {};
  public industryPublications : any = [];
  public publications : any = [];
  private allCareersSubscription : Subscription;

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private embedService: EmbedVideoService,
    private formBuilder: FormBuilder,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
   
   this.allCareersSubscription = this.baseService.fetchHubMaterials(this.query)
   .subscribe( data => {
   	this.industryPublications = data;
   });

  }

  //========== Count Items ============//
  public count(items: any) {
    return _.size(items);
  }

  openMain() {
    this.showPublications = false;
    this.showMaterials = false;
    this.showDetails = false;
    this.showMain = true;
  }

  openMaterials(publication) {
    this.publications = publication.items;
    this.showMain = false;
    this.showMaterials = true;
  }


  openPublication(publication) {
    this.currentView = publication;
    this.showMain = false;
    this.showMaterials = false;
    this.showDetails = true;
  }


  backToMaterials() {
    this.showMain = false;
    this.showDetails = false;
    this.showMaterials = true;
  }

   filterFilePath(path:string) {
      let basePath = this.authenticationService.baseurl + "/uploads/";

      let newPath = path.split(basePath);

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
        return 'assets/images/default/avatar.jpg';
      }
      return item;
    }
  }





  downloadFile(material:any, index:any, type:string) {
    if (type === 'file') {
      let file_name = this.filterFilePath(material.files[index]);
      let formatted = file_name.replace(" ", "-");

      return window.open(this.basePath + "/download-file?file="+formatted, "_blank");
    }else{

      let image = material.images[index];
      return window.open(this.basePath + "/download-file?image="+image, "_blank");
    }
  }

}
