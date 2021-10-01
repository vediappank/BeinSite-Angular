
// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';

// State
import { AppState } from '../../../../../core/reducers';

// Services and Models
import {
	CallCenter,
	Permission,
	selectCallCenterById
} from '../../../../../core/auth';


//START MAT TREE 

import { privilege } from '../../../../../core/auth/_models/privilege.model'
import { CallCentersDataSource, CallCenterDeleted,CallCentersPageRequested   } from '../../../../../core/auth';
import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
@Component({
  selector: 'kt-callcenter-edit',
  templateUrl: './callcenter-edit.component.html',
  styleUrls: ['./callcenter-edit.component.scss']
})
export class CallcenterEditComponent implements OnInit {
	SelectedRoleList: string;

	CallCentersResult: CallCenter[] = [];
	dataSource: CallCentersDataSource;	
  mainmenufromArray: Array<Permission> = [];
	mainmenuPriviegefromArrays: Array<any> = [];
	menuCollection: Array<any> = [];
	privilegeCollection: Array<privilege> = [];
	callcenter: CallCenter;
	filterMenus: any;
	filterMenustring: any;
	callcenter$: Observable<CallCenter>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	allPermissions$: Observable<Permission[]>;
	CallCenterPermissions: Permission[] = [];
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray:any[]=[];
	public selectedPRArray:any[]=[];
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<CallCenterEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<CallcenterEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.data.Id) {
			this.callcenter = new CallCenter();
			this.callcenter.cc_id = this.data.Id.cc_id;
			this.callcenter.cc_name = this.data.Id.cc_name;
			this.callcenter.cc_shortname = this.data.Id.cc_shortname;
			
			this.callcenter.selectedRoles = this.data.Id.selectedRoles;
			//alert(this.callcenter.selectedRoles);
			if(this.data.Id.isactive =='Y')
				this.callcenter.isactive = true;
			else
				this.callcenter.isactive = false;

		} else {
			const newCallCenter = new CallCenter();
			newCallCenter.clear();
		}		
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
	 * Returns CallCenter for save
	 */
	prepareCallCenter(): CallCenter {	
		const _CallCenter = new CallCenter();
		_CallCenter.cc_id = this.callcenter.cc_id;
		_CallCenter.cc_name = this.callcenter.cc_name;
		_CallCenter.cc_shortname = this.callcenter.cc_shortname;	
		_CallCenter.isactive = this.callcenter.isactive;
		_CallCenter.selectedRoles = this.SelectedRoleList;	
		return _CallCenter;
	}

	/**
	 * Save data
	 */
	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedCallCenter = this.prepareCallCenter();
		if (editedCallCenter.cc_id > 0) {
			this.updateCallCenter(editedCallCenter);
		} else {
			this.createCallCenter(editedCallCenter);
		}
	}

	/**
	 * Update CallCenter
	 *
	 * @param _CallCenter: CallCenter
	 */
	updateCallCenter(_CallCenter: CallCenter) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCallCenter(_CallCenter).subscribe(data => {
			console.log('UpdateCallCenter Data received: ' + data)
			this.selectedMMArray=[];
			this.selectedPRArray=[];
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_CallCenter,
					isEdit: true
				});
			});
		});// Remove this line
	}

	getRoleSelectedList($event) {
		this.SelectedRoleList = $event;
		//alert(JSON.stringify(this.SelectedRoleList));
		console.log('AgentSelectedList on Meeting Update Page ::' + JSON.stringify(this.SelectedRoleList));
	  }

	/**
	 * Create CallCenter
	 *
	 * @param _CallCenter: CallCenter
	 */
	createCallCenter(_CallCenter: CallCenter) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCallCenter(_CallCenter).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_CallCenter,
				isEdit: false
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



	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.callcenter && this.callcenter.cc_id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Call Center '${this.callcenter.cc_name}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Call Center';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.callcenter && this.callcenter.cc_name && this.callcenter.cc_shortname.length > 0);
	}

	

}


