
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
import { CallCenter, CallCentersDataSource, CallCenterDeleted,CallCentersPageRequested   } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { CallcenterEditComponent } from '../callcenter-edit/callcenter-edit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-callcenter-list',
  templateUrl: './callcenter-list.component.html',
  styleUrls: ['./callcenter-list.component.scss']
})
export class CallcenterListComponent implements OnInit {

 // Table fields
 dataSource: CallCentersDataSource;
 displayedColumns = ['select', 'cc_id', 'CallCenterName','CallCenterShortName','isactive', 'actions'];
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 @ViewChild('sort1', {static: true}) sort: MatSort;
 // Filter fields
 @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
 // Selection
 selection = new SelectionModel<CallCenter>(true, []);
 CallCentersResult: CallCenter[] = [];
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
   private layoutUtilsService: LayoutUtilsService,public auth: AuthService) {
   }
 /**
  * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
  */

 /**
  * On init
  */
 ngOnInit() {		
     //PageWisePermission
     
     let value = localStorage.getItem('Call Center');	
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
         console.log('Call Centre Menu Permission:::'+ value);
     
 
   // If the user changes the sort order, reset back to the first page.
   const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
   this.subscriptions.push(sortSubscription);

   /* Data load will be triggered in two cases:
   - when a pagination event occurs => this.paginator.page
   - when a sort event occurs => this.sort.sortChange
   **/
   const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
     tap(() => {
       this.loadCallCentersList();
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
       this.loadCallCentersList();
     })
   )
   .subscribe();
   this.subscriptions.push(searchSubscription);

   // Init DataSource
   //
   this.dataSource = new CallCentersDataSource(this.store);
   
   const entitiesSubscription = this.dataSource.entitySubject.pipe(
     skip(1),
     distinctUntilChanged()
   ).subscribe(res => {	     	
     this.CallCentersResult = res;
   });
   this.subscriptions.push(entitiesSubscription);

   // First load
   of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
     this.loadCallCentersList();
   });
   
 }

 /**
  * On Destroy
  */
 ngOnDestroy() {
   this.subscriptions.forEach(el => el.unsubscribe());
 }

 /**
  * Load CallCenters List
  */
 loadCallCentersList() {
   this.selection.clear();
   const queryParams = new QueryParamsModel(
     this.filterConfiguration(),
     this.sort.direction,
     this.sort.active,
     this.paginator.pageIndex,
     this.paginator.pageSize
   );
   // Call request from server
   this.store.dispatch(new CallCentersPageRequested({ page: queryParams }));
   this.selection.clear();
 }

 /**
  * Returns object for filter
  */
 filterConfiguration(): any {
   const filter: any = {};
   const searchText: string = this.searchInput.nativeElement.value;
   filter.cc_id = searchText;
   filter.cc_name = searchText;
   filter.cc_shortname = searchText;
   return filter;
 }

 /** ACTIONS */
 /**
  * Delete CallCenter
  *
  * @param _item: CallCenter
  */
 deleteCallCenter(_item: CallCenter) {
   //
   const _title: string = 'CallCenter Delete Confirmation?';
   const _description: string = 'Are you sure to permanently delete this CallCenter?';
   const _waitDesciption: string = 'CallCenter is deleting...';
   const _deleteMessage = `CallCenter has been deleted`;

   const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
   dialogRef.afterClosed().subscribe(res => {
     if (!res) {
       return;
     }
     else
     {
       this.auth.deleteCallCenter(_item.cc_id).subscribe(data => {
         console.log('CallCenter Deteleted conformationreceived: ' + data)				
         this.store.dispatch(new CallCenterDeleted({ cc_id: _item.cc_id}));
         this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
         this.loadCallCentersList();
       });
       
     }
     
   });
 }

 /** Fetch */
 /**
  * Fetch selected rows
  */
 fetchCallCenters() {
   const messages = [];
   this.selection.selected.forEach(elem => {
     messages.push({
       text: `${elem.cc_name},${elem.cc_shortname},${elem.cc_id}`,
       id: elem.cc_shortname.toString(),
       // status: elem.username
     });
   });
   this.layoutUtilsService.fetchElements(messages);
 }

 /**
  * Add CallCenter
  */
 addCallCenter() {
   const newCallCenter = new CallCenter();
   newCallCenter.clear(); // Set all defaults fields
   this.editCallCenter(newCallCenter);
 }

 /**
  * Edit CallCenter
  *
  * @param CallCenter: CallCenter
  */
 editCallCenter(CallCenter: CallCenter) {
   const _saveMessage = `CallCenter successfully has been saved.`;
   const _messageType = CallCenter.cc_id ? MessageType.Update : MessageType.Create;
   const dialogRef = this.dialog.open(CallcenterEditComponent, { data: { Id: CallCenter } });
   dialogRef.afterClosed().subscribe(res => {
     if (!res) {
       return;
     }

     this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
     this.loadCallCentersList();
   });
 }

 /**
  * Check all rows are selected
  */
 isAllSelected(): boolean {
   const numSelected = this.selection.selected.length;
   const numRows = this.CallCentersResult.length;
   return numSelected === numRows;
 }

 /**
  * Toggle selection
  */
 masterToggle() {
   if (this.selection.selected.length === this.CallCentersResult.length) {
     this.selection.clear();
   } else {
     this.CallCentersResult.forEach(row => this.selection.select(row));
   }
 }
}


