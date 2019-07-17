import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { Event as routerEvent }from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../_services';
import { User } from '../../_models';
import { Subscription } from 'rxjs'
import { Functions } from '../../_helpers';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() public searchEvent = new EventEmitter<any>();

  currentUser: User;
  show: boolean = false;
  showNoti:boolean = false;
  public notyInterval;

  notyCount : number = 0;
  notifications:any = [];
  notificationSubscription: Subscription;

  constructor(
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.router.events.subscribe((event: routerEvent) => {

      if (event instanceof NavigationStart) {
        // Hide loading indicator
        if ($(".user-account-settingss").hasClass('active')) {
          $(".user-account-settingss").removeClass("active");
        }

        if (this.show) {
          this.toggleNav();
        }
      }
    });

  }



  toggleOptionClass() {
    $(".user-account-settingss").toggleClass("active");
  }


  ngOnInit() {
    this.refreshNotifications();

    //= Shoot Help Tips at regulat interval of 3mins =//
      this.notyInterval = setInterval(() => {
        this.refreshNotifications();
      }, 6000 * 3);
  }



  markAsRead(){
    this.baseService.markAllAsRead(this.currentUser.id)
    .subscribe(data => {
      this.alert.snotSimpleSuccess("Successfull");
      this.refreshNotifications();
    })
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
        return 'assets/images/default/avatar.jpg';
      }
      return item;
    }
  }

  public count( items:any ){
    return _.size(items);
  }


  splitName(name:string) {
    let splitted = name.split(" ");
    return splitted[0];
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  refreshNotifications(){
    this.notificationSubscription = this.baseService.getWidgetNotifications(this.currentUser.id)
    .subscribe( (data:any) => {
      this.notifications = data;
      this.notyCount = 0;
      data.forEach(item => {
        if (item.status === 'unread') {
           this.notyCount += 1
        }
      });
    });
  }


  //===================== Search Handler ===================//
  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    this.baseService.changeQuery(stringEmitted);
    //navigate to search result page
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/search-result'])); 
  }

  toggleNav() {
    this.show = !this.show;
  }


  toggleNoty(){
    return this.refreshNotifications();
  }

  toggleMenu(){
    $(document).find('.js-right-sidebar').click();
  }

  progress(){
    return this.profile.progress + '%';
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


  ngOnDestroy() {
      if (this.notyInterval) {
        clearInterval(this.notyInterval);
      };
    }

}
