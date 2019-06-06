import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Typing } from '../_models/typing';
import { BaseService } from './base.service';
import Pusher from 'pusher-js';

@Injectable({
	providedIn: 'root'
})
export class TypingService {
	private subject: Subject<Typing> = new Subject<Typing>();
	private localFeeds: Observable<Typing[]>;
	private pusherClient: Pusher;

	constructor(private baseService : BaseService) { 

		this.pusherClient = new Pusher('6085b4683ce0a0859c61', { cluster: 'eu' });

		const channel = this.pusherClient.subscribe('single-chat');

		channel.bind(
			'typing',
			(data: {
				sender_id : number,
				receiver_id: any, 
				message: string,
				isTyping:boolean }) => {
				this.subject.next(new Typing(
					data.sender_id,
					data.receiver_id,
					data.message,
					data.isTyping
				));
			});
	}

	getTypingState(): Observable<Typing> {
		return this.subject.asObservable();
	}
}
