declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-knowledge-hub',
  templateUrl: './knowledge-hub.component.html',
  styleUrls: ['./knowledge-hub.component.css'],
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
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ],
})
export class KnowledgeHubComponent implements OnInit {


	currentUser : User;


    //======= Dashboard Navigation ============//
  public navigation: Array<any> = [

    {id: 1, alias: "career_fields", name: "All Career Fields"},
    {id: 2, alias: "career_development", name: "Career Development"},
    {id: 3, alias: "general_knowledge", name: "General Knowledge Area"},
    {id: 4, alias: "business_management", name: "Entrepreneurship & B.Management"},
  ];


  public selectedNavigation = this.navigation[0];

  constructor(
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.config.notFoundText = 'item not found';
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
   //
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }



  //============= Set Active Navigation ==================//
  setActiveNavigation(navigation:any) {
    this.selectedNavigation = navigation;
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
  // hasCoverImage(publicaiton:any){
  //   return _.size(publicaiton.image) > 0 ? true:false;
  // }

  //============== check if has training video =============//
  // hasTrainingVideo(publication: any){
  //   return (_.size(publication.videoLink) > 0 && _.size(publication.videoSource) > 0) ? true:false;
  // }

  //=============== Delegate type ====================//
  // delegateType(publication:any){
  //   if (this.hasTrainingVideo(publication)) {
  //     return 'video';
  //   }else {
  //     return 'image';
  //   }
  // }


  //=============== Show embeded Video ====================//
  // showEmbededVideo(source:any, link:any){

  //   return this.embedService.embed(link,{
  //     query: {color: '333'},
  //     attr: {height: 490}
  //   });
  // }


  //==================== Toggle likes ===================//

  // toggleLike(publicationId:number){
  //   this.onToggleLike(publicationId);
  // }

  // handleLikeToggleResponse(data: any): void {
  //   this.alert.snotSuccess(data.message);
  //   let publication = _.findIndex(this.publications, ['id',data.targetPublication.id]);
  //   this.publications[publication].hasLiked = data.hasLiked;
  //   this.publications[publication].likers = data.likers;
  // }

  // onToggleLike(target: number){
  //   this.baseService.togglePublicationLike(this.currentUser.id, target)
  //   .subscribe(
  //     data => {
  //       this.handleLikeToggleResponse(data);
  //     }
  //     )
  // }




  //===================== Search Handler ===================//
  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    // Your request...
    console.log(stringEmitted);
  }


  //=============== Check publicaiton audience =============//
  // checkAudience(pub_audience:string, pub_author_id:number) {

  //   //check publication audience
  //  if (pub_audience === 'trainee') {
  //      //check if current user has connection to the author
  //     return this.connections.includes(pub_author_id)?true:false;
  //   }
  //   return true;
  // }
}
