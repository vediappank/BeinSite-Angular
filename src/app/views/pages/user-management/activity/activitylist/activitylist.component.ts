// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
import { CCActivity, ActivitysDataSource, ActivityDeleted, ActivitysPageRequested  } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { ActivityeditComponent } from '../activityedit/activityedit.component';
import { AuthService } from '../../../../../core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-activitylist',
  templateUrl: './activitylist.component.html',
  styleUrls: ['./activitylist.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitylistComponent implements OnInit {
	// Table fields
	dataSource: ActivitysDataSource;
	displayedColumns = ['select', 'id', 'name','description', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	// Selection
	selection = new SelectionModel<CCActivity>(true, []);
	ActivitysResult: CCActivity[] = [];
	public viewFlag : Boolean =true; 
    public addFlag: Boolean =true;
    public editFlag: Boolean =true;
    public deleteFlag: Boolean =true;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param dialog: MatDialog
	 * @param snackBar: MatSnackBar
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private store: Store<AppState>,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		public auth: AuthService,
		private router: Router
		) {
		}
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		
			//PageWisePermission
			//alert(localStorage.getItem('Call Center Activitys'));
			let value = localStorage.getItem('Activities');				
			for(let i=0; i< value.toString().split(',').length; i++)		{
				var permissionName = value.toString().split(',')[i].toLowerCase();
				if (permissionName== "add")
					this.addFlag = false;
				else if (permissionName == "edit")
					this.editFlag = false;
				else if (permissionName == "delete")
					this.deleteFlag = false;
				else if (permissionName == "view")
					this.viewFlag = false;
				}
					console.log('Activity Menu Permission:::'+ value);
			
	
		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadActivitysList();
			})
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadActivitysList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
	
		this.dataSource = new ActivitysDataSource(this.store);
		
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {					
			this.ActivitysResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadActivitysList();
		});
		
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Activitys List
	 */
	loadActivitysList() {
	
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);		
	
		this.store.dispatch(new ActivitysPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.id = searchText;
		filter.name = searchText;
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Activity
	 *
	 * @param _item: Activity
	 */
	deleteActivity(_item: CCActivity) {
	
		const _title: string = 'Activity Delete Confirmation?';
		const _description: string = 'Are you sure to permanently delete this Activity?';
		const _waitDesciption: string = 'Activity is deleting...';
		const _deleteMessage = `Activity has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else
			{
				this.auth.deleteCCActivity(_item.id).subscribe(data => {
					console.log('Activity Deteleted conformationreceived: ' + data)				
					this.store.dispatch(new ActivityDeleted({ id: _item.id}));
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.loadActivitysList();
				});
			}			
		});
	}

	/** Fetch */
	/**
	 * Fetch selected rows
	 */
	fetchActivitys() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.name},${elem.description},${elem.id}`,
				id: elem.description.toString(),
				// status: elem.username
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Add Activity
	 */
	addActivity() {
		const newActivity = new CCActivity();
		newActivity.clear(); // Set all defaults fields
		this.editActivity(newActivity);
	}

	/**
	 * Edit Activity
	 *
	 * @param Activity: Activity
	 */
	editActivity(Activity: CCActivity) {
		const _saveMessage = `Activity successfully has been saved.`;
		const _messageType = Activity.id ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ActivityeditComponent, { data: { id: Activity.id } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			this.loadActivitysList();
		});
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.ActivitysResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.ActivitysResult.length) {
			this.selection.clear();
		} else {
			this.ActivitysResult.forEach(row => this.selection.select(row));
		}
	}
}
