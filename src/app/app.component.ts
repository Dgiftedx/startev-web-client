import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { slideInAnimation } from './aminations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideInAnimation ]
})
export class AppComponent {
  title = 'startev-client';
  loading = false;
  currentUser: User;

  constructor(
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
