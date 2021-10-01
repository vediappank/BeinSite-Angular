// Angular
import { Component, OnInit,Output,EventEmitter, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
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

// Services and Models
// import {
// 	CCKpi,
// 	Permission,
// 	selectCCKpiById
// } from '../../../../../core/auth';
import { delay } from 'rxjs/operators';



import { AuthService, User } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { ActionTracker } from '../../../../../core/auth/_models/actiontracker.model';
import { selectActionTrackerById, selectActionTrackersActionLoading } from '../../../../../core/auth/_selectors/actiontracker.selectors';
import { debug } from 'console';

@Component({
	selector: 'kt-actiontrackeredit',
	templateUrl: './actiontrackeredit.component.html',
	styleUrls: ['./actiontrackeredit.component.scss']
})
export class ActiontrackereditComponent implements OnInit {
	actiontrackerid: number;

	actiontracker: ActionTracker;
	filterMenus: any;
	filterMenustring: any;
	CallCenterList: ActionTracker[];
	actiontracker$: Observable<ActionTracker>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	selectedTab: number = 0;
	// Roles	
	allcallcenters: any[] = [];
	unassignedcallcenters: any[] = [];
	assignedcallcenters: any[] = [];
	actiontrackerIdForAdding: number;
	actiontrackersSubject = new BehaviorSubject<number[]>([]);

	allOrganization: User[] = [];
	OrganizationIdForAdding: number;
	unassignedOrganization: User[] = [];
	assignedOrganization: User[] = [];
	OrganizationSubject = new BehaviorSubject<number[]>([]);
	public OrganizationList: User[];
	isshoworg: boolean = true;
	UserID: number;
	disable: boolean = true;
	paramids: any;
	vieweditflag: string;
	isAddPermission :boolean=false;
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray: any[] = [];
	public selectedPRArray: any[] = [];
	public paramactiontrackerid: number;
	public isEnableTopic: boolean = false;
	public TopicSelectedAgentList: string;
	public SelectedAgentList: string;
	@Output() AgentSelectedList: EventEmitter<any> = new EventEmitter<any>();
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<actiontrackerEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(private activatedRoute: ActivatedRoute, private router: Router,
		// @Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		if (localStorage.hasOwnProperty("currentUser")) {
			this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
			
		}
	}


	/**
	 * On init
	 */
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectActionTrackersActionLoading));

		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			this.paramids = params['id'];
			this.paramactiontrackerid = this.paramids.toString().split('-')[0];
			this.vieweditflag = this.paramids.toString().split('-')[1];
		});
		
		// if (this.paramactiontrackerid && this.vieweditflag == "edit")
		// 	this.isEnableTopic = true;
		if (this.paramactiontrackerid && this.vieweditflag == "view")
			this.isEnableTopic = false;
		else
			this.isEnableTopic = true;

		if (this.paramactiontrackerid) {
			this.actiontracker$ = this.store.pipe(select(selectActionTrackerById(this.paramactiontrackerid)));
		} else {
			const newactiontracker = new ActionTracker();
			newactiontracker.clear();
			this.actiontracker$ = of(newactiontracker);
		}

		this.actiontracker$.subscribe(res => {
			if (!res) {
				return;
			}
			this.actiontracker = new ActionTracker();
			this.actiontracker.id = res.id;
			if (this.actiontracker.id > 0)
				this.isshoworg = false;
			this.actiontracker.name = res.name;
			this.actiontracker.description = res.description;
			this.actiontracker.userorganizationname = res.userorganizationname;
			this.actiontracker.comments = res.comments;
			this.actiontracker.cname = res.cname;
			this.actiontracker.SelectedAgentList = JSON.parse("[" + res.SelectedAgentList + "]");
			this.TopicSelectedAgentList =JSON.parse("[" + res.SelectedAgentList + "]");
			this.actiontracker.orgid = res.orgid;
			this.OrganizationIdForAdding = res.orgid;
			this.OrganizationSubject.next(res.orgids);

			//alert(this.actiontracker.isCoreactiontracker);
		});
		//Organization

		this.auth.GetAllOrganizationsByAgentRole(this.UserID).subscribe((_resOrganization: User[]) => {
			each(_resOrganization, (_Organization: User) => {
				this.allOrganization.push(_Organization);
				this.unassignedOrganization.push(_Organization);
			});
			this.OrganizationList = _resOrganization;
			// each([Number(this.OrganizationSubject.value.toString())], (_OrganizationId: number) => {
			// 	const _Organization = find(this.allOrganization, (_Organization: User) => {
			// 		return _Organization.orgid === _OrganizationId;
			// 	});
			// 	if (_Organization) {
			// 		this.assignedOrganization.push(_Organization);
			// 		remove(this.unassignedOrganization, _Organization);
			// 	}
			// });

		});

		// this.getAllOrganisations();
	}
	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}
	onOrgChange(OrganizationIdForAdding){
		this.OrganizationIdForAdding=OrganizationIdForAdding;
	}
	/**
	 * Returns actiontracker for save
	 */
	prepareactiontracker(): ActionTracker {
		//let SelectData:any;
		//SelectData = this.mainmenufromArray;
		const _actiontracker = new ActionTracker();
		if (this.actiontrackerIdForAdding != undefined)
			_actiontracker.id = this.actiontrackerIdForAdding;
		else
			_actiontracker.id = Number(this.actiontrackersSubject.value);
		_actiontracker.id = this.actiontracker.id;

		if (this.OrganizationIdForAdding != undefined)
			_actiontracker.orgid = Number(this.OrganizationIdForAdding);
		else
			_actiontracker.orgid = Number(this.OrganizationSubject.value);
			_actiontracker.SelectedAgentList = this.SelectedAgentList.toString();
			console.log("SelectedAgentList ::::" + this.SelectedAgentList.toString());
		_actiontracker.name = this.actiontracker.name;
		_actiontracker.description = this.actiontracker.description;

		_actiontracker.comments = this.actiontracker.comments;
		_actiontracker.cid = this.UserID;
		//_actiontracker.privilegeid = 3;
		return _actiontracker;
	}

	// getAllOrganisations() {
	// 	//DropDown Ativity		
	// 	this.auth.GetAllOrganizations().subscribe((_org: User[]) => {
			
	// 		this.OrganizationList = _org;
	// 	});
	// }
	/**
	 * Save data
	 */
	onSubmit() {
		//
		
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		this.selectedTab = 0;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedactiontracker = this.prepareactiontracker();
		if (editedactiontracker.id > 0) {
			this.updateactiontracker(editedactiontracker);
		} else {
			this.createactiontracker(editedactiontracker);
		}
	}

	/**
	 * Update actiontracker
	 *
	 * @param _actiontracker: actiontracker
	 */
	goBackWithId() {
		const url = `/operations/actiontracker`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	getAgentSelectedList($event) {
		
		if($event != undefined)
		{
		this.SelectedAgentList = $event;
		console.log('AgentSelectedList on action Tracker Update Page ::' + JSON.stringify(this.SelectedAgentList));
		}
	  }
	updateactiontracker(_actiontracker: ActionTracker) {
		
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateActionTracker(_actiontracker).subscribe(data => {
			console.log('UpdateActionTracker Data received: ' + data);
			

			if (data == "SUCCESS") {
				this.goBackWithId();
			}

		});// Remove this line
	}

	/**
	 * Create actiontracker
	 *
	 * @param _actiontracker: actiontracker
	 */
	createactiontracker(_actiontracker: ActionTracker) {
		
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createActionTracker(_actiontracker).subscribe(data => {
			
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			if (data == "SUCCESS") {
				this.goBackWithId();
			} 0
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



	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.actiontracker && this.actiontracker.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit ActionTracker '${this.actiontracker.name}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Actiontracker';
	}
	getComponentTitle() {
		let title: string = "Action Tracker";
		return title;
	}
	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.actiontracker && this.actiontracker.name.length > 0);
	}
}
