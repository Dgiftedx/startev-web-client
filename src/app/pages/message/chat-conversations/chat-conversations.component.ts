declare var $: any;
import * as _ from 'lodash';
import {Howl, Howler} from 'howler';
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
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Component({
	selector: 'app-chat-conversations',
	templateUrl: './chat-conversations.component.html',
	styleUrls: ['./chat-conversations.component.css']
})
export class ChatConversationsComponent implements OnInit {

	currentUser:User;
	remoteCalls: string[] = [];
	localCallId = 'agora_audio';
	private client: AgoraClient;
	private uid : number;
	private localStream: Stream;

	public base_url = window.location.origin;
	public showEdit:boolean = false;
	public image: any = null;
	public isImage = false;
	public processedImage = '';
	public sendingForm:boolean = false;
	public onAudioCall:boolean = false;
	public receiver:boolean = false;
	public pickedCall :boolean = false;
	private channelName : string = 'agora_audio_call';

	//===== Real Time Messaging Observable ======//
	public messages: Message[] = [];
	private messagingSubscription: Subscription;
	private localMessageSubscription: Subscription;

	public conversation: Array<any> = [];

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

	incomingCall : any = {};
	private interval : any;


	sound:any = new Howl({
		src: ['assets/sound/telephone.mp3'],
		loop: true
	});

	incomingSound:any = new Howl({
		src: ['assets/sound/outgoing.mp3'],
		loop: true
	});


	public thisHostAudioData : any = {};
	public monitorInterval : any;

	constructor(
		private http : HttpClient,
		private router: Router,
		private config: NgSelectConfig,
		private route: ActivatedRoute,
		private typingService : TypingService,
		private messageService : MessageService,
		private alert: AlertService,
		private ngxAgoraService: NgxAgoraService,
		private baseService : BaseService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.uid = Math.floor(Math.random() * 100);

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

		setTimeout(()=>{
			if ((this.count(this.activeChat) === 0) && (this.count(this.messages$) > 0)) {
				this.activeChat = this.messages$[0];
			}
		}, 1000);

		this.getIncomingCallSessions();

		this.baseService.audioSessions$.subscribe( data => {
			this.incomingCall = data;
			if (this.count(this.incomingCall) > 0) {
				setTimeout(() => {
					this.joinAudioCall();
				}, 1000);
			}else{

				if (this.receiver) {
					this.leaveAudioCall();
				}
			}
		});

		
		this.interval = setInterval(() => { 
			this.getIncomingCallSessions();
		}, 8000);


		this.baseService.audioHostSessions$.subscribe( data => {
			this.thisHostAudioData = data;
			if (this.count(this.thisHostAudioData) > 0) {
				//play call init sound
				if (this.count(this.messages$) > 0) {
					let search = _.findIndex(this.messages$, ['id', this.thisHostAudioData.target_user_id]);
					this.activeChat = this.messages$[search];
					this.initAudioCall(this.activeChat.id);
				}
				//perform actions
				if (this.thisHostAudioData.status === 'ended') {
					this.stopSoundOutGoing();
					// this.endCallMonitor();
					//at this point we might want to end this call for the host
					this.endAudioCall();
				}

				if (this.thisHostAudioData.status === 'picked') {
					this.stopSoundOutGoing();
					this.pickedCall = true;
					//don't stop monitor as host will be the last person to leave the stream
					//do other things
				}
			}else{
				this.stopSoundOutGoing();
				if (this.onAudioCall) {
					this.endAudioCall();
				}
			}
		});

		this.hostMonitorCall();
		this.monitorInterval = setInterval(() => { 
			this.hostMonitorCall();
		}, 8000);
		
	}

	joinAudioCall(){

		if (this.receiver) {
			//clear interval since call is shown and it's pending action
			// if (this.interval) {
				//        clearInterval(this.interval);
				//      };
				//to avoid calling this method twice
				return;
			}else{
				//set this call as active chat
				if ((this.count(this.incomingCall) > 0) && (this.count(this.messages$) > 0)) {
					let search = _.findIndex(this.messages$, ['id', this.incomingCall.host]);
					this.activeChat = this.messages$[search];

					this.playSoundIncoming();
					this.onAudioCall = true;
					this.receiver = true;

				}
			}

		}


		answerAudioCall(){
			this.client = this.ngxAgoraService.createClient({ mode: 'live', codec: 'h264' });
			this.assignClientHandlers();

			this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: false, screen: false });
			this.assignLocalStreamHandlers();
			// Join and publish methods added in this step
			this.initLocalStream(() => this.receiverJoin(uid => this.publish(), error => console.error(error)));
			
			this.baseService.pickAudioSession(this.incomingCall.id).
			subscribe((data:any) => {
				this.pickedCall = true;
				this.stopSoundIncoming();
				this.incomingCall.status = data.status;
			});

			return;
		}


		leaveAudioCall(){
			this.stopSoundIncoming();
			this.onAudioCall = false;
			this.receiver = false;
			this.pickedCall = false;

			//update audio session to rejected
			let data = {
				audio_session : this.incomingCall.id
			}

			//uodate database record
			this.baseService.seedIncomingCall(data, 'end-receiver-audio-session')
			.subscribe((data) => {
				this.incomingCall = data;
				//resume interval since current call has been ended
				this.interval = setInterval(() => { 
					this.getIncomingCallSessions();
				}, 8000);
			})
		}

		playSoundIncoming(){
			this.incomingSound.play();
		}

		stopSoundIncoming(){
			this.incomingSound.stop();
		}

		playSoundOutGoing(){
			// Play the sound.
			this.sound.play();
			// Howler.volume(0.5);
		}

		stopSoundOutGoing(){
			this.sound.stop();
		}

		initAudioCall(id:number){

			if (this.onAudioCall) {
				return;
			}

			this.channelName += '_'+this.currentUser.id+'_'+id;

			let data = {
				channel_id : this.channelName,
				host : this.currentUser.id,
				host_name : this.currentUser.name,
				target_user_id : id,
				status : 'incoming'
			}


			this.baseService.seedIncomingCall(data, 'log-audio-session')
			.subscribe((data:any) => {
				if (data.error) {
					this.alert.errorMsg(data.error, "Can't Connect User");
					this.stopSoundOutGoing();
					return;
				}else{
					this.thisHostAudioData = data;
					this.playSoundOutGoing();
					this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
					this.assignClientHandlers();
					this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: false, screen: false });
					this.assignLocalStreamHandlers();
					// Join and publish methods added in this step
					this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
					this.onAudioCall = true;
					this.startCallMonitor();
				}
			});
		}


		startCallMonitor(){
			this.baseService.audioHostSessions$.subscribe( data => {
				this.thisHostAudioData = data;
				if (this.count(this.thisHostAudioData) > 0) {
					//perform actions
					if (this.thisHostAudioData.status === 'ended') {
						this.stopSoundOutGoing();
						this.endCallMonitor();
						//at this point we might want to end this call for the host
						this.endAudioCall();
					}

					if (this.thisHostAudioData.status === 'picked') {
						this.stopSoundOutGoing();
						//don't stop monitor as host will be the last person to leave the stream
						//do other things
					}
				}
			});

			this.monitorInterval = setInterval(() => { 
				this.hostMonitorCall();
			}, 8000);
		}


		endCallMonitor(){
			if (this.monitorInterval) {
				clearInterval(this.monitorInterval);
			};
		}


		endAudioCall(){
			if ((this.count(this.thisHostAudioData) > 0) && this.onAudioCall) {
				this.client.leave(() => {
					console.log("Leavel channel successfully");
				}, (err) => {
					console.log("Leave channel failed");
				});
				this.client.unpublish(this.localStream, err => console.log("Unable to unpublish stream"));
				this.localStream.stop(() => {console.log('Stream stopped successfully')});
				this.localStream.close();
				this.onAudioCall = false;
				this.baseService.deleteAudioSession(this.thisHostAudioData.id)
				.subscribe(data => {
					this.alert.snotSimpleSuccess("Call ended");
				});
			}else{
				// this.onAudioCall = false;
				// this.baseService.deleteAudioSession(this.thisHostAudioData.id)
				// .subscribe(data => {
				// 	this.thisHostAudioData = {};
				// });
			}

			if (this.monitorInterval) {
				clearInterval(this.monitorInterval);
			};
		}


		//=================== Get ongoing live sessions =============//
		getIncomingCallSessions() {
			this.baseService.getAudioSessions(this.currentUser.id);
		}

		//=================== Get ongoing live sessions =============//
		hostMonitorCall() {
			this.baseService.getAudioHostSession(this.currentUser.id);
		}

		private assignClientHandlers(): void {

			this.client.on(ClientEvent.Error, error => {
				console.log('Got error msg:', error.reason);
				if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
					this.client.renewChannelKey(
						'',
						() => console.log('Renewed the channel key successfully.'),
						renewError => console.error('Renew channel key failed: ', renewError)
						);
				}
			});

			this.client.on(ClientEvent.RemoteStreamAdded, evt => {
				const stream = evt.stream as Stream;
				this.client.subscribe(stream, { audio: true, video:false }, err => {
					console.log('Subscribe stream failed', err);
				});
			});

			this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
				const stream = evt.stream as Stream;
				const id = this.getRemoteId(stream);
				if (!this.remoteCalls.length) {
					this.remoteCalls.push(id);
					setTimeout(() => stream.play(id), 1000);
				}
			});

			this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
				const stream = evt.stream as Stream;
				if (stream) {
					stream.stop();
					this.remoteCalls = [];
					console.log(`Remote stream is removed ${stream.getId()}`);
				}
			});

			this.client.on(ClientEvent.PeerLeave, evt => {
				const stream = evt.stream as Stream;
				if (stream) {
					stream.stop();
					this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
					console.log(`${evt.uid} left from this channel`);
				}
			});
		}

		private getRemoteId(stream: Stream): string {
			return `agora_remote-${stream.getId()}`;
		}


		private assignLocalStreamHandlers(): void {
			this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
				console.log('accessAllowed');
			});

			// The user has denied access to the camera and mic.
			this.localStream.on(StreamEvent.MediaAccessDenied, () => {
				console.log('accessDenied');
			});
		}

		private initLocalStream(onSuccess?: () => any): void {
			this.localStream.init(
				() => {
					// The user has granted access to the camera and mic.
					this.localStream.play(this.localCallId);
					if (onSuccess) {
						onSuccess();
					}
				},
				err => console.error('getUserMedia failed', err)
				);
		}


   /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
   join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
   	this.client.join(null, this.channelName, this.uid, onSuccess, onFailure);
   }

   /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
   receiverJoin(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
   	this.client.join(null, this.incomingCall.channel_id, this.uid, onSuccess, onFailure);
   }


   /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
   publish(): void {
   	this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
   }

   updateScrollDirection() {
   	$(".chat-outer").mCustomScrollbar("scrollTo","bottom");
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

		if (this.onAudioCall) {
			return;
		}
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

	}



	//================= Check Typing Event ===========================//
	checkTypingEvent(activeChat_id:number){
		let found = _.findLast(this.typingState, ['receiver_id', this.currentUser.id]);
		return (found && found.sender_id === activeChat_id && found.isTyping)?true:false;
	}
	
	// ================ Custom Plugin Section ============================//
	jQueryMethods(){
		$(".chat-outer").mCustomScrollbar({
			axis:"y"
		});
	}



	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
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

		if (this.onAudioCall) {
			return;
		}

		this.activeChat = contact;
		//mark all active chat messages as read
		this.markRead(this.currentUser.id, this.activeChat.id);
	}

	//============== Typing Event =======================//
	typingEvent(event:any, receiver_id: number ) {
		this.updateScrollDirection();
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
			this.updateScrollDirection();
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
		this.updateScrollDirection();
		
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

	}


}
