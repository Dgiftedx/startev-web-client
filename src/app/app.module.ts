import { QuillModule } from 'ngx-quill'
import { NgChatModule } from 'ng-chat';
import { NgxAdDfpModule} from 'ngx-ad-dfp';
import { NgxPrintModule} from 'ngx-print';
import { BaseService } from './_services';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { BlockUIModule } from 'ng-block-ui';
import { OrderModule } from 'ngx-order-pipe';
import { CKEditorModule } from 'ngx-ckeditor';
import { LaddaModule } from  'angular7-ladda';
import { AppComponent } from './app.component';
import * as  Cloudinary from 'cloudinary-core';
import { LightboxModule } from 'ngx-lightbox';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { NgxPaginationModule} from 'ngx-pagination';
import { InputSearchModule } from 'ngx-input-search';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateAgoPipe } from './_filters/date-ago.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AppRoutingModule } from './app-routing.module';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { FilePickerModule } from  'ngx-awesome-uploader';
import { ExcerptFilter } from './_filters/excerpt.filter';
import { environment } from '../environments/environment';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainStoreResolve } from './_resolvers/store.resolver';
import { VentureResolve } from './_resolvers/venture.resolver';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxEpicVideoPlayerModule } from 'ngx-epic-video-player';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, Injectable} from '@angular/core';
import { BusinessResolve } from './_resolvers/business.resolver';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SingleFeedResolve } from './_resolvers/single-feed.resolver';
import { PublicationResolve } from './_resolvers/publications.resolver';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MentorProfileResolve } from './_resolvers/mentor-profile.resolver';
import { SingleVentureResolve } from './_resolvers/single-venture.resolver';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUploadModule, MineTypeEnum, DropTargetOptions} from '@wkoza/ngx-upload';
import { IndustryResolve, SingleIndustryResolve, ProfileEditResolve } from './_resolvers';
import { OpenSingleFeedResolve } from './_resolvers/open-single-feed.resolver';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SingleProfileResolve } from './_resolvers/single-profile.resolver';
import { SinglePublicationResolve } from './_resolvers/single-publication.resolver';

import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

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
import { MentorProfileComponent } from './pages/mentors/mentor-profile/mentor-profile.component';
import { PartnerViewComponent } from './pages/partner/partner-view/partner-view.component';
import { FeedDetailsComponent } from './pages/home/feed-details/feed-details.component';
import { PublishComponent } from './pages/home/publish/publish.component';
import { PublicationViewComponent } from './pages/knowledge-hub/publication-view/publication-view.component';
import { VentureDashboardComponent } from './pages/partner/venture-dashboard/venture-dashboard.component';
import { VenturesComponent } from './pages/partner/venture-dashboard/ventures/ventures.component';
import { ReviewsComponent } from './pages/partner/venture-dashboard/reviews/reviews.component';
import { SettingsComponent } from './pages/partner/venture-dashboard/settings/settings.component';
import { TrackerComponent } from './pages/partner/venture-dashboard/tracker/tracker.component';
import { StoreManagerComponent } from './pages/store-manager/store-manager.component';
import { StoreManagerVenturesComponent } from './pages/store-manager/store-manager-ventures/store-manager-ventures.component';
import { StoreManagerSettingsComponent } from './pages/store-manager/store-manager-settings/store-manager-settings.component';
import { StoreManagerTrackerComponent } from './pages/store-manager/store-manager-tracker/store-manager-tracker.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { MainStoreComponent } from './pages/main-store/main-store.component';
import { ProductViewComponent } from './pages/main-store/product-view/product-view.component';
import { CartViewComponent } from './pages/main-store/cart-view/cart-view.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { GeneralProfileComponent } from './pages/profile/general-profile/general-profile.component';
import { NotificationsComponent } from './pages/widgets/notifications/notifications.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { SuggestionsWidgetComponent } from './pages/widgets/suggestions-widget/suggestions-widget.component';
import { AdsWidgetComponent } from './pages/widgets/ads-widget/ads-widget.component';
import { MentorsWidgetComponent } from './pages/widgets/mentors-widget/mentors-widget.component';
import { SignUpsWidgetComponent } from './pages/widgets/sign-ups-widget/sign-ups-widget.component';
import { FooterWidgetComponent } from './pages/widgets/footer-widget/footer-widget.component';
import { KnowledgeHubCareersComponent } from './pages/knowledge-hub/knowledge-hub-careers/knowledge-hub-careers.component';
import { KnowledgeHubCareerDevComponent } from './pages/knowledge-hub/knowledge-hub-career-dev/knowledge-hub-career-dev.component';
import { KnowledgeHubGeneralKnowledgeComponent } from './pages/knowledge-hub/knowledge-hub-general-knowledge/knowledge-hub-general-knowledge.component';
import { KnowledgeHubBusinessManagementComponent } from './pages/knowledge-hub/knowledge-hub-business-management/knowledge-hub-business-management.component';
import { MyPublicationsComponent } from './pages/my-publications/my-publications.component';
import { UserManageProductsComponent } from './pages/partner/venture-dashboard/user-manage-products/user-manage-products.component';
import { CareerFieldsComponent } from './pages/widgets/career-fields/career-fields.component';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { OpenFeedComponent } from './pages/open-feed/open-feed.component';
import { MessageConversationsComponent } from './pages/message/message-conversations/message-conversations.component';
import { MessageLiveBroadcastComponent } from './pages/message/message-live-broadcast/message-live-broadcast.component';
import { MessageChatGroupsComponent } from './pages/message/message-chat-groups/message-chat-groups.component';
import { MessageChatRoomsComponent } from './pages/message/message-chat-rooms/message-chat-rooms.component';
import { MessageContactListComponent } from './pages/message/message-contact-list/message-contact-list.component';
import { MessageBroadcastScheduleComponent } from './pages/message/message-broadcast-schedule/message-broadcast-schedule.component';
import { FooterWidgetTwoComponent } from './pages/widgets/footer-widget-two/footer-widget-two.component';

import { OverlayModule } from "@angular/cdk/overlay";
import { VideoUploadService } from './_services/video-upload.service';
import { BroadcastMessageService } from './_services/broadcast-message.service';
import { Routes, RouterModule } from '@angular/router';
import {
    SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider,
    AuthService
} from 'angularx-social-login';
//Owl NG
import { OwlFormFieldModule, 
    OwlSelectModule, 
    OwlTooltipModule, 
    OwlBadgeModule, 
    OwlDialogModule,
    OwlRadioModule,
    OwlTabsModule,OwlCheckBoxModule } from 'owl-ng';

import { NgxAgoraModule } from 'ngx-agora';
import { JoinLiveSessionComponent } from './pages/message/join-live-session/join-live-session.component';
import { ChatConversationsComponent } from './pages/message/chat-conversations/chat-conversations.component';
import { TransactionsComponent } from './pages/partner/venture-dashboard/transactions/transactions.component';
import { AdsWidgetLeftComponent } from './pages/widgets/ads-widget-left/ads-widget-left.component';
import { BusinessPartnersComponent } from './pages/partnership/business-partners/business-partners.component';
import { StoreManagerSettlementsComponent } from './pages/store-manager/store-manager-settlements/store-manager-settlements.component';

export const ngxDropTargetOptions: DropTargetOptions = {
  color: 'dropZoneColor',
  colorDrag: 'dropZoneColorDrag',
  colorDrop: 'dropZoneColorDrop',
  multiple: true,
  accept: [MineTypeEnum.Image]
};


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#4596c8',
  bgsPosition: "bottom-center",
  bgsSize: 40,
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbColor: "#0073B1",
  overlayColor: "rgba(255,255,255, 1)",
  pbThickness: 5, // progress bar thickness
};

    const google_client_id="1035515922151-963toms6214ehn55d0irlp1dqae20hoh.apps.googleusercontent.com";
    const facebook_client_id="2604297676515213";
    let googleConfig = new AuthServiceConfig([
        {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("google_client_id,")
        },
        {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('facebook_client_id')
        }
    ]);



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
    MentorProfileComponent,
    PartnerViewComponent,
    FeedDetailsComponent,
    PublishComponent,
    PublicationViewComponent,
    VentureDashboardComponent,
    VenturesComponent,
    ReviewsComponent,
    SettingsComponent,
    TrackerComponent,
    StoreManagerComponent,
    StoreManagerVenturesComponent,
    StoreManagerSettingsComponent,
    StoreManagerTrackerComponent,
    NoAccessComponent,
    MainStoreComponent,
    ProductViewComponent,
    CartViewComponent,
    SearchResultComponent,
    GeneralProfileComponent,
    NotificationsComponent,
    LandingComponent,
    ConfirmEmailComponent,
    SuggestionsWidgetComponent,
    AdsWidgetComponent,
    MentorsWidgetComponent,
    SignUpsWidgetComponent,
    FooterWidgetComponent,
    KnowledgeHubCareersComponent,
    KnowledgeHubCareerDevComponent,
    KnowledgeHubGeneralKnowledgeComponent,
    KnowledgeHubBusinessManagementComponent,
    MyPublicationsComponent,
    UserManageProductsComponent,
    CareerFieldsComponent,
    OpenFeedComponent,
    MessageConversationsComponent,
    MessageLiveBroadcastComponent,
    MessageChatGroupsComponent,
    MessageChatRoomsComponent,
    MessageContactListComponent,
    MessageBroadcastScheduleComponent,
    FooterWidgetTwoComponent,
    JoinLiveSessionComponent,
    ChatConversationsComponent,
    TransactionsComponent,
    AdsWidgetLeftComponent,
    BusinessPartnersComponent,
    StoreManagerSettlementsComponent,
  ],
  schemas : [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    SocialLoginModule.initialize(googleConfig),
    AppRoutingModule,
    // RouterModule.forRoot(appRoutes, ),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
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
    AutocompleteLibModule,
    BlockUIModule.forRoot(),
    NgxUiLoaderModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderRouterModule.forRoot({ showForeground: true }),
     OwlDateTimeModule,
     OwlNativeDateTimeModule,
     ImageCropperModule,
     FontAwesomeModule,
     OrderModule,
     NgChatModule,
     SnotifyModule,
     CKEditorModule,
     InputSearchModule,
     NgxPaginationModule,
     NgxDatatableModule,
     NgxUploadModule.forRoot(ngxDropTargetOptions),
     FilePickerModule,
     SweetAlert2Module.forRoot(),
     Angular4PaystackModule,
     NgxPrintModule,
     NgxLinkifyjsModule.forRoot(),
     LightboxModule,
     SlickCarouselModule,
     FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
     AngularEditorModule,
     QuillModule.forRoot(),
     InfiniteScrollModule,
     ShareButtonsModule,
     NgxAdDfpModule,
     // CloudinaryModule.forRoot(Cloudinary, environment.cloudinary)
     OwlFormFieldModule,
     OwlSelectModule,
     OwlTooltipModule,
     OwlBadgeModule,
     OwlDialogModule,
     OwlTabsModule,
     OwlCheckBoxModule,
     OwlRadioModule,
     NgxAgoraModule.forRoot({ AppID: '8658c3ff39b7418d9df4e3f15915d7e6' }),
     NgxEpicVideoPlayerModule,
     OverlayModule
  ],

  providers: [
        DatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults},

        OwlSelectModule,
        OverlayModule,
        SnotifyService,
        BaseService,
        VideoUploadService,
        BroadcastMessageService,
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
        SingleProfileResolve,
        OpenSingleFeedResolve,

     // GoogleLoginProvider,
     //  FacebookLoginProvider,
     //  AuthService,
     //  {
     //      provide: AuthServiceConfig,
     //       useFactory: provideConfig,
     //  }

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
