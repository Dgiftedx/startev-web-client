declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { EmbedVideoService } from 'ngx-embed-video';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';


@Component({
  selector: 'app-publication-view',
  templateUrl: './publication-view.component.html',
  styleUrls: ['./publication-view.component.css']
})
export class PublicationViewComponent implements OnInit {

 currentUser : User;
 publicationSubscription : Subscription;
 currentPublication:any;
 likes:any;

 constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private embedService: EmbedVideoService,
    private alert: AlertService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

 ngOnInit() {
    this.currentPublication = this.route.snapshot.data.publicationView.publication;
    this.likes = this.route.snapshot.data.publicationView.likers;
  }


  count(items: Array<any>) {
    return _.size(items);
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

   //============= check if has cover image ==================//
  hasCoverImage(publicaiton:any){
    return _.size(publicaiton.image) > 0 ? true:false;
  }

  //============== check if has training video =============//
  hasTrainingVideo(publication: any){
    return (_.size(publication.videoLink) > 0 && _.size(publication.videoSource) > 0) ? true:false;
  }

  //=============== Delegate type ====================//
  delegateType(publication:any){
    if (this.hasTrainingVideo(publication)) {
      return 'video';
    }else {
      return 'image';
    }
  }


  //=============== Show embeded Video ====================//
  showEmbededVideo(source:any, link:any){

    return this.embedService.embed(link,{
        query: {color: '333'},
        attr: {height: 490}
      });
  }

}
