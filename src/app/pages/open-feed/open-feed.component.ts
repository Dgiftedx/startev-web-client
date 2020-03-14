import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Lightbox } from 'ngx-lightbox';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseService, } from '../../_services/base.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { NavbarService } from '../../_services/navbar.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-open-feed',
	templateUrl: './open-feed.component.html',
	styleUrls: ['./open-feed.component.css']
})
export class OpenFeedComponent implements OnInit {


	feedSubscription : Subscription;
	public feed : any = {};
	public recentFeeds : Array<any> = [];

	constructor(
		private nav : NavbarService, 
		private lightbox: Lightbox,
		private baseService : BaseService, 
		private route : ActivatedRoute,
		private authenticationService : AuthenticationService,
		private router : Router) {
		//disable resuable route
	    this.router.routeReuseStrategy.shouldReuseRoute = function () {
	      return false;
	    };
	}

	ngOnInit() {
		this.feed = this.route.snapshot.data.feed.feed;
		this.recentFeeds = this.route.snapshot.data.feed.recent;

		//hide main navbar
		this.nav.hide();
	}


	//============= Count Items =================//
	count(items : any ){
		return _.size(items);
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
				return '/assets/images/default/avatar.jpg';
			}
			return this.authenticationService.baseurl+item;
		}
	}



	//============= Open Image ===============//
	openImage(feed:any) {
		let imageArray: Array<any> = [];

		imageArray.push({
			src : this.authenticationService.baseurl+feed.image,
			caption : feed.title
		});

		this.lightbox.open(imageArray, 0);
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
	ngOnDestroy(){
		this.nav.show();
	}

}
