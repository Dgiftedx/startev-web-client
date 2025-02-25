declare var $: any;
import * as _ from 'lodash';
import { User, Typing, Message } from '../../../_models';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, interval} from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { switchMap, first, startWith, map} from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { MessageService } from '../../../_services/message.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService, TypingService} from '../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';

@Component({
  selector: 'app-message-conversations',
  templateUrl: './message-conversations.component.html',
  styleUrls: ['./message-conversations.component.css']
})
export class MessageConversationsComponent implements OnInit {
  	currentUser:User;

	public base_url = window.location.origin;
	public showEdit:boolean = false;
	public image: any = null;
	public isImage = false;
	public processedImage = '';
	public sendingForm:boolean = false;

	//===== Real Time Messaging Observable ======//
	public messages: Message[] = [];
	private messagingSubscription: Subscription;
	private localMessageSubscription: Subscription;

	public conversation: Array<any> = [];
	public navigation:Array<any> = [

	{id: 1, alias: "settings", name: "Settings", icon: "ti-panel"},
	{id: 2, alias: "all_friends", name: "Connections", icon: "ti-user"},
	{id: 3, alias: "recent_chat", name: "Recent Chat", icon: "ti-comment-alt"},
	];

	public selectedNav = this.navigation[2];

	//Observables
	public contacts$: Observable<any>;
	public messages$:any = [];

	public chatMessage:string = '';

	public typingState: Typing[] = [];
	public senderTyping:boolean = false;
	public activeChat:any = {};
	public settings:any = [];
	private settingSubscription:Subscription;
	private contactsSubscription:Subscription;
	private typingSubscription: Subscription;
  	constructor(
		private http : HttpClient,
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private typingService : TypingService,
		private messageService : MessageService,
		private alert: AlertService,
		private baseService : BaseService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		//Broadcast Typing events
		this.typingSubscription = typingService
		.getTypingState()
		.subscribe((typing: Typing) => {

			if (this.currentUser.id === typing.receiver_id) {
				this.typingState.push(typing);
			}

		});

		//First fetch local messages
		this.localMessageSubscription = baseService.getMessages(this.currentUser.id)
		.subscribe(data => {
			this.messages$ = data;

		});


		//Push cuccurrent messages
		this.messagingSubscription = messageService
		.getMessagesItems()
		.subscribe((message: Message) => {

			//push incoming global message to respective user
			this.messages$.forEach(item => {
				if ( item.id === message.receiver_id) {
					item.messages.unshift(message);
				}

				if (item.id === message.sender_id) {
					item.messages.unshift(message);
				}
			})

			//find active use and update conversation
			if (this.count(this.activeChat) > 0) {
				let search = _.findLast(this.messages$, ['id', this.activeChat.id]);

				if (search) {
					this.activeChat = search;
				}
			}

		});

	}

	ngOnInit() {

		this.getContacts();

		//First fetch local messages
		this.localMessageSubscription = this.baseService.getMessages(this.currentUser.id)
		.subscribe(data => {
			this.messages$ = data;

		});

		this.jQueryMethods();
	}

	
	//============= Trigger Post Composer =============//
	triggerNewChat(){
		$(document).find('#contactListModal').modal();
	}


	closeModal(element : any): void {
		$(document).find('#'+element).modal('hide');
	}

	updateScrollDirection() {
		$(".messages-line").mCustomScrollbar("scrollTo","bottom");
	}


	// ================= Get Contacts =================================//
	getContacts() {
		this.contacts$ = this.baseService.getContacts(this.currentUser.id);
	}


	// ================ Get Messages ===================================//

	getMessages() {
		//First fetch local messages
		this.localMessageSubscription = this.baseService.getMessages(this.currentUser.id)
		.subscribe(data => {
			this.messages$ = data;

		});
	}


	//==================== check if no messages ======================//

	checkLocalMessages(): boolean{
		return this.count(this.messages$) > 0 ?true:false;
	}


	//==================== fetchContact ===============================//
	fetchContact(contact_id:number){
		return _.findLast(this.messages$, ['id',contact_id]);
	}


	//==================== check if there is already existing conversation ======================//
	checkExistingConversation(contact_id:number) {
		if (!this.checkLocalMessages()) {
			return false;
		}

		//return if chat was found or not
		return typeof this.fetchContact(contact_id) ===  'undefined' ? false:true;
		
	}


	// ============ check null item and return default as required =======//
	checkValue(item:any,  type:string, nullValue:string) {
		if (type === 'text') {
			if (this.count(item) === 0) {
				return nullValue;
			}
			return item;
		}

		if (type === 'avatar') {

			if (this.count(item) === 0) {
				return '/assets/images/default/avatar.jpg';
			}
			return this.authenticationService.baseurl+item;
		}
	}

	//========================= create mockup ===============================//
	/**
	*
	* Create a mockup for the new chat if message is actually sent, log messge and call
	* call local messages method to fetch saved messaged.
	*/
	createMockup (contact:any) {
		contact.messages = [];
		return contact;
	}




	//===================== Set New chat ===============================//
	setNewChat(contact:any){
		//if no previous messages
		if (!this.checkExistingConversation(contact.id)) {
			//set current chat to a new mockup using user contact
			let currentChat = this.createMockup(contact);
			//push mockup to messages array and set it as current chat
			this.messages$.push(currentChat);
			this.activeChat = currentChat;
		}else{

			//if chat with this contact is found,
			//get user conversation and set it to current chat
			let currentChat = this.fetchContact(contact.id);
			this.activeChat = currentChat;
		}


		//switch view to recent chats.
		setTimeout(() => {
			this.closeModal("contactListModal");
		});

	}



	//================= Check Typing Event ===========================//
	checkTypingEvent(activeChat_id:number){
		let found = _.findLast(this.typingState, ['receiver_id', this.currentUser.id]);
		return (found && found.sender_id === activeChat_id && found.isTyping)?true:false;
	}


	toggleSideBar(){
		$('.messenger-navigation').toggleClass('active');	
	}
	
	// ================ Custom Plugin Section ============================//
	jQueryMethods(){
		$(".chat-hist, .messages-line").mCustomScrollbar();
		axis:"yx"
	}



	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}


	//================ Set Active Navigation  =====================//
	setNavigation(nav) {

		if (nav.id === 2) {
			this.getContacts();
		}

		this.selectedNav = nav;

		setTimeout(() => {
			this.jQueryMethods();
		},200);
	}


	//================ New Chat Button ===========================//
	newChat(window:string):void {
		
		if (window === 'discussion') {
			//go to contacts window to start a new chat
			this.setNavigation( this.navigation[1]);
		}
	}

	//============ Count unread messages ===============//
	countUnread(messages:any){
		let count = 0;

		messages.forEach((item:any) => {
			if (item.status === 'unread') {
				count += 1;
			}
		})

		return count;
	}


	//============== Mark messages as read ================//
	markRead(sender_id:number, receiver_id:number) {
		let data = {
			sender_id : sender_id,
			receiver_id : receiver_id
		};

		this.baseService.markMessagesAsRead(data)
		.subscribe(data => {
			this.getMessages();
		})
	}

	//=============== Chat window Contact Setter ===================//
	openChatWindow(contact:any) {
		this.activeChat = contact;
		//mark all active chat messages as read
		this.markRead(this.currentUser.id, this.activeChat.id);
	}

	//============== Typing Event =======================//
	typingEvent(event:any, receiver_id: number ) {

		let message = "Typing...";

		let data = {
			sender_id : this.currentUser.id,
			receiver_id : receiver_id,
			message : message,
			isTyping: true
		};

		this.http
		.post(`${this.authenticationService.endpoint}/send-typing-event`, data)
		.toPromise()
		.then((data: { message: string; status: boolean }) => {
			//
		})
		.catch(error => {
			//
		});
	}


	stopTypingEvent(event:any, receiver_id:number){
		let message = "Stopped typing...";

		let data = {
			sender_id : this.currentUser.id,
			receiver_id : receiver_id,
			message : message,
			isTyping: false
		};

		this.http
		.post(`${this.authenticationService.endpoint}/send-typing-event`, data)
		.toPromise()
		.then((data: { message: string; status: boolean }) => {
			//
		})
		.catch(error => {
			//
		});
	}



	sortContact(contact_id:number) {
		return _.findLast(this.contacts$, ['id', contact_id]);
	}


	//////////////////////////////////////////////////////////
	checkConversation(activeChat){
		let search = _.findLast(this.conversation, ['receiver_id', activeChat.id]);

		if (!search) {
			return this.newConversationPlate(activeChat);
		}
	}


	newConversationPlate(user){
		return  {
			user: user,
			messages: [],
		}
	}


	//================= send Message =====================//

	sendMessage(activeChat:any) {

		let payload:any = {
			sender_id: this.currentUser.id,
			receiver_id: activeChat.id,
			message: this.chatMessage,
			type: 'text'
		};

		if (activeChat.status === 'online') {
			payload.status = 'read';
		}

		this.chatMessage = '';


		this.http
		.post(`${this.authenticationService.endpoint}/send-message`, payload)
		.toPromise()
		.then((data: { message: string; status: boolean }) => {
			//message sent
			this.updateScrollDirection();
		})
		.catch(error => {
			//
		});


		this.setNavigation(this.navigation[2]);

	}

}
