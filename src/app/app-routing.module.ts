import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FeedsComponent } from './feeds/feeds.component';
import { IndustryComponent } from './industry/industry.component';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MentorComponent } from './mentor/mentor.component';
import { MessageComponent } from './message/message.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { VentureHubComponent } from './venture-hub/venture-hub.component';
import { KnowledgeHubComponent } from './knowledge-hub/knowledge-hub.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';




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
