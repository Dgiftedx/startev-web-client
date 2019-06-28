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
  selector: 'app-knowledge-hub-business-management',
  templateUrl: './knowledge-hub-business-management.component.html',
  styleUrls: ['./knowledge-hub-business-management.component.css']
})
export class KnowledgeHubBusinessManagementComponent implements OnInit {

  currentUser: User;

  public query = '?q=entrepreneurship_business_management';
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
    private embedService: EmbedVideoService,
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

}
