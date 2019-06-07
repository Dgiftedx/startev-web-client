import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Feed } from '../_models/feed';
import { BaseService } from './base.service';
import Pusher from 'pusher-js';

@Injectable({
	providedIn: 'root'
})
export class FeedService {
	private subject: Subject<Feed> = new Subject<Feed>();
	private localFeeds: Observable<Feed[]>;
	private pusherClient: Pusher;

	constructor(private baseService : BaseService) { 

		this.pusherClient = new Pusher('665a0aa142c9152d0cf0', { cluster: 'eu' });

		const channel = this.pusherClient.subscribe('my-channel');

		channel.bind(
			'my-event',
			(data: {
				id : number,
				roleData: any, 
				user: any, 
				postType: string, 
				title: string; 
				body: string; 
				image: string,
				video: string,
				link: string,
				likers : any,
				comments:any,
				hasLiked : boolean,
				time: string }) => {
				this.subject.next(new Feed(
					data.id,
					data.roleData, 
					data.user, 
					data.postType, 
					data.title, 
					data.body,
					data.image,
					data.video,
					data.link,
					data.likers,
					data.hasLiked,
					data.comments,
					new Date(data.time)));
			});
	}

	getFeedItems(): Observable<Feed> {
		return this.subject.asObservable();
	}

	getLocalFeeds() {
		return this.baseService.getFeeds();
	}
}
