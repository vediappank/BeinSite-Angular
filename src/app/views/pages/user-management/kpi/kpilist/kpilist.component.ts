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
import { CCKpi, CCKpisDataSource, CCKpiDeleted,CCKpisPageRequested   } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { KpieditComponent } from '../kpiedit/kpiedit.component';
import { AuthService } from '../../../../../core/auth';


@Component({
  selector: 'kt-kpilist',
  templateUrl: './kpilist.component.html',
  styleUrls: ['./kpilist.component.scss'],  
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpilistComponent implements OnInit {
// Table fields
dataSource: CCKpisDataSource;
displayedColumns = ['select', 'Kpi_ID', 'CallCenter_Name','KPI_Name','KPI_Thresold','KPI_Min_Thresold','KPI_Max_Thresold', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
// Selection
selection = new SelectionModel<CCKpi>(true, []);
kpisResult: CCKpi[] = [];
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
    //alert(localStorage.getItem('Call Center Kpis'));
    let value = localStorage.getItem('CCKPI');				
    switch (value) {
			case "NONE": {
				this.addFlag = this.viewFlag = this.deleteFlag = this.editFlag = true;
				break;
			}
			case "View".toUpperCase(): {
				this.viewFlag = false;
				break;
			}
			case "ViewEdit".toUpperCase(): {
				this.viewFlag = this.editFlag = false;
				break;
			}
			case "ViewEditDelete".toUpperCase(): {
				this.viewFlag = this.deleteFlag = this.editFlag = false;
				break;
			}
			case "ViewEditAdd".toUpperCase(): {
				this.addFlag = this.editFlag = this.editFlag = false;
				break;
			}
			case "ViewEditAddDelete".toUpperCase(): {
				this.addFlag = this.viewFlag = this.deleteFlag = this.editFlag = false;
				break;
			}

		} 
        console.log('Kpi Menu Permission:::'+ value);
    

  // If the user changes the sort order, reset back to the first page.
  const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  this.subscriptions.push(sortSubscription);

  /* Data load will be triggered in two cases:
  - when a pagination event occurs => this.paginator.page
  - when a sort event occurs => this.sort.sortChange
  **/
  const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
    tap(() => {
      this.loadKpisList();
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
      this.loadKpisList();
    })
  )
  .subscribe();
  this.subscriptions.push(searchSubscription);

  // Init DataSource
  //
  this.dataSource = new CCKpisDataSource(this.store);
  
  const entitiesSubscription = this.dataSource.entitySubject.pipe(
    skip(1),
    distinctUntilChanged()
  ).subscribe(res => {	
   		
    this.kpisResult = res;
  });
  this.subscriptions.push(entitiesSubscription);

  // First load
  of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
    this.loadKpisList();
  });
  
}

/**
 * On Destroy
 */
ngOnDestroy() {
  this.subscriptions.forEach(el => el.unsubscribe());
}

/**
 * Load Kpis List
 */
loadKpisList() {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new CCKpisPageRequested({ page: queryParams }));
  this.selection.clear();
}

/**
 * Returns object for filter
 */
filterConfiguration(): any {
  const filter: any = {};
  const searchText: string = this.searchInput.nativeElement.value;
  filter.Kpi_ID = searchText;
  filter.CallCenter_Name = searchText;
  filter.KPI_Name = searchText;
  filter.KPI_Thresold = searchText;
  filter.KPI_Min_Thresold = searchText;
  filter.KPI_Max_Thresold = searchText;
  return filter;
}

/** ACTIONS */
/**
 * Delete Kpi
 *
 * @param _item: Kpi
 */
deleteKpi(_item: CCKpi) {
  //
  const _title: string = 'Kpi Delete Confirmation?';
  const _description: string = 'Are you sure to permanently delete this Kpi?';
  const _waitDesciption: string = 'Kpi is deleting...';
  const _deleteMessage = `Kpi has been deleted`;

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }
    else
    {
      this.auth.deleteCCKpi(_item.id).subscribe(data => {
        console.log('Kpi Deteleted conformationreceived: ' + data)				
        this.store.dispatch(new CCKpiDeleted({ Kpi_ID: _item.id}));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadKpisList();
      });
      
    }
    
  });
}

/** Fetch */
/**
 * Fetch selected rows
 */
fetchKpis() {
  const messages = [];
  this.selection.selected.forEach(elem => {
    messages.push({
      text: `${elem.CallCenter_Name},${elem.KPI_Name},${elem.KPI_Thresold}`,
      id: elem.id.toString(),      
    });
  });
  this.layoutUtilsService.fetchElements(messages);
}

/**
 * Add Kpi
 */
addKpi() {
  const newKpi = new CCKpi();
  newKpi.clear(); // Set all defaults fields
  this.editKpi(newKpi);
}

/**
 * Edit Kpi
 *
 * @param Kpi: Kpi
 */
editKpi(kpi: CCKpi) {
  const _saveMessage = `Kpi successfully has been saved.`;
  const _messageType = kpi.id ? MessageType.Update : MessageType.Create;
  const dialogRef = this.dialog.open(KpieditComponent, { data: { id: kpi.id } });
  dialogRef.afterClosed().subscribe(res => {
    
    if (!res) {
      return;
    }

    this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
    this.loadKpisList();
  });
}

/**
 * Check all rows are selected
 */
isAllSelected(): boolean {
  const numSelected = this.selection.selected.length;
  const numRows = this.kpisResult.length;
  return numSelected === numRows;
}

/**
 * Toggle selection
 */
masterToggle() {
  if (this.selection.selected.length === this.kpisResult.length) {
    this.selection.clear();
  } else {
    this.kpisResult.forEach(row => this.selection.select(row));
  }
}
}
