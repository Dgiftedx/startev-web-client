import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FeedsComponent } from './feeds/feeds.component';
import { IndustryComponent } from './industry/industry.component';




const routes: Routes = [
	{
		path: 'feeds', component: FeedsComponent,
	},
	{
		path: 'industry', component: IndustryComponent,
	},
	{
        path: 'login', component: LoginComponent
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
