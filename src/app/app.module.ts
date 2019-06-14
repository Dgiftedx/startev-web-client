import { NgChatModule } from 'ng-chat';
import { NgxPrintModule} from 'ngx-print';
import { BaseService } from './_services';
import { ToastrModule } from 'ngx-toastr';
import { OrderModule } from 'ngx-order-pipe';
import { EmbedVideo } from 'ngx-embed-video';
import { CKEditorModule } from 'ngx-ckeditor';
import { LaddaModule } from  'angular7-ladda';
import { VgCoreModule} from 'videogular2/core';
import { AppComponent } from './app.component';
import * as  Cloudinary from 'cloudinary-core';
import { NgxPaginationModule} from 'ngx-pagination';
import { InputSearchModule } from 'ngx-input-search';
import { NgSelectModule } from '@ng-select/ng-select';
import { VgControlsModule} from 'videogular2/controls';
import { DateAgoPipe } from './_filters/date-ago.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Angular4PaystackModule } from 'angular4-paystack';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { VgBufferingModule} from 'videogular2/buffering';
import { FilePickerModule } from  'ngx-awesome-uploader';
import { BrowserModule } from '@angular/platform-browser';
import { ExcerptFilter } from './_filters/excerpt.filter';
import { environment } from '../environments/environment';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { VgOverlayPlayModule} from 'videogular2/overlay-play';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule, MatTabsModule} from '@angular/material';
import { NgxUploadModule, MineTypeEnum, DropTargetOptions} from '@wkoza/ngx-upload';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { IndustryResolve, SingleIndustryResolve, ProfileEditResolve } from './_resolvers';
import { MentorProfileResolve } from './_resolvers/mentor-profile.resolver';
import { VentureResolve } from './_resolvers/venture.resolver';
import { PublicationResolve } from './_resolvers/publications.resolver';
import { BusinessResolve } from './_resolvers/business.resolver';
import { SingleVentureResolve } from './_resolvers/single-venture.resolver';
import { SingleFeedResolve } from './_resolvers/single-feed.resolver';
import { MainStoreResolve } from './_resolvers/store.resolver';
import { SingleProfileResolve } from './_resolvers/single-profile.resolver';
import { SinglePublicationResolve } from './_resolvers/single-publication.resolver';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';

// import { SnotifyDefaults } from './snotify-defaults';

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
import { FeedDetailsComponent } from './pages/home/feed-details/feed-details.component';
import { PublishComponent } from './pages/home/publish/publish.component';
import { PublicationViewComponent } from './pages/knowledge-hub/publication-view/publication-view.component';
import { VentureDashboardComponent } from './pages/partner/venture-dashboard/venture-dashboard.component';
import { DashboardComponent } from './pages/partner/venture-dashboard/dashboard/dashboard.component';
import { VenturesComponent } from './pages/partner/venture-dashboard/ventures/ventures.component';
import { OrdersComponent } from './pages/partner/venture-dashboard/orders/orders.component';
import { ReviewsComponent } from './pages/partner/venture-dashboard/reviews/reviews.component';
import { SettingsComponent } from './pages/partner/venture-dashboard/settings/settings.component';
import { TrackerComponent } from './pages/partner/venture-dashboard/tracker/tracker.component';
import { StoreManagerComponent } from './pages/store-manager/store-manager.component';
import { StoreManagerDashboardComponent } from './pages/store-manager/store-manager-dashboard/store-manager-dashboard.component';
import { StoreManagerVenturesComponent } from './pages/store-manager/store-manager-ventures/store-manager-ventures.component';
import { StoreManagerProductsComponent } from './pages/store-manager/store-manager-products/store-manager-products.component';
import { StoreManagerOrdersComponent } from './pages/store-manager/store-manager-orders/store-manager-orders.component';
import { StoreManagerSettingsComponent } from './pages/store-manager/store-manager-settings/store-manager-settings.component';
import { StoreManagerTrackerComponent } from './pages/store-manager/store-manager-tracker/store-manager-tracker.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { MainStoreComponent } from './pages/main-store/main-store.component';
import { ProductViewComponent } from './pages/main-store/product-view/product-view.component';
import { CartViewComponent } from './pages/main-store/cart-view/cart-view.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { GeneralProfileComponent } from './pages/profile/general-profile/general-profile.component';
import { NotificationsComponent } from './pages/widgets/notifications/notifications.component';


export const ngxDropTargetOptions: DropTargetOptions = {
  color: 'dropZoneColor',
  colorDrag: 'dropZoneColorDrag',
  colorDrop: 'dropZoneColorDrop',
  multiple: true,
  accept: [MineTypeEnum.Image]
};

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
    FeedDetailsComponent,
    PublishComponent,
    PublicationViewComponent,
    VentureDashboardComponent,
    DashboardComponent,
    VenturesComponent,
    OrdersComponent,
    ReviewsComponent,
    SettingsComponent,
    TrackerComponent,
    StoreManagerComponent,
    StoreManagerDashboardComponent,
    StoreManagerVenturesComponent,
    StoreManagerProductsComponent,
    StoreManagerOrdersComponent,
    StoreManagerSettingsComponent,
    StoreManagerTrackerComponent,
    NoAccessComponent,
    MainStoreComponent,
    ProductViewComponent,
    CartViewComponent,
    SearchResultComponent,
    GeneralProfileComponent,
    NotificationsComponent,
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
      timeOut: 6000
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
     OrderModule,
     NgChatModule,
     SnotifyModule,
     CKEditorModule,
     EmbedVideo,
     InputSearchModule,
     NgxPaginationModule,
     NgxDatatableModule,
     NgxUploadModule.forRoot(ngxDropTargetOptions),
     FilePickerModule,
     SweetAlert2Module.forRoot(),
     Angular4PaystackModule,
     NgxPrintModule,
     // CloudinaryModule.forRoot(Cloudinary, environment.cloudinary)
  ],

  exports : [
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService,
        BaseService,
        IndustryResolve,
        SingleIndustryResolve,
        ProfileEditResolve,
        MentorProfileResolve,
        VentureResolve,
        BusinessResolve,
        SingleVentureResolve,
        SingleFeedResolve,
        PublicationResolve,
        SinglePublicationResolve,
        MainStoreResolve,
        SingleProfileResolve
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
