import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
  industries: Array<any> = [];

  notifications:any = [];
  notificationSubscription: Subscription;

  constructor(
    private router: Router,
    private alert: AlertService,
    private userService : UserService,
    private baseService: BaseService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }


  ngOnInit() {
    this.navBarIndustryList();
    this.refreshNotifications();
  }


  public count( items:any ){
    return _.size(items);
  }


  refreshNotifications(){
    this.notificationSubscription = this.baseService.getWidgetNotifications(this.currentUser.id)
    .subscribe( data => {
      this.notifications = data;
    })
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


  handleIndustriesResponse(data: any){
    this.industries = data.industries;
    this.industries.forEach(item => {
        item.totalMentors = _.size(item.mentors);
    });
  }

  navBarIndustryList(){
    this.baseService.fetchIndustries()
    .subscribe(
        data => {
          this.handleIndustriesResponse(data);
        },

        error => {
          this.alert.errorMsg(error.error,"Request Failed");
        }
      )
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

}
