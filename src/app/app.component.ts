import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'startev-client';
  loading = false;

  constructor(public router: Router, private ngxService: NgxUiLoaderService) {

  }


  ngOnInit() {
  }

 
  ngAfterViewInit() {
  	this.router.events.subscribe(event => {
  		if (event instanceof NavigationEnd) {
  			window.scrollTo(0,0);
  		}
  	});
  }
}
