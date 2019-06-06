declare var $: any;
import * as _ from 'lodash';
import { User, Typing } from '../../_models';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, interval} from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { switchMap, first, startWith, map} from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService, TypingService} from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
	currentUser:User;

	public base_url = window.location.origin;
	public showEdit:boolean = false;
	public image: any = null;
	public isImage = false;
	public processedImage = '';
	public sendingForm:boolean = false;


	public conversation: Array<any> = [];
	public navigation:Array<any> = [

		{id: 1, alias: "settings", name: "Settings", icon: "ti-panel"},
		{id: 2, alias: "all_friends", name: "Connections", icon: "ti-user"},
		{id: 3, alias: "recent_chat", name: "Recent Chat", icon: "ti-comment-alt"},
	];

	public selectedNav = this.navigation[2];

	//Observables
	public contacts$: Observable<any>;
	public messages$: Observable<any>;

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
		private alert: AlertService,
		private baseService : BaseService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};




		//Push cuccurrent feeds
	    this.typingSubscription = typingService
	    .getTypingState()
	    .subscribe((typing: Typing) => {

	    	if (this.currentUser.id === typing.receiver_id) {
	    		this.typingState.push(typing);
	    	}
	     
	    });

	}

	ngOnInit() {

		this.getContacts();

		this.getMessages();

		setTimeout(() => {
			this.jQueryMethods();
		}, 200);
	}


	// ================= Get Contacts =================================//
	getContacts() {
		this.contacts$ = this.baseService.getContacts(this.currentUser.id);
	}


	// ================ Get Messages ===================================//

	getMessages() {
		this.messages$ = this.baseService.getMessages(this.currentUser.id);
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
		$(".filterDiscussions").on("click", function() {
			$("#chat-dialog").css({
				'right':'0'
			});
		});

		$(".back-to-mesg").on("click", function() {
			$("#chat-dialog").css({
				'right':'-100%'
			});
		});

		$(".menu a i").on("click", function() {
			$(".menu a i").removeClass("active"), $(this).addClass("active");
		}), 

		$("#contact, #recipient").click(function() {
			$(this).remove();
		}), 

		$(function() {
			$('[data-toggle="tooltip"]').tooltip();
		}),


		$(".filterMembers").not(".all").hide("3000"), 
		$(".filterMembers").not(".all").hide("3000"), 
		$(".filterMembersBtn").click(function() {
			var t = $(this).attr("data-filter");

			$(".filterMembers").not("." + t).hide("3000"), 
			$(".filterMembers").filter("." + t).show("3000");
		}),


		$(".filterDiscussions").not(".all").hide("3000"), 
		$(".filterDiscussions").not(".all").hide("3000"), 
		$(".filterDiscussionsBtn").click(function() {
			var t = $(this).attr("data-filter");

			$(".filterDiscussions").not("." + t).hide("3000"), 
			$(".filterDiscussions").filter("." + t).show("3000");
		}),


		$(".filterNotifications").not(".all").hide("3000"), 
		$(".filterNotifications").not(".all").hide("3000"), 
		$(".filterNotificationsBtn").click(function() {
			var t = $(this).attr("data-filter");

			$(".filterNotifications").not("." + t).hide("3000"), 
			$(".filterNotifications").filter("." + t).show("3000");
		}),


		$("#people").on("keyup", function() {
			var t = $(this).val().toLowerCase();
			$("#contacts a").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(t) > -1);
			});
		});

		$("#conversations").on("keyup", function() {
			var t = $(this).val().toLowerCase();
			$("#chats a").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(t) > -1);
			});
		});

		$("#notice").on("keyup", function() {
			var t = $(this).val().toLowerCase();
			$("#alerts a").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(t) > -1);
			});
		});

		//user setting	
		$('.setting').on('click', function() {
			$('.messenger-navigation').toggleClass('active');
			$('.messenger-sidebar').toggleClass('slide');

		});
		//------ scrollbar plugin
		if ($.isFunction($.fn.perfectScrollbar)) {
			$('#discussions .list-group, #contacts, #alerts, #accordionSettings, .main .chat .content').perfectScrollbar();
		}

		// emojies show on text area
		$('.add-smiles > span').on("click", function() {
			$(this).parent().siblings(".smiles-bunch").toggleClass("active");
		});

		//audio video call	
		$('.audio-call, .video-call').on('click', function() {
			$('#chat1').css({
				'display':'none'
			});
			$('#call1').css({
				'opacity':'1',
				'visibility': 'visible',
				'transition': 'all 0.25s linear 0s'
			});

		});

		$('.call-end').on('click', function() {
			$('#chat1').css({
				'display':'block'
			});

			$('#call1').css({
				'opacity':'0',
				'visibility': 'hidden',
				'transition': 'all 0.25s linear 0s'
			});
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


	//================ Set Active Navigation  =====================//
	setNavigation(nav) {

		if (nav.id === 2) {
			this.getContacts();
		}

		if (nav.id === 3) {
			this.getMessages();
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


	//=============== Chat window Contact Setter ===================//
	openChatWindow(contact:any) {
		this.activeChat = contact;
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
		let message = "Typing...";

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

		let payload = {
			sender_id: this.currentUser.id,
			receiver_id: activeChat.id,
			message: this.chatMessage,
		};


		this.http
		    .post(`${this.authenticationService.endpoint}/send-message`, payload)
		    .toPromise()
		    .then((data: { message: string; status: boolean }) => {
		      // this.getMessages();
		      this.chatMessage = '';
		      this.activeChat.messages = data;
		    })
		    .catch(error => {
		      //
		    });
			

		this.setNavigation(this.navigation[2]);

	}
}
