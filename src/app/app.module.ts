import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule, MatCheckboxModule, MatTabsModule} from '@angular/material';
import { VgCoreModule} from 'videogular2/core';
import { VgControlsModule} from 'videogular2/controls';
import { VgOverlayPlayModule} from 'videogular2/overlay-play';
import { VgBufferingModule} from 'videogular2/buffering';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from  'angular7-ladda';
import { ExcerptFilter } from './_filters/excerpt.filter';
import { DateAgoPipe } from './_filters/date-ago.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { BaseService } from './_services';
import { IndustryResolve, SingleIndustryResolve, ProfileEditResolve } from './_resolvers';
import { MentorProfileResolve } from './_resolvers/mentor-profile.resolver';
import { VentureResolve } from './_resolvers/venture.resolver';
import { BusinessResolve } from './_resolvers/business.resolver';
import { SingleVentureResolve } from './_resolvers/single-venture.resolver';
import { OrderModule } from 'ngx-order-pipe';
// import { CKEditorModule } from 'ngx-ckeditor';

library.add(fas);

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#C90C0C',
  bgsPosition: "bottom-center",
  bgsSize: 40,
  fgsType: SPINNER.chasingDots, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbColor: "#C90C0C",
  overlayColor: "rgba(40, 40, 40, 0.9)",
  pbThickness: 5, // progress bar thickness
};

import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { NavbarComponent } from './pages/navbar/navbar.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { FeedsComponent } from './pages/home/feeds/feeds.component';
import { AlertComponent } from './pages/alert/alert.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { ProfileComponent } from './pages/profile/main-profile/profile.component';
import { MentorComponent } from './pages/mentors/mentor-list/mentor.component';
import { MessageComponent } from './pages/message/message.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { VentureHubComponent } from './pages/venture-hub/venture-hub.component';
import { KnowledgeHubComponent } from './pages/knowledge-hub/knowledge-hub.component';
import { ForgotPasswordComponent } from './pages/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/password/reset-password/reset-password.component';
import { IndustryListComponent } from './pages/industries/industry-list/industry-list.component';
import { IndustryDetailsComponent } from './pages/industries/industry-details/industry-details.component';
import { FollowComponent } from './pages/widgets/follow/follow.component';
import { ConnectComponent } from './pages/widgets/connect/connect.component';
import { MentorsComponent } from './pages/widgets/mentors/mentors.component';
import { MentorProfileComponent } from './pages/mentors/mentor-profile/mentor-profile.component';
import { PartnerViewComponent } from './pages/partner/partner-view/partner-view.component';
import { PartnerApplyComponent } from './pages/partner/partner-apply/partner-apply.component';
import { PartnerWatchComponent } from './pages/partner/partner-watch/partner-watch.component';
import { PartnerBoardComponent } from './pages/partner/partner-board/partner-board.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    FeedsComponent,
    AlertComponent,
    RegisterComponent,
    ProfileComponent,
    MentorComponent,
    MessageComponent,
    ProfileEditComponent,
    VentureHubComponent,
    KnowledgeHubComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ExcerptFilter,
    DateAgoPipe,
    IndustryListComponent,
    IndustryDetailsComponent,
    FollowComponent,
    ConnectComponent,
    MentorsComponent,
    MentorProfileComponent,
    PartnerViewComponent,
    PartnerApplyComponent,
    PartnerWatchComponent,
    PartnerBoardComponent,
  ],
  schemas : [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderRouterModule.forRoot({ showForeground: true }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      timeOut: 3500
    }),
    LaddaModule.forRoot({
        style: "expand-right",
        spinnerSize: 35,
        spinnerLines: 15
    }),
     OwlDateTimeModule, 
     OwlNativeDateTimeModule,
     ImageCropperModule,
     FontAwesomeModule,
     OrderModule
  ],

  exports : [
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        BaseService,
        IndustryResolve,
        SingleIndustryResolve,
        ProfileEditResolve,
        MentorProfileResolve,
        VentureResolve,
        BusinessResolve,
        SingleVentureResolve
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
