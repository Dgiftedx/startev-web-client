declare var $: any;
import * as _ from 'lodash';
import { User } from '../../../_models';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, Observable, interval} from 'rxjs';
import { BroadcastMessage } from '../../../_models/broadcastMessage';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { switchMap, first, startWith, map} from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { BroadcastMessageService } from '../../../_services/broadcast-message.service';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Component({
	selector: 'app-join-live-session',
	templateUrl: './join-live-session.component.html',
	styleUrls: ['./join-live-session.component.css'],
	animations: [
	trigger(
		'enterAnimation', [
		transition(':enter', [
			style({transform: 'translateY(-100%)'}),
			animate('200ms ease-in', style({transform: 'translateY(0%)'}))
			]),
		transition(':leave', [
			animate('200ms ease-out', style({transform: 'translateY(-100%)'}))
			])
		]),
	trigger('fadeAnimation', [

		// the "in" style determines the "resting" state of the element when it is visible.
		state('in', style({opacity: 1})),

		// fade in when created. this could also be written as transition('void => *')
		transition(':enter', [
			style({opacity: 0}),
			animate(600 )
			]),

		// fade out when destroyed. this could also be written as transition('void => *')
		transition(':leave',
			animate(600, style({opacity: 0})))
		])
	],
})
export class JoinLiveSessionComponent implements OnInit {

	public currentSchedule:any = {};

	public currentSession:any = {};
	public onGoingSessions: any = [];
	private onGoingSubscription : Subscription;

	public showTable : boolean = true;
	public showBroadcast : boolean = false;
	public broadcastInProgress : boolean = false;

	public upcomingMeeting : any = [];
	private upcomingSubscription : Subscription;


	currentUser:User;

	localCallId = 'agora_local';
	remoteCalls: Array<any> = [];
	channel_name:string = '';

	private client: AgoraClient;
	private localStream: Stream;
	private uid: any;


	interval:any;

	public groupMessage:string = '';
	public groupMessages: BroadcastMessage[] = [];
	private groupMessageSubscription : Subscription;
	private realTimeBSubscription : Subscription;


	public isSending : boolean = false;

	constructor(
		private http : HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private alert: AlertService,
		private loaderService : NgxUiLoaderService,
		private baseService : BaseService,
		private datePipe : DatePipe,
		private broadCastService : BroadcastMessageService,
		private ngxAgoraService: NgxAgoraService,
		private authenticationService: AuthenticationService) {

		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		//Push cuccurrent broadcast messages
		this.realTimeBSubscription = this.broadCastService
		.getBroadcastMessage()
		.subscribe((message: BroadcastMessage) => {
			//if we have an active schedule
			if (this.currentSession) {
				if (this.currentSession.schedule_id === message.schedule_id) {
					this.groupMessages.push(message);
				}
			}
		});

	}


	ngOnInit() {

		this.baseService.liveSessions$.subscribe( data => {
			this.onGoingSessions = data;
		});

		this.getOnGoingSessions();
		this.interval = setInterval(() => { 
			this.getOnGoingSessions();
		}, 8000);

		this.getUpcomingMeetings();
		
	}



	get userData(){
		return JSON.parse(this.authenticationService.getUserData());
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



	//============ Count items ===================//
	public count( items:any ){
		return _.size(items);
	}



	//=================== Get ongoing live sessions =============//
	getOnGoingSessions() {
		// this.onGoingSubscription = this.baseService.getLiveSessions(this.currentUser.id)
		// .subscribe( (data:any) => {
			// 	this.onGoingSessions = data;
			// });
			this.baseService.getLiveSessions(this.currentUser.id);
		}

		//=================== Get upcoming invitations ==============//
		getUpcomingMeetings(){
			this.upcomingSubscription = this.baseService.getUpcomingMeeting(this.currentUser.id)
			.subscribe( (data:any) => {
				this.upcomingMeeting = data;
			});
		}


		//clear selected schedule
		clearSelection(){

		}


		setCurrentSession(session:any){
			this.currentSession = session;
			// this.localCallId += 'agora_localstartev-live'+session.channel_id;
			this.channel_name = session.channel_id;
			this.uid = Math.floor(100000 + Math.random() * 900000) + `${this.currentUser.id}`;
			this.showTable = false;
			this.showBroadcast = true;
			this.broadcastInProgress = true;

			//First push local feeds on load
			this.groupMessageSubscription = this.broadCastService
			.getLocalBroadcastMessage()
			.subscribe((message:any) => {
				message.forEach((item) => {
					//if message is directed to schedule
					if (item.schedule_id == session.schedule_id) {
						item.created_at = new Date(item.created_at);
						//push messages
						this.groupMessages.push(item);
					}
				});

			});

			setTimeout(() =>{
				this.joinBroadcastSession();
			})
		}


		//================= Start Broadcast Session ================//
		joinBroadcastSession() {
			this.ngxAgoraService.AgoraRTC.Logger.setLogLevel(this.ngxAgoraService.AgoraRTC.Logger.NONE);
			this.client = this.ngxAgoraService.createClient({ mode: 'live', codec: 'h264' });
			this.assignClientHandlers();

			this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
			this.assignLocalStreamHandlers();
			// Join and publish methods added in this step
			this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
		}

	/**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
   join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
   	this.client.join(null, this.channel_name, this.uid, onSuccess, onFailure);
   }



  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
   publish(): void {
   	this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
   }

   private assignClientHandlers(): void {
   	this.client.on(ClientEvent.LocalStreamPublished, evt => {
   		console.log('Publish local stream successfully');
   	});

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
   		this.client.subscribe(stream, { audio: true, video: true }, err => {
   			console.log('Subscribe stream failed', err);
   		});
   	});

   	this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
   		const stream = evt.stream as Stream;
   		const id = this.getRemoteId(stream);
   		if (!this.remoteCalls.length) {

   			let filter = id.split("-")[1];
   			let realId = filter.substr(filter.length -1);
   			let filtered = parseInt(realId);

   			if (this.currentSession.host === filtered) {
   				this.remoteCalls.push(id);
   				setTimeout(() => stream.play(id), 1000);
   			}
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

   private getRemoteId(stream: Stream): string {
   	return `agora_remote-${stream.getId()}`;
   }




   //======================= Submit Feeds ===================//
   sendMessage(){

   	if (!this.currentSession) {
   		return;
   	}

   	if (_.size(this.groupMessage) === 0) {
   		return this.alert.errorMsg("Please type you message","Error");
   	}

   	this.isSending = true;

   	let data:any = {
   		message: this.groupMessage,
   		schedule_id : this.currentSession.schedule_id,
   		user_avatar: this.currentUser.avatar,
   		user_name: this.currentUser.name,
   		is_mentor : 0
   	}

   	if (this.userData.role === 'mentor') {
   		data.is_mentor = 1;
   	}

   	this.http
   	.post(`${this.authenticationService.endpoint}/submit-broadcast-message`, data)
   	.toPromise()
   	.then((data: { message: string; status: boolean }) => {
   		//so nothing
   		this.groupMessage = '';
   		this.isSending = false;
   	})
   	.catch(error => {
   		this.alert.errorMsg(error, " There is an error");
   	});
   }


   leaveBroadcastSession(){
   	this.client.leave(() => {
   		console.log("Leavel channel successfully");
   	}, (err) => {
   		console.log("Leave channel failed");
   	});

   	this.client.unpublish(this.localStream, err => console.log("Unable to unpublish stream"));
   	this.localStream.stop(() => {console.log('Stream stopped successfully')});
   	this.localStream.close();
   	this.broadcastInProgress = false;

   	setTimeout(() => {
   		this.showBroadcast = false;
   		this.showTable = true;
   	}, 1000);
   }


}
