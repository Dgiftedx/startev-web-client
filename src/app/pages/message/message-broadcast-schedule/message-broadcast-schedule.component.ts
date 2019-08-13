declare var $: any;
import * as _ from 'lodash';
import { User } from '../../../_models';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, Observable, interval} from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { switchMap, first, startWith, map} from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../../_services';

@Component({
	selector: 'app-message-broadcast-schedule',
	templateUrl: './message-broadcast-schedule.component.html',
	styleUrls: ['./message-broadcast-schedule.component.css'],
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
export class MessageBroadcastScheduleComponent implements OnInit {


	currentUser : User;
	public showTable : boolean = true;
	public showNew : boolean = false;
	public showPushNotice : boolean = false;
	public showEdit : boolean = false;


	//Schedule Data
	public scheduleData: any = {};

	public scheduleEditData: any = {};


	//push message
	public pushMessage: string = '';
	public pushBatch : any = {};
	public pushLadda : boolean = false;
	public mentees : Array<any> = [];

	public currrentParticipantsView: any = [];

	//editor configuration
	editorConfig:any = {
		toolbar: [
		['bold','italic','underline','background','color'],
		[{ 'align': [] }],
		[{ 'size': ['small', false, 'large', 'huge'] }],
		[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		['link'],
		]
	};


	//Schedules collection
	public schedules:any = [];
	private scheduleSubscription : Subscription;

	public trainees : any = [];
	private traineesSubscription: Subscription;

	constructor(
		private http : HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private alert: AlertService,
		private loaderService : NgxUiLoaderService,
		private baseService : BaseService,
		private datePipe : DatePipe,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		this.traineesSubscription = this.baseService.getTrainees(this.currentUser.id)
		.subscribe(data => {
			this.trainees = data;
		});

		//
		this.scheduleData.participants = [];
		this.scheduleEditData.participants = [];
	}

	ngOnInit() {
		this.getSchedules();
		this.getTrainees();
	}



	getSchedules() {
		this.scheduleSubscription = this.baseService.broadcastSchedules(this.currentUser.id)
		.subscribe( data => {
			this.schedules = data;
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

	//================ Transform Date ==================//
	transformDate(date) {
		return this.datePipe.transform(date, 'yyyy-MM-dd h:mm:ss');
	}


	//================ To Table View =================//
	toTable(){
		this.cleanScheduleForm();
		this.showPushNotice = false;
		this.showEdit = false;
		this.showNew = false;
		this.showTable = true;	
	}

	//================= Clean form ===================//
	cleanScheduleForm(){
		this.scheduleData = {};
		this.scheduleData.participants = [];
		this.scheduleEditData = {};
		this.scheduleEditData.participants = [];
	}

	//================= Create new schedule ==================//
	createNewSchedule(){
		let pending = 0;

		if (this.count(this.schedules) > 0) {
			this.schedules.forEach( (item : any) => {
				if (item.status === 'pending') {
					pending += 1;
				}
			});


			if (pending > 2) {
				return this.alert.infoMsg("You can't schedule more than 3 broadcast sessions", "You have pending schedules");
			}
		}

		this.trainees.forEach((item) => {
			this.mentees.push({id: item.id, name: item.name});
		})
		

		this.cleanScheduleForm();

		setTimeout(() => {
			this.showTable = false;
			this.showPushNotice = false;
			this.showEdit = false;
			this.showNew = true;
		}, 200);
	}

	addTagFn(name) {
        return { name: name, tag: true };
    }


	//================ Edit Schedule =======================//
	editSchedule(schedule:any) {
		this.trainees.forEach((item) => {
			this.mentees.push({id: item.id, name: item.name});
		});

		this.cleanScheduleForm();

		this.scheduleEditData.title = schedule.title;
		this.scheduleEditData.id = schedule.id;

		schedule.participants.forEach((item) => {
			let search = _.findLast(this.trainees, ['id', item]);
			this.scheduleEditData.participants.push({id: search.id, name: search.name});
		})
		// this.scheduleEditData.participants = schedule.participants;
		this.scheduleEditData.date = new Date(schedule.date);

		setTimeout(() => {
			this.showTable = false;
			this.showPushNotice = false;
			this.showNew = false;
			this.showEdit = true;
		});
	}


	//================ Trigger general notice ==================//
	pushNewNotice() {
		this.cleanScheduleForm();

		this.showEdit = false;
		this.showTable = false;
		this.showNew = false;
		this.showPushNotice = true;
	}


	//=============== Clear Schedule Records ==================//
	clearSchedules() {
		this.baseService.clearBroadcastSchedules(this.currentUser.id)
		.subscribe(data => {
			this.alert.snotSimpleSuccess("Schedule history/logs cleared successfully");
			this.getSchedules();
			this.toTable();
		});
	}

	//================== Download Schedules =================//
	downloadSchedule() {
		return window.open(this.authenticationService.baseurl+'/download-broadcast-schedules/'+this.currentUser.id, '_blank');
	}


	//================ View Participants ===================//
	viewParticipants(schedule:any){
		this.baseService.fetchParticipants(schedule.id)
		.subscribe( (data : any) => {
			this.currrentParticipantsView = data;
		});

		setTimeout(() => {
			//open modal.
			$(document).find('#participantsModal').modal();
		})
	}


	//=====Close Modal on page ======//
    closeModal(element : any): void {
      $(document).find('#'+element).modal('hide');
    }


	//=============== Submit New Schedule ====================//
	submitNewSchedule() {

		if (this.count(this.scheduleData.title) === 0) {
			return this.alert.errorMsg("Invalid schedule title","Error!");
		}

		if (this.count(this.scheduleData.participants) === 0) {
			return this.alert.errorMsg("Please select participants","Error!");
		}

		if (!this.scheduleData.date) {
			return this.alert.errorMsg("Please enter a valid schedule date","Error!");
		}

		if (this.count(this.scheduleEditData.participants) > 8) {
			return this.alert.errorMsg("Participants can't be more than 10", "Error!");
		}

		const participants = [];

		this.scheduleData.participants.forEach((item) => {
			participants.push(item.id);
		});

		let formData = new FormData();
		formData.append('title', this.scheduleData.title);
		formData.append('user_id', this.currentUser.id);
		formData.append('participants', JSON.stringify(participants));
		formData.append('date', this.transformDate(this.scheduleData.date));

		if (this.scheduleData.invitation_note) {
			formData.append('invitation_note', this.scheduleData.invitation_note);
		}

		this.baseService.updateSchedule(formData, 'submit-schedule')
		.subscribe(data => {
			this.getSchedules();
			this.alert.snotSimpleSuccess("Schedule created and participants informed");
			this.toTable();
		});
	}


	//===================== Update Schedule ====================//
	updateSchedule(){

		if (this.count(this.scheduleEditData.title) === 0) {
			return this.alert.errorMsg("Invalid schedule title","Error!");
		}

		if (this.count(this.scheduleEditData.participants) === 0) {
			return this.alert.errorMsg("Please select participants","Error!");
		}

		if (!this.scheduleEditData.date) {
			return this.alert.errorMsg("Please enter a valid schedule date","Error!");
		}

		if (this.count(this.scheduleEditData.participants) > 8) {
			return this.alert.errorMsg("Participants can't be more than 10", "Error!");
		}

		const participants = [];

		this.scheduleEditData.participants.forEach((item) => {
			participants.push(item.id);
		});

		let formData = new FormData();

		formData.append('schedule_id', this.scheduleEditData.id);
		formData.append('title', this.scheduleEditData.title);
		formData.append('participants', JSON.stringify(participants));
		formData.append('date', this.transformDate(this.scheduleEditData.date));

		this.baseService.updateSchedule(formData, 'update-schedule')
		.subscribe(data => {
			this.getSchedules();
			this.alert.snotSimpleSuccess("Schedule created and participants informed");
			this.toTable();
		});
	}


	//============== Send push Reminder/Notification ==================//
	sendPushNotification(){

		if (this.count(this.pushBatch) === 0) {
			this.alert.errorMsg("Please select valid schedule", "Select Schedule");
			return;
		}

		if (this.count(this.pushMessage) === 0) {
			this.alert.errorMsg("Please type in valid message", "Submission Error");
			return;
		}

		this.pushLadda = true;

		let data = {
			batch_id: this.pushBatch.id,
			message: this.pushMessage
		};


		this.baseService.sendNotice(data)
		.subscribe( data => {
			this.pushLadda = false;
			this.alert.snotSimpleSuccess("Reminder notification sent successfully");
			this.toTable();
		});
	}


	deleteSchedule(schedule:any){
		this.baseService.deleteSchedule(schedule.id)
		.subscribe(data => {
			this.getSchedules();
		});
	}

}
