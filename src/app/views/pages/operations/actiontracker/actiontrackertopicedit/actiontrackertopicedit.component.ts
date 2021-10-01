// Angular
import { Component, OnInit,Input, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent,MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';



// State
import { AppState } from '../../../../../core/reducers';

// Services and Models

import { delay } from 'rxjs/operators';

import * as moment from 'moment';

import { AuthService,ActionTrackerTopicStatus,ActionTrackerTopicNames,ActionTrackerTopicOwner, ActionTrackerTopicPriority } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { ActionTrackerTopic } from '../../../../../core/auth/_models/actiontrackertopic.model';
import { allActionTrackerTopicsLoaded,selectActionTrackerTopicById } from '../../../../../core/auth/_selectors/actiontrackertopic.selectors';
@Component({
  selector: 'kt-actiontrackertopicedit',
  templateUrl: './actiontrackertopicedit.component.html',
  styleUrls: ['./actiontrackertopicedit.component.scss']
})
export class ActiontrackertopiceditComponent implements OnInit {
	actiontrackerid: number;
    actiontrackertopic: ActionTrackerTopic;
	filterMenus: any;
	filterMenustring: any;
	CallCenterList: ActionTrackerTopic[];
	actiontrackertopic$: Observable<ActionTrackerTopic>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	isArchive:boolean=false;
	public ErrorMessage: string;
	dateError: string;
	// allPermissions$: Observable<Permission[]>;
	// actiontrackertopicPermissions: Permission[] = [];

	// Roles	
	allcallcenters: any[] = [];
	unassignedcallcenters: any[] = [];
	assignedcallcenters: any[] = [];
	actiontrackertopicIdForAdding: number;
	actiontrackertopicsSubject = new BehaviorSubject<number[]>([]);

	// TopicName	
	allTopicNames: ActionTrackerTopicNames[] = [];
	unassignedTopicNames: ActionTrackerTopicNames[] = [];
	assignedTopicNames: ActionTrackerTopicNames[] = [];
	TopicNameIdForAdding: number;
	TopicNamesSubject = new BehaviorSubject<number[]>([]);

	// TopicStatus	
	allTopicStatus: ActionTrackerTopicStatus[] = [];
	unassignedTopicStatus: ActionTrackerTopicStatus[] = [];
	assignedTopicStatus: ActionTrackerTopicStatus[] = [];
	TopicStatusIdForAdding: number;
	TopicStatusSubject = new BehaviorSubject<number[]>([]);

	// TopicOwner	
	allTopicOwner: ActionTrackerTopicOwner[] = [];
	unassignedTopicOwner: ActionTrackerTopicOwner[] = [];
	assignedTopicOwner: ActionTrackerTopicOwner[] = [];
	TopicOwnerIdForAdding: number;
	TopicOwnerSubject = new BehaviorSubject<number[]>([]);

	// Topic Priority	
	allTopicPriority: ActionTrackerTopicPriority[] = [];
	unassignedTopicPriority: ActionTrackerTopicPriority[] = [];
	assignedTopicPriority: ActionTrackerTopicPriority[] = [];
	TopicPriorityIdForAdding: number;
	TopicPrioritySubject = new BehaviorSubject<number[]>([]);


	UserID:number;
	disable :boolean = true;
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray: any[] = [];
	public selectedPRArray: any[] = [];
	showIsArchive:boolean = false;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<actiontrackertopicEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<ActiontrackertopiceditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
			if (localStorage.hasOwnProperty("currentUser")) {
				this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
			  }
	}

	/**
	 * On init
	 */
	ngOnInit() {	
	
		if (this.data.id) {
			this.actiontrackertopic$ = this.store.pipe(select(selectActionTrackerTopicById(this.data.id)));
		} else {

			const newactiontrackertopic = new ActionTrackerTopic();
			newactiontrackertopic.clear();
			this.actiontrackertopic$ = of(newactiontrackertopic);
		}
		
		this.actiontrackerid= this.data.actiontrackerid;
		this.actiontrackertopic$.subscribe(res => {
			if (!res) {
				this.actiontrackertopic = new ActionTrackerTopic();
				this.actiontrackertopic.executed_per=0;
				return;
			}
			this.actiontrackertopic = new ActionTrackerTopic();
			this.actiontrackertopic.id = res.id;
			// this.actiontrackertopic.topic = res.topic;
			this.actiontrackertopic.Findings_or_issues = res.Findings_or_issues;
			this.actiontrackertopic.actions = res.actions;
			this.actiontrackertopic.owner = res.owner;
      		this.actiontrackertopic.launch_deadline_datetime = moment(res.launch_deadline_datetime).format('YYYY-MM-DD');
			this.actiontrackertopic.control_deadline_datetime = moment(res.control_deadline_datetime).format('YYYY-MM-DD');
			this.actiontrackertopic.target = res.target;
			this.actiontrackertopic.executed_per = res.executed_per;
			this.actiontrackertopic.status = res.status;
			this.actiontrackertopic.priorityid = res.priorityid;
			this.actiontrackertopic.isarchive=res.isarchive;
			this.actiontrackertopic.statusname = res.statusname.toString().toLocaleLowerCase();
			
			this.TopicStatusIdForAdding = res.status;
			this.TopicNameIdForAdding = res.topic;
			this.TopicOwnerIdForAdding= res.owner;
			this.TopicPriorityIdForAdding= res.priorityid;

			this.TopicNamesSubject.next(res.topicids)
			this.TopicStatusSubject.next(res.statusids)
			this.TopicOwnerSubject.next(res.ownerids)
			this.TopicPrioritySubject.next(res.priorityids)
			
			if(this.actiontrackertopic.statusname.toLowerCase()=="finalized" || this.actiontrackertopic.statusname.toLowerCase()=="cancelled"){
				this.showIsArchive=true;
			}
			//alert(this.actiontrackertopic.isCoreactiontrackertopic);
		});
		this.auth.getAllActionTrackerTopicNames().subscribe((name: ActionTrackerTopicNames[]) => {
			each(name, (_name: ActionTrackerTopicNames) => {
				this.allTopicNames.push(_name);
				this.unassignedTopicNames.push(_name);
			});
			each([Number(this.TopicNamesSubject.value.toString())], (id: number) => {
				const actiontrackertopicname = find(this.allTopicNames, (_actiontrackertopicname: ActionTrackerTopicNames) => {
					return _actiontrackertopicname.id === id;
				});
				
				if (actiontrackertopicname) {
					this.assignedTopicNames.push(actiontrackertopicname);
					remove(this.unassignedTopicNames, actiontrackertopicname);
				}
			});
		});
		this.auth.getAllActionTrackerTopicStatus().subscribe((status: ActionTrackerTopicStatus[]) => {
			each(status, (_status: ActionTrackerTopicStatus) => {
				this.allTopicStatus.push(_status);
				this.unassignedTopicStatus.push(_status);
			});
			each([Number(this.TopicStatusSubject.value.toString())], (id: number) => {
				const actiontrackertopicstatus = find(this.allTopicStatus, (_actiontrackertopicstatus: ActionTrackerTopicStatus) => {
					return _actiontrackertopicstatus.id === id;
				});
				
				if (actiontrackertopicstatus) {
					this.assignedTopicStatus.push(actiontrackertopicstatus);
					remove(this.unassignedTopicStatus, actiontrackertopicstatus);
				}
			});
		});

		this.auth.getAllActionTrackerTopicPriority().subscribe((priority: ActionTrackerTopicPriority[]) => {
			each(priority, (_priority: ActionTrackerTopicPriority) => {
				this.allTopicPriority.push(_priority);
				this.unassignedTopicPriority.push(_priority);
			});
			each([Number(this.TopicPrioritySubject.value.toString())], (id: number) => {
				const actiontrackertopicpriority = find(this.allTopicPriority, (_actiontrackertopicpriority: ActionTrackerTopicPriority) => {
					return _actiontrackertopicpriority.id === id;
				});
				
				if (actiontrackertopicpriority) {
					this.assignedTopicPriority.push(actiontrackertopicpriority);
					remove(this.unassignedTopicPriority, actiontrackertopicpriority);
				}
			});
		});


		this.auth.getAllActionTrackerTopicOwner(this.actiontrackerid).subscribe((owner: ActionTrackerTopicOwner[]) => {
			each(owner, (_owner: ActionTrackerTopicOwner) => {
				this.allTopicOwner.push(_owner);
				this.unassignedTopicOwner.push(_owner);
			});
			
			each([Number(this.TopicOwnerSubject.value.toString())], (id: number) => {
				const actiontrackertopicowner = find(this.allTopicOwner, (_actiontrackertopicowner: ActionTrackerTopicOwner) => {
					return _actiontrackertopicowner.id === id;
				});
				
				if (actiontrackertopicowner) {
					this.assignedTopicOwner.push(actiontrackertopicowner);
					remove(this.unassignedTopicOwner, actiontrackertopicowner);
				}
			});
		});

	}
	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}
	/**
	 * Returns actiontrackertopic for save
	 */
	prepareactiontrackertopic(): ActionTrackerTopic {
		//let SelectData:any;
		//SelectData = this.mainmenufromArray;
		
		const _actiontrackertopic = new ActionTrackerTopic();
	if (this.actiontrackerid == undefined)
		_actiontrackertopic.action_tracker_id = this.actiontrackertopic.action_tracker_id;
	else
		_actiontrackertopic.action_tracker_id = Number(this.actiontrackerid);
    _actiontrackertopic.id = this.actiontrackertopic.id;
    _actiontrackertopic.topic = this.TopicNameIdForAdding;
    _actiontrackertopic.Findings_or_issues = this.actiontrackertopic.Findings_or_issues;
    _actiontrackertopic.actions = this.actiontrackertopic.actions;
    _actiontrackertopic.owner = this.TopicOwnerIdForAdding;
    _actiontrackertopic.launch_deadline_datetime = moment(this.actiontrackertopic.launch_deadline_datetime).format('YYYY-MM-DD');
    _actiontrackertopic.control_deadline_datetime = moment(this.actiontrackertopic.control_deadline_datetime).format('YYYY-MM-DD');
    _actiontrackertopic.target = this.actiontrackertopic.target;
    _actiontrackertopic.executed_per = this.actiontrackertopic.executed_per;
    _actiontrackertopic.status = this.TopicStatusIdForAdding;
	_actiontrackertopic.isarchive= this.isArchive;
	_actiontrackertopic.userid = this.UserID;
	_actiontrackertopic.priorityid = this.TopicPriorityIdForAdding;
  //_actiontrackertopic.privilegeid = 3;
		return _actiontrackertopic;
	}

	/**
	 * Save data
	 */
	onSubmit() {
		//
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedactiontrackertopic = this.prepareactiontrackertopic();
		if (editedactiontrackertopic.id > 0) {
			this.updateactiontrackertopic(editedactiontrackertopic);
		} else {
			this.createactiontrackertopic(editedactiontrackertopic);
		}
	}

	/**
	 * Update actiontrackertopic
	 *
	 * @param _actiontrackertopic: actiontrackertopic
	 */
	updateactiontrackertopic(_actiontrackertopic: ActionTrackerTopic) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateActionTrackerTopic(_actiontrackertopic).subscribe(data => {
			console.log('UpdateActionTrackerTopic Data received: ' + data)
			this.selectedMMArray = [];
			this.selectedPRArray = [];
			of(undefined).pipe(delay(500)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_actiontrackertopic,
					isEdit: true,
					data
				});
			});
		});// Remove this line
	}

	/**
	 * Create actiontrackertopic
	 *
	 * @param _actiontrackertopic: actiontrackertopic
	 */
	createactiontrackertopic(_actiontrackertopic: ActionTrackerTopic) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createActionTrackerTopic(_actiontrackertopic).subscribe(data => {
			debugger;
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_actiontrackertopic,
				isEdit: false,
				data
			});
		});
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	onArchivechange(event) {
		if (event.checked)
		  this.isArchive = true;
		else
		  this.isArchive = false;
	  }

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.actiontrackertopic && this.actiontrackertopic.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit ActionTracker Topic`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Action Tracker Topic';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
	
		return (this.actiontrackertopic 
			&& this.actiontrackertopic.control_deadline_datetime
			&& this.actiontrackertopic.launch_deadline_datetime
			&& this.TopicStatusIdForAdding > 0
			&& this.actiontrackertopic.actions.length > 0
			&& this.actiontrackertopic.Findings_or_issues.length > 0 
			&& this.TopicNameIdForAdding > 0
			&& this.TopicPriorityIdForAdding > 0);
	}

	percentagevalidation(){
		if(this.actiontrackertopic.executed_per>100)
			{
				this.hasFormErrors = true;
				this.ErrorMessage = "Percentage can not be more than 100, please enter valid %";
				this.actiontrackertopic.executed_per=0;
			}
	}
	events: string[] = [];
	SDateaddEvent(type: string, event: MatDatepickerInputEvent<Date>) {
	  //console.log('Strat Date addEvent::'+ event);
	  this.DateValidation()
	}
  
	EDateaddEvent(type: string, event: MatDatepickerInputEvent<Date>) {
	  // console.log('End Date addEvent::'+ event);
	  this.DateValidation()
	}
  
  
	DateValidation() {    
	  
	  let sDate = moment(this.actiontrackertopic.launch_deadline_datetime).format('YYYY-MM-DD');
	  let eDate = moment(this.actiontrackertopic.control_deadline_datetime).format('YYYY-MM-DD');
	  let currentdate = moment().format('YYYY-MM-DD');

	  if (moment(eDate) < moment(sDate)) {
		console.log('Control Deadline should be greater then Launch Deadline')
		this.dateError = 'Control Deadline should be greater then Launch Deadline';
		this.hasFormErrors = true;
		this.ErrorMessage = this.dateError;
		return this.dateError;
	  }
	  else if (moment(currentdate) > moment(sDate)) {
		console.log('Launch Deadline should be greater then current date and time')
		this.dateError = 'Launch Deadline should be greater then current date and time';
		this.hasFormErrors = true;
		this.ErrorMessage = this.dateError;
		return this.dateError;
	  }
	  // else if (moment(eeDate) < moment(currentdatetime)) {
	  //   console.log('End date and time should be greater then current and time')
	  //   this.MeetingDuration = 'End date and time should be greater then Start date and time';
	  //   alert(this.MeetingDuration);
	  //   return this.MeetingDuration;
	  // }
	  else {
	  this.hasFormErrors = false;
	  this.ErrorMessage = '';
	  }
  	  return this.dateError;
	}
}
