declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Functions } from '../../_helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Event as routerEvent }from '@angular/router';
import { NavbarService } from '../../_services/navbar.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { AuthenticationService, AlertService, UserService, BaseService } from '../../_services';



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

  public showMobileMenu:boolean = false;
  public showAccountSettings:boolean = false;

  notyCount : number = 0;
  notifications:any = [];
  notificationSubscription: Subscription;

  constructor(
    private router: Router,
    private alert: AlertService,
    public nav : NavbarService,
    private userService : UserService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.router.events.subscribe((event: routerEvent) => {

      if (event instanceof NavigationStart) {
        // on route load, hide user account settings dropdown
        this.showAccountSettings = false;

        // on route load, hide notification bar if opened
        this.showNoti = false;

        //on route load, hide mobile menu if opened
        this.showMobileMenu = false;

        if (this.show) {
          this.toggleNav();
        }
      }
    });

  }



  toggleOptionClass() {
    return this.showAccountSettings = !this.showAccountSettings;
  }


  ngOnInit() {
    this.refreshNotifications();

    //= Shoot Help Tips at regulat interval of 3mins =//
      this.notyInterval = setInterval(() => {
        this.refreshNotifications();
      }, 6000 * 3);
  }


  toggleMoileNav(){
    return this.showMobileMenu = !this.showMobileMenu;
  }



  markAsRead(){
    this.baseService.markAllAsRead(this.currentUser.id)
    .subscribe(data => {
      this.alert.snotSimpleSuccess("Successfull");
      this.refreshNotifications();
    })
  }


  openNotiBar(){
    return this.showNoti = !this.showNoti;
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
