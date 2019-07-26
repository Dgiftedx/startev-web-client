import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BroadcastMessage } from '../_models/broadcastMessage';
import { BaseService } from './base.service';
import Pusher from 'pusher-js';

@Injectable({
	providedIn: 'root'
})
export class BroadcastMessageService {
	private subject: Subject<BroadcastMessage> = new Subject<BroadcastMessage>();
	private localBrodcastNessage: Observable<BroadcastMessage[]>;
	private pusherClient: Pusher;

	constructor(private baseService : BaseService) { 

		this.pusherClient = new Pusher('665a0aa142c9152d0cf0', { cluster: 'eu' });

		const channel = this.pusherClient.subscribe('broadcast-channel');

		channel.bind(
			'chat-event',
			(data: {
				id : number,
				schedule_id: number, 
				user_avatar: string,
				user_name: string,
				message: string, 
				is_mentor: boolean; 
				created_at: string }) => {
				this.subject.next(new BroadcastMessage(
					data.id,
					data.schedule_id, 
					data.user_avatar,
					data.user_name,
					data.message, 
					data.is_mentor, 
					new Date()));
			});
	}

	public getBroadcastMessage(): Observable<BroadcastMessage> {
		return this.subject.asObservable();
	}

	public getLocalBroadcastMessage() {
		return this.baseService.getLocalBroadcastMessage();
	}
}
