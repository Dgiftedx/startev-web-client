import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../_models';
import * as _ from 'lodash';
import { AuthenticationService } from './authentication.service';


@Injectable({
	providedIn: 'root'
})
export class BaseService {

    private querySource: BehaviorSubject<any> = new BehaviorSubject('');
    currentSearchQuery = this.querySource.asObservable();

    public liveSessions$: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        private http: HttpClient,
        private authenticationService : AuthenticationService) { }


    //get emdpoints
    endpoint = this.authenticationService.endpoint;
    endPointAuth = this.authenticationService.endPointAuth;

    //set a new query parameter
    changeQuery(query:string):void {
        this.querySource.next(query);
    }


    public getSearchResults( query:any ){
        return this.http.post(`${this.endpoint}/get-search-results`, query);
    }

    //Algorithm to show user Job title
    echoJobTitle(roleData: any, role: string){
        if (role === 'student' || role === 'graduate') {

            if (roleData.institution) {
                return roleData.institution;
            }else{
                return '';
            }
        }

        if (role === 'mentor') {

            if ( _.size(roleData.current_job_position) > 0 && _.size(roleData.organization) > 0 ) {
                return roleData.current_job_position + " at " + roleData.organization;
            }else{

                if (_.size(roleData.curent_job_position)) {
                    return roleData.current_job_position;
                }else if(_.size(roleData.organization)){
                    return roleData.organization;
                }else{
                    return "";
                }
            }
        }

        if (role === 'business') {
            if (roleData.name) {
                return roleData.name;
            }else{
                return "";
            }
        }
    }

    //====================== Broadcast =============================//
    public broadcastSchedules( user_id: number ){
        return this.http.get(`${this.endpoint}/get-broadcast-schedules/${user_id}`);
    }

    public getTrainees( user_id: number ){
        return this.http.get(`${this.endpoint}/get-mentor-trainees/${user_id}`);
    }

    public updateSchedule( formData:any, url:string ){
        return this.http.post(`${this.endpoint}/${url}`, formData);
    }

    public deleteSchedule(schedule_id:number) {
        return this.http.get(`${this.endpoint}/delete-schedule/${schedule_id}`);
    }

    public sendNotice( formData:any ){
        return this.http.post(`${this.endpoint}/send-schedule-notice`, formData);
    }

    public clearBroadcastSchedules( user_id:any ){
        return this.http.get(`${this.endpoint}/clear-broadcast-schedules/${user_id}`);
    }

    public fetchParticipants( schedule_id:any ){
        return this.http.get(`${this.endpoint}/fetch-schedule-participants/${schedule_id}`);
    }

    public logLiveSession( formData:any ){
        return this.http.post(`${this.endpoint}/log-live-session`, formData);
    }

    public removeLiveSession( formData:any ){
        return this.http.post(`${this.endpoint}/remove-live-session`, formData);
    }

    public getLiveSessions( user_id:any ){
        this.http.get(`${this.endpoint}/get-live-sessions/${user_id}`)
        .subscribe(data => {
            this.liveSessions$.next(data);
        })
    }

    public getUpcomingMeeting( user_id:any ){
        return this.http.get(`${this.endpoint}/get-upcoming-meetings/${user_id}`);
    }


    public getLocalBroadcastMessage(){
        return this.http.get(`${this.endpoint}/get-broadcast-messages`);
    }

    public removeBroadcastMessage(schedule_id:number){
        return this.http.get(`${this.endpoint}/remove-broadcast-messages/${schedule_id}`);
    }

    //======================= Messaging ============================//
    public getUserContactList( user_id: number ){
        return this.http.get(`${this.endpoint}/get-user-contact-list/${user_id}`);
    }

    public addToContact(formData:any){
        return this.http.post(`${this.endpoint}/add-to-contact-list`, formData);
    }

    public removeFromContact(formData:any){
        return this.http.post(`${this.endpoint}/remove-from-contact-list`, formData);
    }

    public markMessagesAsRead(formData:any){
        return this.http.post(`${this.endpoint}/mark-messages-as-read`, formData);
    }

    public getOpenApiFeed(id:number){
        return this.http.get(`${this.endpoint}/open-api-get-feed/${id}`);
    }

    public markAllAsRead(id:number){
        return this.http.get(`${this.endpoint}/mark-all-notifications-as-read/${id}`);
    }

    public generateCode(formData: any){
        return this.http.post<any>(`${this.endpoint}/generate-code`, formData);
    }

    public sendVerDoc(formData: any){
        return this.http.post<any>(`${this.endpoint}/submit-verification`, formData);
    }

    public fetchIndustries(){
        return this.http.get(`${this.endpoint}/industries`);
    }

    public fetchAllIndustries(){
        return this.http.get(`${this.endpoint}/all-industries`);
    }


    public getSingleIndustry(slug : any){
        return this.http.get(`${this.endpoint}/single-industry/${slug}`);
    }

    public fetchUserProfile(){
        return this.http.get(`${this.endpoint}/get-profile`);
    }

    public fetchTopProfiles(){
        return this.http.get(`${this.endpoint}/get-top-profiles`);
    }

    public fetchFeaturedMentors(){
        return this.http.get(`${this.endpoint}/get-featured-mentors`);
    }

    public fetchNewSignup(){
        return this.http.get(`${this.endpoint}/get-new-sign-ups`);
    }

    public fetchPublicationCat(){
        return this.http.get(`${this.endpoint}/get-pub-cat`);
    }

    public fetchSuggestions( user_id:number ){
        return this.http.get(`${this.endpoint}/get-suggestions/${user_id}`);
    }

    public fetchMyFeeds( user_id:number ){
        return this.http.get(`${this.endpoint}/get-my-feeds/${user_id}`);
    }


    public increaseFeedView(feed_id:number){
        return this.http.get(`${this.endpoint}/increase-feed-view/${feed_id}`);
    }

    public fetchMyPublications( user_id:number ){
        return this.http.get(`${this.endpoint}/get-my-publications/${user_id}`);
    }

    public fetchMyPartners( user_id:number ){
        return this.http.get(`${this.endpoint}/get-my-partners/${user_id}`);
    }

    public fetchBusinessPartners( user_id:number ){
        return this.http.get(`${this.endpoint}/get-business-partners/${user_id}`);
    }

    public fetchHubMaterials( url:string ){
        return this.http.get(`${this.endpoint}/get-hub-materials${url}`);
    }

    public removeHeaderImage(user_id:number) {
        return this.http.get(`${this.endpoint}/remove-header-image/${user_id}`);   
    }


    public fetchGeneralProfile( slug:string ){
        return this.http.get(`${this.endpoint}/get-general-profile/${slug}`).pipe(delay(500));
    }


    public fetchCountries(){
        return this.http.get(`${this.endpoint}/countries`);
    }

    public getStates(id : any){
        return this.http.get(`${this.endpoint}/states/${id}`);
    }


    public getCities(id : any){
        return this.http.get(`${this.endpoint}/cities/${id}`);
    }

    // Register a new user
    public updateUserData(formData: any, url : string, id : number){
        return this.http.post<any>(`${this.endpoint}/${url}/${id}`, formData);
    }

    public searchVentures(formData: any){
        return this.http.post<any>(`${this.endpoint}/search-ventures`, formData);
    }

    public fetchCareerPaths(){
        return this.http.get(`${this.endpoint}/career-paths`);
    }

    public updateImage(imageData: any, id: number) {
        return this.http.post<any>(`${this.endpoint}/update-user-avatar/${id}`, imageData);
    }

    public updateHeaderImage(imageData: any, id: number){
        let formData = new FormData();
        formData.append('image', imageData);
        return this.http.post<any>(`${this.endpoint}/update-user-header-image/${id}`, formData);
    }


    public promiseAllIndustries(){
        return this.http.get(`${this.endpoint}/all-industries`).pipe(delay(500));
    }

    public promiseSingleIndustry(slug: any){
        return this.http.get(`${this.endpoint}/single-industry/${slug}`).pipe(delay(500));
    }


    public promiseUserProfile(){
        return this.http.get(`${this.endpoint}/get-profile`).pipe(delay(500));
    }

    public promiseMentorProfile(slug : any){
        return this.http.get(`${this.endpoint}/single-mentor-profile/${slug}`).pipe(delay(500));
    }

    public getFeeds(page:any){
        if (page) {
            return this.http.get(`${this.endpoint}/get-feeds?page=${page}`);
        }

        return this.http.get(`${this.endpoint}/get-feeds`);
    }

    public getPeople(){
    	return this.http.get(`${this.endpoint}/get-people`);
    }

    public follow(userId: number, target_id : number){
    	return this.http.get(`${this.endpoint}/follow/${userId}/${target_id}`);
    }


    //User follows another another user on user's profile page
    public toggleFollow(userId: number, target_id : number){
    	return this.http.get(`${this.endpoint}/toggle-follow/${userId}/${target_id}`);
    }

    public allVentures(){
    	return this.http.get(`${this.endpoint}/all-ventures`).pipe(delay(500));
    }

    public allBusiness(){
    	return this.http.get(`${this.endpoint}/all-business`).pipe(delay(500));
    }

    public businessVentures(id: number){
        return this.http.get(`${this.endpoint}/business-ventures/${id}`);
    }

    public ventureByBusiness(id: number){
        return this.http.get(`${this.endpoint}/venture-by-business/${id}`);
    }

    // Register a new user
    public updateVenture(formData: any, url : string){
        return this.http.post<any>(`${this.endpoint}/${url}`, formData);
    }

    public removeVenture(business_id: number, id: number){
    	return this.http.get(`${this.endpoint}/remove-venture/${business_id}/${id}`);
    }

    public singleVenture(identifier: any){
        return this.http.get(`${this.endpoint}/single-venture/${identifier}`).pipe(delay(500));
    }

    public applyToPartner(id : number, user_id: number, url : string) {
        return this.http.get(`${this.endpoint}/${url}/${id}/${user_id}`);
    }

    //User Likes & Un-like reaction on feeds 
    public toggleLike(userId: number, target_id : number){
    	return this.http.get(`${this.endpoint}/toggle-like/${userId}/${target_id}`);
    }

    //Post User comments on feeds 
    public postComment(userId: number, comment : any){
    	return this.http.post<any>(`${this.endpoint}/post-comment/${userId}`, comment);
    }

    //Get single feed data
    public singleFeed(feed_id: any){
        return this.http.get(`${this.endpoint}/single-feed/${feed_id}`).pipe(delay(500));
    }

    public FeedManageAction(formData: any, url:string){
        return this.http.post<any>(`${this.endpoint}/${url}`, formData);
    }

    //Publish publication
    public publishPublication(formData: any){
        return this.http.post<any>(`${this.endpoint}/publish-publication`, formData);
    }

    //Publish publication
    public updatePublication(formData: any, pub_id:number){
        return this.http.post<any>(`${this.endpoint}/update-publication/${pub_id}`, formData);
    }

    //Delete publication from knowledge Hub
    public deletePublication( pub_id:number ){
        return this.http.get(`${this.endpoint}/delete-publication/${pub_id}`);
    }


    //Pull publications for knowledge Hub
    public getPublications(){
    	return this.http.get(`${this.endpoint}/get-publications`).pipe(delay(500));
    }


    //Publicaiton Likes & Un-like reaction
    public togglePublicationLike(userId: number, publication_id : number){
        return this.http.get(`${this.endpoint}/toggle-publication-like/${userId}/${publication_id}`);
    }

    //Get single feed data
    public singlePublication(publication_id: any){
        return this.http.get(`${this.endpoint}/single-publication/${publication_id}`).pipe(delay(500));
    }

    //Get help tips
    public getHelpTips(user_id:any){
        return this.http.get(`${this.endpoint}/get-help-tips/${user_id}`);
    }

    //Get Partners
    public getPartners(){
        return this.http.get(`${this.endpoint}/get-partners`);
    }

    //Connection toggle 
    public toggleConnection(userId: number, target_id : number){
        return this.http.get(`${this.endpoint}/toggle-connection/${userId}/${target_id}`);
    }


    //Nav Widget Notification
    public getWidgetNotifications(userId: number ){
        return this.http.get(`${this.endpoint}/get-widget-notifications/${userId}`);
    }

    //================================= Chat Service ====================================//
    public getContacts(user_id:number): Observable<any>{
        return this.http.get<any>(`${this.endpoint}/chat-get-contacts/${user_id}`);
    }

    public getMessages(user_id:number){
        return this.http.get(`${this.endpoint}/chat-get-messages/${user_id}`);
    }



    //================== Account Deletion ========================//
    //Get help tips
    public removeAccount(data:any){
        return this.http.post(`${this.endPointAuth}/remove-user-account`, data);
    }

}
