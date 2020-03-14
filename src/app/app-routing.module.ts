import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/authentication/login/login.component';
import { FeedsComponent } from './pages/home/feeds/feeds.component';
import { IndustryListComponent } from './pages/industries/industry-list/industry-list.component';
import { AuthGuard } from './_guards';
import { MainStoreComponent } from './pages/main-store/main-store.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { ProfileComponent } from './pages/profile/main-profile/profile.component';
import { MentorComponent } from './pages/mentors/mentor-list/mentor.component';
import { MentorProfileComponent } from './pages/mentors/mentor-profile/mentor-profile.component';
import { MessageComponent } from './pages/message/message.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { VentureHubComponent } from './pages/venture-hub/venture-hub.component';
import { KnowledgeHubComponent } from './pages/knowledge-hub/knowledge-hub.component';
import { ResetPasswordComponent } from './pages/password/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/password/forgot-password/forgot-password.component';
import { IndustryDetailsComponent } from './pages/industries/industry-details/industry-details.component';
import { PartnerViewComponent } from './pages/partner/partner-view/partner-view.component';
import { FeedDetailsComponent } from './pages/home/feed-details/feed-details.component';
import { PublishComponent } from './pages/home/publish/publish.component';
import { IndustryResolve, SingleIndustryResolve, ProfileEditResolve } from './_resolvers';
import { MentorProfileResolve } from './_resolvers/mentor-profile.resolver';
import { VentureResolve } from './_resolvers/venture.resolver';
import { BusinessResolve } from './_resolvers/business.resolver';
import { MainStoreResolve } from './_resolvers/store.resolver';
import { SingleVentureResolve } from './_resolvers/single-venture.resolver';
import { SingleFeedResolve } from './_resolvers/single-feed.resolver';
import { OpenSingleFeedResolve } from './_resolvers/open-single-feed.resolver';
import { PublicationResolve } from './_resolvers/publications.resolver';
import { SingleProfileResolve } from './_resolvers/single-profile.resolver';
import { SinglePublicationResolve } from './_resolvers/single-publication.resolver';
import { StoreManagerComponent } from './pages/store-manager/store-manager.component';
import { CartViewComponent } from './pages/main-store/cart-view/cart-view.component';
import { VenturesComponent } from './pages/partner/venture-dashboard/ventures/ventures.component';
import { ReviewsComponent } from './pages/partner/venture-dashboard/reviews/reviews.component';
import { PublicationViewComponent } from './pages/knowledge-hub/publication-view/publication-view.component';
import { VentureDashboardComponent } from './pages/partner/venture-dashboard/venture-dashboard.component';
import { ProductViewComponent } from './pages/main-store/product-view/product-view.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { GeneralProfileComponent } from './pages/profile/general-profile/general-profile.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { MyPublicationsComponent } from './pages/my-publications/my-publications.component';
import { OpenFeedComponent } from './pages/open-feed/open-feed.component';
import { StoreManagerVenturesComponent } from './pages/store-manager/store-manager-ventures/store-manager-ventures.component';
import { BusinessPartnersComponent } from './pages/partnership/business-partners/business-partners.component';


const routes: Routes = [
{
	path: '', 
	component: FeedsComponent, 
	resolve: {
		profile: ProfileEditResolve
	},
	canActivate : [AuthGuard] 
},
{
	path: 'feed/:id', 
	component: FeedDetailsComponent,
	resolve: {details: SingleFeedResolve},
	canActivate : [AuthGuard] 
},

{
	path: 'industry', 
	component: IndustryListComponent,
	resolve: {industries: IndustryResolve},
	canActivate : [AuthGuard] 
},

{
	path: 'industry/:slug', 
	component: IndustryDetailsComponent,
	resolve: {
		industries: IndustryResolve,
		industry : SingleIndustryResolve},
	canActivate : [AuthGuard]
},

{
	path: 'profile', 
	component: ProfileComponent,
	resolve: {
		profile: ProfileEditResolve
	},
	canActivate : [AuthGuard] },

	{
	path: 'general-profile/:slug', 
	component: GeneralProfileComponent,
	resolve: {
		profile: SingleProfileResolve
	},
	canActivate : [AuthGuard] },

{
	path: 'mentor/:slug', 
	component: MentorProfileComponent, 
	resolve: {mentor: MentorProfileResolve},
	canActivate : [AuthGuard] 
},

{
	path: 'messages', 
	component: MessageComponent, 
	canActivate : [AuthGuard] 
},

{
	path: 'edit-profile', 
	component: ProfileEditComponent,
	resolve: {
		industries: IndustryResolve,
		profile: ProfileEditResolve
	},
	canActivate : [AuthGuard] },

{
	path: 'knowledge-hub', 
	component: KnowledgeHubComponent,
	resolve: {pub: PublicationResolve},
	canActivate : [AuthGuard]
},
{
	path: 'publication-view/:id', 
	component: PublicationViewComponent,
	resolve: {publicationView: SinglePublicationResolve},
	canActivate : [AuthGuard]
},
{
	path: 'my-publications',
	component: MyPublicationsComponent,
	canActivate : [AuthGuard]
},

{
	path: 'venture-hub', 
	component: VentureHubComponent,
	resolve: {
		ventures : VentureResolve,
		business: BusinessResolve
	},
	canActivate : [AuthGuard]
},

{
	path: 'partner-view/:identifier', 
	component: PartnerViewComponent,
	resolve: {partnerView : SingleVentureResolve},
	canActivate : [AuthGuard]
},

{
	path: 'business-ventures',
	component: StoreManagerVenturesComponent,
	// data: {animation: 'All'},
	canActivate : [AuthGuard]
},
{
	path: 'business-partnerships',
	component: BusinessPartnersComponent,
	canActivate : [AuthGuard]
},

{
	path: 'venture-dashboard',
	component: VentureDashboardComponent,
	// data: {animation: 'All'},
	canActivate : [AuthGuard]
},

//Business Store Manager
{
	path: 'store-manager',
	component: StoreManagerComponent,
	// data: {animation: 'All'},
	canActivate : [AuthGuard]
},

{
	path: 'main-store/:identifier',
	component: MainStoreComponent,
	resolve: {store : MainStoreResolve},
	// data: {animation: 'All'},
},

{
	path: 'store/cart-view',
	component: CartViewComponent,
},

{
	path: 'product-view/:id',
	component: ProductViewComponent,
	// data: {animation: 'All'},
},
{
	path: 'search-result',
	component: SearchResultComponent,
	// data: {animation: 'All'},
	canActivate : [AuthGuard]
},

{path: 'open-feeds/:id', resolve : {feed : OpenSingleFeedResolve}, component: OpenFeedComponent},
{path: 'confirm-email', component: ConfirmEmailComponent },
{path: 'forgot-password', component: ForgotPasswordComponent },
{path: 'reset-password', component: ResetPasswordComponent },
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},

// otherwise redirect to home
{ path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
