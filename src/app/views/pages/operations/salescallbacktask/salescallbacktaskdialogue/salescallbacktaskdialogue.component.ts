// Angular
import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

// State
import { AppState } from '../../../../../core/reducers';

// Date Converter
import * as moment from 'moment';

import { delay } from 'rxjs/operators';


// Services and Models
import { AuthService, User, CalendarTask, SalesCallBackTaskStatus, SalesCallBackTaskUsers, SaleCallBackTaskActivity } from '../../../../../core/auth';

import { filter } from 'minimatch';
import { ActionTracker } from '../../../../../core/auth/_models/actiontracker.model';
import { selectActionTrackerById, selectActionTrackersActionLoading } from '../../../../../core/auth/_selectors/actiontracker.selectors';
import { debug } from 'console';
import { idLocale } from 'ngx-bootstrap/chronos';
import { stat } from 'fs';

@Component({
	selector: 'kt-salescallbacktaskdialogue',
	templateUrl: './salescallbacktaskdialogue.component.html',
	styleUrls: ['./salescallbacktaskdialogue.component.scss']
})
export class SalescallbacktaskdialogueComponent implements OnInit {

	@Input() pattern: string | RegExp;

	SalesCallBackTaskid: number;
	SalesCallBackTask: CalendarTask;
	salescallbacktask$: Observable<CalendarTask>;
	// Sales Call Back Task AssignedTo	
	allAssignedTousers: SalesCallBackTaskUsers[] = [];
	unassignedusers: SalesCallBackTaskUsers[] = [];
	assignedusers: SalesCallBackTaskUsers[] = [];
	AssignedToIdForAdding: number;
	AssignedToSubject = new BehaviorSubject<number[]>([]);

	// Sales Call Back Task Status	
	allSalesCallBackTaskStatus: SalesCallBackTaskStatus[] = [];
	unassignedCallBackTaskStatus: SalesCallBackTaskStatus[] = [];
	assignedCallBackTaskStatus: SalesCallBackTaskStatus[] = [];
	callbackTaskStatusIdForAdding: number;
	callBackTaskStatusSubject = new BehaviorSubject<number[]>([]);
	
	SalesCallBackTaskActivityList: SaleCallBackTaskActivity[];
	public SalesCallBackTaskActivityList$ = new BehaviorSubject<SaleCallBackTaskActivity[]>(this.SalesCallBackTaskActivityList);
	displayedColumns: string[] = ['Operation', 'Activity', 'Description'];

	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	isVieworEditflag: string;
	isAddorEdit: boolean;
	isShowCompletionTickerId: boolean = false;
	UserId: number;
	RoleId: number;
	isSupervisor: boolean = false;
	usertype: string;
	cc_role_name: string;
	ErrorMessage: string;
	dateError: string;
	isStatusDisable: boolean = true;
	startCall: string;
	endCall: string;
	defaultStatus : string = 'Open';
	// Private properties
	private componentSubscriptions: Subscription;

	constructor(public dialogRef: MatDialogRef<SalescallbacktaskdialogueComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		if (localStorage.hasOwnProperty("currentUser")) {
			this.UserId = JSON.parse(localStorage.getItem('currentUser')).agentid;
			this.RoleId = JSON.parse(localStorage.getItem('currentUser')).role_id;
			this.cc_role_name = JSON.parse(localStorage.getItem('currentUser')).cc_role_name;
		}
	}

	ngOnInit() {


		this.isVieworEditflag = this.data.flag;
		if (this.cc_role_name == 'Operations Manager' || this.cc_role_name == 'Team Manager' || this.cc_role_name == 'Supervisor')
			this.isSupervisor = true;
		else
			this.isSupervisor = false;

		if (!this.data.id) {
			const newsalescallbacktask = new CalendarTask();
			newsalescallbacktask.clear();
			this.SalesCallBackTask = newsalescallbacktask;
			let sDate = moment(this.data.eventDate).format('YYYY-MM-DD HH:mm');
			let sTime: any = moment(this.data.eventDate).format('HH:mm')

			let currentdate: any = moment(new Date()).format('YYYY-MM-DD HH:mm');
			let starttime: any = moment(new Date()).format('HH:mm')

			let currentdatetime: any = new Date(currentdate + ' ' + starttime);

			if (sDate < currentdate) {
				this.dateError = 'Time of start call should be greater than or equal current date time';
				this.hasFormErrors = true;
				this.ErrorMessage = this.dateError;
				// this.SalesCallBackTask.CallStartDateTime = moment(currentdatetime).format('YYYY-MM-DD HH:mm');
			}

			else {
				this.ClearErrorMessage();
				// this.SalesCallBackTask.CallStartDateTime = new Date(this.data.eventDate);
			}
			this.SalesCallBackTask.CallStartDateTime = new Date(this.data.eventDate);
			let endDateTime = moment(new Date(this.SalesCallBackTask.CallStartDateTime)).add(15, 'm').format('YYYY-MM-DD HH:mm');
			this.SalesCallBackTask.CallEndDateTime = new Date(endDateTime);
			this.isStatusDisable = true;
			this.AssignedToIdForAdding = this.UserId;
			this.callbackTaskStatusIdForAdding = 5;

		}
		else {

			this.SalesCallBackTask = new CalendarTask();
			this.isStatusDisable = false;
			this.SalesCallBackTask.Id = this.data.res.Id;
			this.SalesCallBackTask.Name = this.data.res.Name;
			this.SalesCallBackTask.FirstName = this.data.res.FirstName;
			this.SalesCallBackTask.LastName = this.data.res.LastName;
			this.SalesCallBackTask.SmartCardNo = this.data.res.SmartCardNo;
			this.SalesCallBackTask.SourceTicketId = this.data.res.SourceTicketId;
			this.SalesCallBackTask.Status = this.data.res.Status;
			this.callbackTaskStatusIdForAdding = this.data.res.Status;
			this.callBackTaskStatusSubject.next(this.data.res.Status);
			this.SalesCallBackTask.StatusName = this.data.StatusName;
			this.SalesCallBackTask.AltContactNo = this.data.res.AltContactNo;
			this.SalesCallBackTask.AssignedAgentFirstName = this.data.res.AssignedAgentFirstName;
			this.SalesCallBackTask.AssignedAgentLastName = this.data.res.AssignedAgentLastName;
			this.SalesCallBackTask.AssignedTo = this.data.res.AssignedTo;
			this.AssignedToIdForAdding = this.data.res.AssignedTo;
			this.AssignedToSubject.next(this.data.res.AssignedTo);
			this.SalesCallBackTask.CallStartDateTime = new Date(this.data.res.CallStartDateTime);
			this.SalesCallBackTask.CallEndDateTime = new Date(this.data.res.CallEndDateTime);
			this.SalesCallBackTask.Comments = this.data.res.Comments;
			this.SalesCallBackTask.CompletionDateTime = this.data.res.CompletionDateTime;
			this.SalesCallBackTask.CompletionTicketId = this.data.res.CompletionTicketId;
			this.SalesCallBackTask.ContactNo = this.data.res.ContactNo;
			this.SalesCallBackTask.CreatedBy = this.data.res.CreatedBy;
			this.SalesCallBackTask.CreatedDateTime = this.data.res.CreatedDateTime;
		}

		this.startCall = this.SalesCallBackTask.CallStartDateTime.toString();
		this.endCall = this.SalesCallBackTask.CallEndDateTime.toString();
		if (this.SalesCallBackTask.Id > 0) {
			this.auth.getAllSalesCallBackTaskActivity(this.SalesCallBackTask.Id).subscribe((_res: any) => {

				this.SalesCallBackTaskActivityList = _res;

				if (this.SalesCallBackTaskActivityList.length > 0) {
					this.SalesCallBackTaskActivityList$.next(this.SalesCallBackTaskActivityList);
				}
			});
		}
		this.auth.getAllSalesCallBackTaskUsers(this.RoleId).subscribe((res: SalesCallBackTaskUsers[]) => {
			each(res, (_user: SalesCallBackTaskUsers) => {
				this.allAssignedTousers.push(_user);
				this.unassignedusers.push(_user);

			});

			each([Number(this.AssignedToSubject.value.toString())], (id: number) => {
				const salescallbacktaskusers = find(this.allAssignedTousers, (_salescallbacktaskuserid: SalesCallBackTaskUsers) => {
					return _salescallbacktaskuserid.Id === id;
				});
				if (salescallbacktaskusers) {
					this.assignedusers.push(salescallbacktaskusers);
					remove(this.unassignedusers, salescallbacktaskusers);
				}
			});
		});
		this.auth.getAllSalesCallBackTaskStatus().subscribe((res: SalesCallBackTaskStatus[]) => {
			each(res, (_Status: SalesCallBackTaskStatus) => {
				this.allSalesCallBackTaskStatus.push(_Status);
				this.unassignedCallBackTaskStatus.push(_Status);
			});

			each([Number(this.callBackTaskStatusSubject.value.toString())], (id: number) => {

				const salescallbacktaskstatus = find(this.allSalesCallBackTaskStatus, (_salescallbacktaskstatusId: SalesCallBackTaskStatus) => {
					return _salescallbacktaskstatusId.Id === id;
				});
				if (salescallbacktaskstatus) {
					this.assignedCallBackTaskStatus.push(salescallbacktaskstatus);
					remove(this.unassignedCallBackTaskStatus, salescallbacktaskstatus);
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
	 * Returns salescallbacktask for save
	 */
	preparesalescallbacktask(): CalendarTask {
		//let SelectData:any;

		const _salescallbacktask = new CalendarTask();
		if (this.SalesCallBackTask.Id > 0)
			_salescallbacktask.Id = this.SalesCallBackTask.Id;
		else
			_salescallbacktask.Id = 0;
		_salescallbacktask.Name = this.SalesCallBackTask.Name;
		_salescallbacktask.FirstName = this.SalesCallBackTask.FirstName;
		_salescallbacktask.LastName = this.SalesCallBackTask.LastName;
		_salescallbacktask.SmartCardNo = this.SalesCallBackTask.SmartCardNo;
		_salescallbacktask.SourceTicketId = this.SalesCallBackTask.SourceTicketId;
		_salescallbacktask.Status = this.callbackTaskStatusIdForAdding;
		_salescallbacktask.AltContactNo = this.SalesCallBackTask.AltContactNo;
		_salescallbacktask.AssignedAgentFirstName = this.SalesCallBackTask.AssignedAgentFirstName;
		_salescallbacktask.AssignedAgentLastName = this.SalesCallBackTask.AssignedAgentLastName;
		// if(this.RoleId)

		if (this.isSupervisor == true)
			_salescallbacktask.AssignedTo = this.AssignedToIdForAdding;
		else
			_salescallbacktask.AssignedTo = this.UserId;

		_salescallbacktask.CallStartDateTime = moment(new Date(this.SalesCallBackTask.CallStartDateTime)).format('YYYY-MM-DD HH:mm');
		_salescallbacktask.CallEndDateTime = moment(new Date(this.SalesCallBackTask.CallEndDateTime)).format('YYYY-MM-DD HH:mm');
		_salescallbacktask.Comments = this.SalesCallBackTask.Comments;
		_salescallbacktask.CompletionDateTime = this.SalesCallBackTask.CompletionDateTime;
		_salescallbacktask.CompletionTicketId = this.SalesCallBackTask.CompletionTicketId;
		_salescallbacktask.ContactNo = this.SalesCallBackTask.ContactNo;
		_salescallbacktask.CreatedBy = this.UserId;
		_salescallbacktask.CreatedDateTime = this.SalesCallBackTask.CreatedDateTime;

		return _salescallbacktask;
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
		const editedsalescallbacktask = this.preparesalescallbacktask();
		if (editedsalescallbacktask.Id > 0) {
			if (editedsalescallbacktask.Status == 3 && (editedsalescallbacktask.CompletionTicketId == undefined || editedsalescallbacktask.CompletionTicketId == '')) {
				this.dateError = 'Please enter completion ticket id';
				this.hasFormErrors = true;
				this.ErrorMessage = this.dateError;

			}
			else
				this.updatesalescallbacktask(editedsalescallbacktask);
		} else {
			
			let sDate = moment(this.SalesCallBackTask.CallStartDateTime).format('YYYY-MM-DD HH:mm');
			let eDate = moment(this.SalesCallBackTask.CallEndDateTime).format('YYYY-MM-DD HH:mm');

			let sTime: any = moment(this.SalesCallBackTask.CallStartDateTime).format('HH:mm')
			let eTime: any = moment(this.SalesCallBackTask.CallEndDateTime).format('HH:mm');

			let currentdate: any = moment(new Date()).format('YYYY-MM-DD HH:mm');
			if (sDate < currentdate) {
				this.dateError = 'Time of start call should be greater than or equal current date time';
				this.hasFormErrors = true;
				this.ErrorMessage = this.dateError;

			}
			else if (eDate < sDate) {
				this.dateError = 'Time of end call should be greater than start call date time';
				this.hasFormErrors = true;
				this.ErrorMessage = this.dateError;

			}
			else {
				this.ClearErrorMessage();
				this.createsalescallbacktask(editedsalescallbacktask);
			}
		}
	}

	ClearErrorMessage() {
		this.dateError = '';
		this.hasFormErrors = false;
		this.ErrorMessage = this.dateError;
	}
	/**
	 * Update salescallbacktask
	 *
	 * @param _salescallbacktask: salescallbacktask
	 */
	updatesalescallbacktask(_salescallbacktask: CalendarTask) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCalendarTask(_salescallbacktask).subscribe(data => {
			console.log('Updatesalescallbacktask Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_salescallbacktask,
					isEdit: true,
					result: data
				});
			});
		});// Remove this line
	}

	/**
	 * Create salescallbacktask
	 *
	 * @param _salescallbacktask: salescallbacktask
	 */
	createsalescallbacktask(_salescallbacktask: CalendarTask) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCalendarTask(_salescallbacktask).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_salescallbacktask,
				isEdit: false,
				result: data
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

	letterOnly(event): Boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if ((charCode < 58 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode < 32 || charCode > 47)) {
			return false;
		}
		return true;
	}

	onPaste(event: ClipboardEvent) {

		event.preventDefault();
		let clipboardData = event.clipboardData;
		let pastedText = clipboardData.getData('text');
		let actualcomments = this.SalesCallBackTask.Comments;
		// let trimmedText = pastedText.replace(/[^0-9]/g, '');
		let trimmedText = pastedText.toString().replace(/\d+/g, '');
		this.SalesCallBackTask.Comments = actualcomments + trimmedText;
	}

	calculateTimeofEndcall(timeofstartcall) {

		let endcall: string;
		endcall = moment(new Date(timeofstartcall)).add(15, 'm').format('YYYY-MM-DD HH:mm');
		this.SalesCallBackTask.CallEndDateTime = new Date(endcall);
		this.DateTimeValidation();


		if (this.SalesCallBackTask.CallStartDateTime)
			this.startCall = this.SalesCallBackTask.CallStartDateTime;
		else
			this.startCall = '';
		if (this.SalesCallBackTask.CallEndDateTime)
			this.endCall = this.SalesCallBackTask.CallEndDateTime;
		else
			this.endCall = '';
	}

	DateTimeValidation() {
		
		let sDate = moment(this.SalesCallBackTask.CallStartDateTime).format('YYYY-MM-DD HH:mm');
		let eDate = moment(this.SalesCallBackTask.CallEndDateTime).format('YYYY-MM-DD HH:mm');

		let sTime: any = moment(this.SalesCallBackTask.CallStartDateTime).format('HH:mm')
		let eTime: any = moment(this.SalesCallBackTask.CallEndDateTime).format('HH:mm');

		let currentdate: any = moment(new Date()).format('YYYY-MM-DD HH:mm');


		if (sDate < currentdate) {
			this.dateError = 'Time of start call should be greater than or equal current date time';
			this.hasFormErrors = true;
			this.ErrorMessage = this.dateError;
		}
		else if (eDate < sDate) {
			this.dateError = 'Time of end call should be greater than start call date time';
			this.hasFormErrors = true;
			this.ErrorMessage = this.dateError;

		}
		else {
			this.ClearErrorMessage();
		}

	}
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.SalesCallBackTask && this.SalesCallBackTask.Id && this.isVieworEditflag == 'edit') {
			// tslint:disable-next-line:no-string-throw
			return `Edit Sales Call Back Task - ${this.SalesCallBackTask.Id}`;
		}
		else if (this.SalesCallBackTask && this.SalesCallBackTask.Id && this.isVieworEditflag == 'view') {
			return `View Sales Call Back Task - ${this.SalesCallBackTask.Id}`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'Add Sales Call Back Task';
	}
	showCompletionTicketId(status) {

		if (status == 3)
			this.isShowCompletionTickerId = true;
		else {
			this.isShowCompletionTickerId = false;
			this.SalesCallBackTask.CompletionTicketId = '';
		}
		this.ClearErrorMessage();
	}
	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.SalesCallBackTask
			&& this.SalesCallBackTask.Name && this.SalesCallBackTask.Name.length > 0
			&& this.SalesCallBackTask.ContactNo && this.SalesCallBackTask.ContactNo.length > 0
			&& this.SalesCallBackTask.Comments && this.SalesCallBackTask.Comments.length > 0
			//&& this.startCall.toString().length > 0
			//&& this.endCall.toString().length > 0
		);
	}
}
