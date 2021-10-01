import { AfterViewInit, AfterViewChecked } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Models

import { SubheaderService } from '../../../../../core/_base/layout';
import { ActionTrackersDataSource } from '../../../../../core/auth/_data-sources/actiontracker.datasource';
import { ActionTracker } from '../../../../../core/auth/_models/actiontracker.model';
import { ActionTrackersPageRequested, ActionTrackerDeleted } from '../../../../../core/auth/_actions/actiontracker.actions';

@Component({
  selector: 'kt-actiontrackerlist',
  templateUrl: './actiontrackerlist.component.html',
  styleUrls: ['./actiontrackerlist.component.scss']
})
export class ActiontrackerlistComponent implements OnInit, OnDestroy  {
	// Table fields
	dataSource: ActionTrackersDataSource;
	displayedColumns = ['id', 'name', 'description', 'organization','comments','createdby'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<ActionTracker>(true, []);
	actiontrackersResult: ActionTracker[] = [];
	UserID: number;
	//isAddPermission:boolean = false;

	public viewFlag: Boolean = true;
	public addFlag: Boolean = true;
	public editFlag: Boolean = true;
	public deleteFlag: Boolean = true;
	public isAddPermission: Boolean = true;
	public activateactiontrackerFlag: Boolean = true;
	public deactivateactiontrackerFlag: Boolean = true;
	// Subscriptions
	private subscriptions: Subscription[] = [];


	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef, public dialog: MatDialog) {

			if (localStorage.hasOwnProperty('Action Tracker')) {
				let value = localStorage.getItem('Action Tracker');
				for (let i = 0; i < value.toString().split(',').length; i++) {
		  
				  var permissionName = value.toString().split(',')[i].toLowerCase().trim();
				  if (permissionName == "add")
					this.addFlag = false;
				  else if (permissionName == "edit")
					this.editFlag = false;
				  else if (permissionName == "delete")
					this.deleteFlag = false;
				  else if (permissionName == "view")
					this.viewFlag = false;
				else if (permissionName == "actiontrackerapprover")
					this.isAddPermission = false;
				   
				}
				console.log('Activity Menu Permission:::' + value);
			  }

			if (localStorage.hasOwnProperty("currentUser")) {				
				this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
			}
			
			 
		 }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {

		//Load Permission
		

		  

		
	
		// load roles list
		// const rolesSubscription = this.store.pipe(select(selectAllRoles)).subscribe(res => this.allRoles = res);
		// this.subscriptions.push(rolesSubscription);

		// If the actiontracker changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadactiontrackersList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(150), // The actiontracker can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadactiontrackersList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Action Tracker');

		// Init DataSource
		
		this.dataSource = new ActionTrackersDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.actiontrackersResult = res;
			//console.log('actiontracker Collection::::' + this.actiontrackersResult);
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadactiontrackersList();
		});
	}
	

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load actiontrackers list
	 */
	loadactiontrackersList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.store.dispatch(new ActionTrackersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		//alert('filter');
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.id = searchText;
		filter.name = searchText;
		filter.description = searchText;
		filter.organization = searchText;
		//console.log('Filter Values::'+ searchText);		
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete actiontracker
	 *
	 * @param _item: actiontracker
	 */
	deleteactiontracker(_item: ActionTracker) {
		const _title: string = 'actiontracker Delete';
		const _description: string = 'Are you sure to permanently delete this actiontracker?';
		const _waitDesciption: string = 'actiontracker is deleting...';
		const _deleteMessage = `actiontracker has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new ActionTrackerDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}


	/**
	 * Activate actiontracker
	 *
	 * @param actiontracker: actiontracker
	 */
	// activateactiontracker(id) {		
	// 	const _saveMessage = `actiontracker successfully has been saved.`;
	// 	const _messageType = id ? MessageType.Update : MessageType.Create;
	// 	const dialogRef = this.dialog.open(actiontrackeractivateComponent, { data: { activateactiontrackerid: id } });		
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}
	// 		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
	// 		this.loadactiontrackersList();
	// 	});
	// }

		/**
	 * Activate actiontracker
	 *
	 * @param actiontracker: actiontracker
	 */
	// deactivateactiontracker(id) {		
	// 	const _saveMessage = `actiontracker successfully has been saved.`;
	// 	const _messageType = id ? MessageType.Update : MessageType.Create;
	// 	const dialogRef = this.dialog.open(actiontrackerdeactivateComponent, { data: { activateactiontrackerid: id } });		
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}
	// 		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
	// 		this.loadactiontrackersList();
	// 	});
	// }


	/**
	 * Fetch selected rows
	 */
	fetchactiontrackers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.name},${elem.description},${elem.orgid}, ${elem.comments}`,
				id: elem.id.toString(),
				status: elem.name
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.actiontrackersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.actiontrackersResult.length) {
			this.selection.clear();
		} else {
			this.actiontrackersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns actiontracker roles string
	 *
	 * @param actiontracker: actiontracker
	 */


	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editactiontracker(id) {
		this.router.navigate(['../actiontracker/edit', id+"-"+"edit"], { relativeTo: this.activatedRoute });
	}
	viewactiontracker(id) {
		this.router.navigate(['../actiontracker/edit', id+"-"+"view"], { relativeTo: this.activatedRoute });
	}
}
