import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { IndustryComponent } from './components/industry/industry.component';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MentorComponent } from './components/mentor/mentor.component';
import { MessageComponent } from './components/message/message.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { VentureHubComponent } from './components/venture-hub/venture-hub.component';
import { KnowledgeHubComponent } from './components/knowledge-hub/knowledge-hub.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';




const routes: Routes = [
{path: '', component: FeedsComponent, canActivate : [AuthGuard] },

{path: 'industry', component: IndustryComponent, canActivate : [AuthGuard] },

{path: 'profile', component: ProfileComponent, canActivate : [AuthGuard] },

{path: 'mentor', component: MentorComponent, canActivate : [AuthGuard] },

{path: 'messages', component: MessageComponent, canActivate : [AuthGuard] },

{path: 'edit-profile', component: ProfileEditComponent, canActivate : [AuthGuard] },

{path: 'knowledge-hub', component: KnowledgeHubComponent, canActivate : [AuthGuard] },

{path: 'venture-hub', component: VentureHubComponent, canActivate : [AuthGuard] },


{path: 'forgot-password', component: ForgotPasswordComponent },
{path: 'reset-password', component: ResetPasswordComponent },
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},

// otherwise redirect to home
{ path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
