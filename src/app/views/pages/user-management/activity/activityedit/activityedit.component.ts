// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';


// State
import { AppState } from '../../../../../core/reducers';

// Services and Models
import {	CCActivity,	selectActivityById} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';


@Component({
  selector: 'kt-activityedit',
  templateUrl: './activityedit.component.html',
  styleUrls: ['./activityedit.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActivityeditComponent implements OnInit {

	activity: CCActivity;
	activity$: Observable<CCActivity>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ActivityeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<ActivityeditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
	}

	/**
	 * On init
	 */
	ngOnInit() {		
		if (this.data.id) {			
			this.activity$ = this.store.pipe(select(selectActivityById(this.data.id)));			
		} else {
			
			const newActivity = new CCActivity();
			newActivity.clear();
			this.activity$ = of(newActivity);
		}

		this.activity$.subscribe(res => {
			if (!res) {
				return;
			}
			this.activity = new CCActivity();
			this.activity.id = res.id;
			this.activity.name = res.name;
			this.activity.description = res.description;					
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
	 * Returns Activity for save
	 */
	prepareActivity(): CCActivity {
		//let SelectData:any;
		//SelectData = this.mainmenufromArray;
		const _activiyy = new CCActivity();
		_activiyy.id = this.activity.id;
		_activiyy.name = this.activity.name;
		_activiyy.description = this.activity.description;		
		return _activiyy;
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
		const editedactivity = this.prepareActivity();
		if (editedactivity.id > 0) {
			this.updateActivity(editedactivity);
		} else {
			this.createActivity(editedactivity);
		}
	}

	/**
	 * Update Activity
	 *
	 * @param _Activity: Activity
	 */
	updateActivity(_activity: CCActivity) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCCActivity(_activity).subscribe(data => {
			console.log('UpdateActivity Data received: ' + data)
		
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_activity,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Activity
	 *
	 * @param _activity: Activity
	 */
	createActivity(_activity: CCActivity) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCCActivity(_activity).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_activity,
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
		if (this.activity && this.activity.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Activity '${this.activity.name}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Activity';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.activity && this.activity.name && this.activity.name.length > 0);
	}

	

}
