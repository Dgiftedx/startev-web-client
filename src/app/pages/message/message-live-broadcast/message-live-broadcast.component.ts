declare var $: any;
import * as _ from 'lodash';
import { User } from '../../../_models';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, Observable, interval} from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { switchMap, first, startWith, map} from "rxjs/operators";
import { BroadcastMessage } from '../../../_models/broadcastMessage';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';
import { BroadcastMessageService } from '../../../_services/broadcast-message.service';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Component({
	selector: 'app-message-live-broadcast',
	templateUrl: './message-live-broadcast.component.html',
	styleUrls: ['./message-live-broadcast.component.css'],
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
export class MessageLiveBroadcastComponent implements OnInit {

	startSession:boolean = false;

	localCallId = 'agora_local';
	remoteCalls: string[] = [];

	private client: AgoraClient;
	private localStream: Stream;
	private uid: number;

	public groupMessage:string = '';

	currentUser : User;
	public selectedSchedule: number;

	public broadcastInProgress : boolean = false;

	//Schedules collection
	public schedules:any = [];
	private scheduleSubscription : Subscription;

	public trainees : any = [];
	private traineesSubscription: Subscription;

	public currentSchedule:any = {};

	public groupMessages: BroadcastMessage[] = [];
	private groupMessageSubscription : Subscription;
	private realTimeBSubscription : Subscription;

	public isSending : boolean = false;

	public selectedIndex : number = 0;

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
		this.uid = Math.floor(Math.random() * 100);
		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};


		//First push local feeds on load
      this.groupMessageSubscription = this.broadCastService
      .getLocalBroadcastMessage()
      .subscribe((message:any) => {
       
       //if we have an active schedule
       if (this.selectedSchedule) {
       		 message.forEach((item) => {
	         	//if message is directed to schedule
	         	if (item.schedule_id === this.selectedSchedule) {
	         		 item.created_at = new Date(item.created_at);
	         		 //push messages
	          		this.groupMessages.push(item);
	         	}
	        });
       }

      });



      //Push cuccurrent broadcast messages
      this.realTimeBSubscription = this.broadCastService
      .getBroadcastMessage()
      .subscribe((message: BroadcastMessage) => {
       //if we have an active schedule
       if (this.selectedSchedule) {
       		if (this.selectedSchedule === message.schedule_id) {
       			this.groupMessages.push(message);
       		}
       }
      });


	}

	ngOnInit() {
		this.getSchedules();
		this.getTrainees();
	}



	get userData(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	getSchedules() {
		this.scheduleSubscription = this.baseService.broadcastSchedules(this.currentUser.id)
		.subscribe( (data:any) => {
			let temp = [];
			data.forEach(item => {
				if (item.status === 'pending') {
					temp.push(item);
				}
			})
			this.schedules = temp;
		});
	}


	getTrainees(){
		this.traineesSubscription = this.baseService.getTrainees(this.currentUser.id)
		.subscribe(data => {
			this.trainees = data;
		})
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


	//clear selected schedule
	clearSelection(){
		this.currentSchedule = {};
		this.selectedSchedule = null;
		this.broadcastInProgress = false;
	}


	//================= Start Broadcast Session ================//
	startBroadcastSession() {
		this.startSession = true;
		// this.localCallId += "startev-live"+this.selectedSchedule;

		this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
		this.assignClientHandlers();

		if (this.createHostStream()) {

			this.baseService.fetchParticipants(this.selectedSchedule)
			.subscribe( (data:any) => {
				this.currentSchedule = data;
				this.startSession = false;
			})

			this.localStream = this.createHostStream();
			this.assignLocalStreamHandlers();
			// Join and publish methods added in this step
			this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
			//push critical updates to databse and log session
			this.updateInitSession();
			//change status
			this.broadcastInProgress = true;
		}
		
		//log necessary informations and notify participants
		//change schedule status to in progress and efforce necessary restrictions
		this.startSession = false;
		this.selectedIndex = 2;
	}


	//================ Set item in loca storage ===============//
	setLocalItem(key:any, items:any){
		localStorage.setItem(key, JSON.stringify(items));
	}

	getLocalItem(key:any){
		return JSON.parse(localStorage.getItem(key));
	}

	//=============== Update Database records & create a live session =============//
	updateInitSession() {
		let data:any = {
			uid : this.uid,
		}

		if (this.selectedSchedule) {
			let found = _.findLast(this.schedules, ['id', this.selectedSchedule]);
			
			data.schedule_id = this.selectedSchedule;
			data.channel_id = 'startev-live'+found.id;
			data.host = this.currentUser.id;
			data.host_name = this.currentUser.name;
			data.status = 'active';

			this.baseService.logLiveSession(data)
			.subscribe((result:any) => {
				this.setLocalItem('liveSession', result);
			})
		}else{
			return;
		}
	}


	//=============== Update Database records & remove live session log =============//
	removeInitSession() {
		
		let localItem:any = this.getLocalItem('liveSession');

		let data:any = {
			id: localItem.id,
			schedule_id : localItem.schedule_id,
		};

		this.baseService.removeLiveSession(data)
		.subscribe((result) => {
			localStorage.removeItem('liveSession');
			//refresh schedules list
			this.getSchedules();
		});
	}


  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
   join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {

   	let found = _.findLast(this.schedules, ['id', this.selectedSchedule]);
   	this.client.join(null, 'startev-live'+found.id, this.uid, onSuccess, onFailure);
   }


  /**
   * As a host, create stream for others to join as audience
   */
   createHostStream(): Stream {
   	if (this.userData.role === 'mentor') {
   		return this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
   	}
   	return null;
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


   //================= End Broadcast Session =================//
   endBroadcastSession(){
   	this.client.leave(() => {
   		console.log("Leavel channel successfully");
   	}, (err) => {
   		console.log("Leave channel failed");
   	});

   	this.client.unpublish(this.localStream, err => console.log("Unable to unpublish stream"));
   	this.localStream.stop(() => {console.log('Stream stopped successfully')});
   	this.localStream.close();

   	//remove this schedule group chats
   	this.removeMessages();

   	this.clearSelection();
   	//change schedule status to completed and remove from upcoming schedule list.
   	this.removeInitSession();
   }

    //======================= Submit Feeds ===================//
    sendMessage(){

      if (!this.selectedSchedule) {
      	return this.alert.infoMsg("No live session has been initiated", "Can't send Message");
      }

      if (_.size(this.groupMessage) === 0) {
        return this.alert.errorMsg("Please type you message","Error");
      }

      this.isSending = true;

      let data:any = {
      	message: this.groupMessage,
      	schedule_id : this.selectedSchedule,
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



    removeMessages() {
    	this.baseService.removeBroadcastMessage(this.selectedSchedule)
    	.subscribe( data => {
    		//do nothing
    		this.groupMessages = [];
    	})
    }


}
