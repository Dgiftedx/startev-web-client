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
  selector: 'app-main-store',
  templateUrl: './main-store.component.html',
  styleUrls: ['./main-store.component.css']
})
export class MainStoreComponent implements OnInit {

  currentUser : User;

  public singleProduct:any = {};
  public selectedSingleImage:any = '';

  public store:any = {};
  public products:Array<any> = [];
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
    this.products = this.route.snapshot.data.store.products;
    this.store = this.route.snapshot.data.store.storeDetails;
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  //============= Count ================//
  count(items:any){
    return _.size(items);
  }

  //===================== Search Handler ===================//
  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    // Your request...
    console.log(stringEmitted);
  }

  getFirstLetter(word:string){
    return word.charAt(0);
  }


  // set selected image
  setSelectedImage(image){
    if (image === this.selectedSingleImage) {
      return;
    }
    return this.selectedSingleImage = image;
  }

  

  triggerView(product:number){

    let search = _.findLast(this.products, ['id',product]);

    if (search) {
      this.singleProduct = search;
      this.selectedSingleImage = search.images[0];
    }

    $(document).find('#productPreviewModal').modal('show');
  }


  closeModal(){
    $(document).find('#productPreviewModal').modal('hide');
  }

}
