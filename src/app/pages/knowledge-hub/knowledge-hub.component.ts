declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { EmbedVideoService } from 'ngx-embed-video';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-knowledge-hub',
  templateUrl: './knowledge-hub.component.html',
  styleUrls: ['./knowledge-hub.component.css']
})
export class KnowledgeHubComponent implements OnInit {


	currentUser : User;
	searchForm : FormGroup;
  public publications = [];
  connections:Array<any> = [];

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
    this.publications = this.route.snapshot.data.pub.publications;
    this.searchForm = this.formBuilder.group({
      search : ['']
    });

    //get current user connections
    this.route.snapshot.data.pub.connections.forEach(item => {
      this.connections.push(item.trainer_id);
    });
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  //============= Count ================//
  count(items:any){
    return _.size(items);
  }

  //============= Make Initials ===================//
  initials(name: string){
    let nameArray = name.split(" ");
    let initials = '';

    for (var i = 0; i < _.size(nameArray); i++) {
      initials += nameArray[i].charAt(0);
    }

    return initials;
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


  //==================== Toggle likes ===================//

  toggleLike(publicationId:number){
    this.onToggleLike(publicationId);
  }

  handleLikeToggleResponse(data: any): void {
    this.alert.snotSuccess(data.message);
    let publication = _.findIndex(this.publications, ['id',data.targetPublication.id]);
    this.publications[publication].hasLiked = data.hasLiked;
    this.publications[publication].likers = data.likers;
  }

  onToggleLike(target: number){
    this.baseService.togglePublicationLike(this.currentUser.id, target)
    .subscribe(
      data => {
        this.handleLikeToggleResponse(data);
      }
      )
  }




  //===================== Search Handler ===================//
  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    // Your request...
    console.log(stringEmitted);
  }


  //=============== Check publicaiton audience =============//
  checkAudience(pub_audience:string, pub_author_id:number) {

    //check publication audience
   if (pub_audience === 'trainee') {
       //check if current user has connection to the author
      return this.connections.includes(pub_author_id)?true:false;
    }
    return true;
  }

}
