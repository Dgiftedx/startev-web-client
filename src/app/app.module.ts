import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { fakeBackendProvider } from './_helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatButtonModule, MatCheckboxModule, MatTabsModule} from '@angular/material';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#C90C0C',
  bgsPosition: "bottom-center",
  bgsSize: 40,
  fgsType: SPINNER.chasingDots, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbColor: "#C90C0C",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbThickness: 5, // progress bar thickness
};

import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { IndustryComponent } from './industry/industry.component';
import { FeedsComponent } from './feeds/feeds.component';
import { AlertComponent } from './alert/alert.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MentorComponent } from './mentor/mentor.component';
import { MessageComponent } from './message/message.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    IndustryComponent,
    FeedsComponent,
    AlertComponent,
    RegisterComponent,
    ProfileComponent,
    MentorComponent,
    MessageComponent,
    ProfileEditComponent
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
    VgBufferingModule
  ],

  exports : [
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
