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

		this.pusherClient = new Pusher('6085b4683ce0a0859c61', { cluster: 'eu' });

		const channel = this.pusherClient.subscribe('my-channel');

		channel.bind(
			'my-event',
			(data: {roleData: any, user: any, postType: string, title: string; body: string; time: string }) => {
				this.subject.next(new Feed(data.roleData, data.user, data.postType, data.title, data.body, new Date(data.time)));
			});
	}

	getFeedItems(): Observable<Feed> {
		return this.subject.asObservable();
	}

	getLocalFeeds() {
		return this.baseService.getFeeds();
	}
}
