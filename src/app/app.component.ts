import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Event, Router, NavigationEnd, RouterOutlet, NavigationStart } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { slideInAnimation } from './aminations';
import { ChatAdapter } from 'ng-chat';
import { Adapter } from './adapter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideInAnimation ]
})
export class AppComponent {
  title = 'startev-client';
  loading = true;
  currentUser: User;

    //Messenger
  public userId = 5;
  public messengerTitle = 'Messenges';
  public adapter: ChatAdapter = new Adapter();

  constructor(
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      this.router.events.subscribe((routerEvent: Event) => {
        if (routerEvent instanceof NavigationStart) {
          this.loading = true;
        }

        if (routerEvent instanceof NavigationEnd) {
          this.loading = false;
        }
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
