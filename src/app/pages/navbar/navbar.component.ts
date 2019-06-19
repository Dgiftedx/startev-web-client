import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

    this.router.events.subscribe((event: routerEvent) => {

        if (event instanceof NavigationEnd) {
            // Hide loading indicator
            if ($('body').hasClass('overlay-open')) {
              $('#closeBars').click();
            }

            if (this.show) {
              this.toggleNav();
            }


            this.jQueryEvents();
        }
    });

  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }



  jQueryEvents() {
    $(".ls-closed .sidebar .list").slimscroll({
        height: "calc(100vh - 0px)",
        color: "rgba(0,0,0,0.2)",
        position: "left",
        size: "2px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "0"
    }), $(".navbar-nav .dropdown-menu .body .menu").slimscroll({
        height: "250px",
        color: "rgba(0,0,0,0.2)",
        size: "3px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "0"
    }), $(".cwidget-scroll").slimscroll({
        height: "306px",
        color: "rgba(0,0,0,0.4)",
        size: "2px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "2px"
    }), $(".right_chat .chat_body .chat-widget").slimscroll({
        height: "calc(100vh - 145px)",
        color: "rgba(0,0,0,0.1)",
        size: "2px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "2px",
        position: "left"
    }), $(".right-sidebar .slim_scroll").slimscroll({
        height: "calc(100vh - 60px)",
        color: "rgba(0,0,0,0.4)",
        size: "2px",
        alwaysVisible: !1,
        borderRadius: "3px",
        railBorderRadius: "0"
    });




    $(".boxs-close").on("click", function() {
        $(this).parents(".card").addClass("closed").fadeOut()
    }), $(".sub_menu_btn").on("click", function() {
        $(".sub_menu").toggleClass("show")
    }), $(".theme-light-dark .t-light").on("click", function() {
        $("body").removeClass("theme-dark")
    }), $(".theme-light-dark .t-dark").on("click", function() {
        $("body").addClass("theme-dark")
    }), $(document).ready(function() {
        $(".btn_overlay").on("click", function() {
            $(".overlay_menu").fadeToggle(200), $(this).toggleClass("btn-open").toggleClass("btn-close")
        })
    }), $(".overlay_menu").on("click", function() {
        $(".overlay_menu").fadeToggle(200), $(".overlay_menu button.btn").toggleClass("btn-open").toggleClass("btn-close")
    }), $(".form-control").on("focus", function() {
        $(this).parent(".input-group").addClass("input-group-focus")
    }).on("blur", function() {
        $(this).parent(".input-group").removeClass("input-group-focus")
    });


  }


  ngOnInit() {
    this.navBarIndustryList();
    this.refreshNotifications();
    this.jQueryEvents();
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


  toggleMainNav():void {
    console.log("clicked");
   let body = $("body");
   let overlay = $(".overlay");

   body.addClass("ls-closed overlay-open")

   // if (body.hasClass("overlay-open")) {
   //   body.removeClass("overlay-open");
   //   // overlay.fadeOut();
   // }else{
   //   body.addClass("ls-closed overlay-open")
   //   overlay.fadeIn();
   // }
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
