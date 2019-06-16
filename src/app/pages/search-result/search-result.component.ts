import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService} from '../../_services';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  currentUser: User;
  searchQuery:string;
  searchResults: any = [];
  totalSearchCount:number = 0;

  constructor(
    private router: Router,
    private alert: AlertService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.baseService.currentSearchQuery.subscribe(query => this.searchQuery = query);

    this.querySearchHandler();
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  //================ Searhc Handler ===========================//
  querySearchHandler() {

  	//if search query is empty, halt.
  	if (this.count(this.searchQuery) === 0) {
  		return;
  	}


  	let search = {
  		query : this.searchQuery
  	};

  	this.baseService.getSearchResults(search)
  	.subscribe(data => {
  		this.searchResults = data;
  	})
  }


  ngOnInit() {
    //
  }

  //=============== Count Items =================//
  public count(items:any) {
  	return _.size(items);
  }

}
