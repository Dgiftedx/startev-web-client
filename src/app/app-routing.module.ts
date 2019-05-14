import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/authentication/login/login.component';
import { FeedsComponent } from './pages/home/feeds/feeds.component';
import { IndustryListComponent } from './pages/industries/industry-list/industry-list.component';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { ProfileComponent } from './pages/profile/main-profile/profile.component';
import { MentorComponent } from './pages/mentors/mentor-list/mentor.component';
import { MessageComponent } from './pages/message/message.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { VentureHubComponent } from './pages/venture-hub/venture-hub.component';
import { KnowledgeHubComponent } from './pages/knowledge-hub/knowledge-hub.component';
import { ResetPasswordComponent } from './pages/password/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/password/forgot-password/forgot-password.component';
import { IndustryDetailsComponent } from './pages/industries/industry-details/industry-details.component';




const routes: Routes = [
{
	path: '', 
	component: FeedsComponent, 
	data : {animation: 'Feeds'},
	canActivate : [AuthGuard] },

{
	path: 'industry', 
	component: IndustryListComponent,
	data: {animation: 'Industries'}, 
	canActivate : [AuthGuard] },

{
	path: 'industry/:slug', 
	component: IndustryDetailsComponent,
	canActivate : [AuthGuard] 
},

{path: 'profile', component: ProfileComponent, canActivate : [AuthGuard] },

{path: 'mentor', component: MentorComponent, canActivate : [AuthGuard] },

{path: 'messages', component: MessageComponent, canActivate : [AuthGuard] },

{path: 'edit-profile', component: ProfileEditComponent, canActivate : [AuthGuard] },

{
	path: 'knowledge-hub', 
	component: KnowledgeHubComponent,
	data: {animation: 'All'}, 
	canActivate : [AuthGuard] },

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
