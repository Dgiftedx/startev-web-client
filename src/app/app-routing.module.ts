import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FeedsComponent } from './feeds/feeds.component';
import { IndustryComponent } from './industry/industry.component';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
{path: '', component: FeedsComponent, canActivate : [AuthGuard] },

{path: 'industry', component: IndustryComponent, canActivate : [AuthGuard] },

{path: 'profile', component: ProfileComponent, canActivate : [AuthGuard] },

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
