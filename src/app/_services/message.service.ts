import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Message } from '../_models/message';
import { BaseService } from './base.service';
import Pusher from 'pusher-js';

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	private subject: Subject<Message> = new Subject<Message>();
	private pusherClient: Pusher;

	constructor(private baseService : BaseService) { 

		this.pusherClient = new Pusher('665a0aa142c9152d0cf0', { cluster: 'eu' });

		const channel = this.pusherClient.subscribe('messaging');

		channel.bind(
			'new-message',
			(data: {
				id : number,
				sender_id: number, 
				receiver_id: number, 
				conversation_id: number,
				messaging_group_id: number, 
				message: string; 
				file: string; 
				type: string,
				last_read: string,
				status: string,
				created_at: string,
				updated_at: string}) => {
				this.subject.next(new Message(
					data.id,
					data.sender_id,
					data.receiver_id,
					data.conversation_id,
					data.messaging_group_id,
					data.message,
					data.file,
					data.type,
					new Date(data.last_read),
					data.status,
					new Date(data.created_at),
					new Date(data.updated_at)));
			});
	}

	getMessagesItems(): Observable<Message> {
		return this.subject.asObservable();
	}
}
