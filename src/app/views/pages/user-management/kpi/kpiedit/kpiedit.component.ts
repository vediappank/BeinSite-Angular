// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
import {
	CCKpi,
	Permission,
	selectCCKpiById
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';


@Component({
	selector: 'kt-kpiedit',
	templateUrl: './kpiedit.component.html',
	styleUrls: ['./kpiedit.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class KpieditComponent implements OnInit {


	kpi: CCKpi;
	filterMenus: any;
	filterMenustring: any;
	CallCenterList: CCKpi[];
	kpi$: Observable<CCKpi>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	allPermissions$: Observable<Permission[]>;
	kpiPermissions: Permission[] = [];

	// Roles	
	allcallcenters: any[] = [];
	unassignedcallcenters: any[] = [];
	assignedcallcenters: any[] = [];
	kpiIdForAdding: number;
	kpisSubject = new BehaviorSubject<number[]>([]);

	disable :boolean = true;
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray: any[] = [];
	public selectedPRArray: any[] = [];


	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<KpiEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<KpieditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
	}

	/**
	 * On init
	 */
	ngOnInit() {	
		if (this.data.id) {
			this.kpi$ = this.store.pipe(select(selectCCKpiById(this.data.id)));
		} else {

			const newKpi = new CCKpi();
			newKpi.clear();
			this.kpi$ = of(newKpi);
		}

		this.kpi$.subscribe(res => {
			if (!res) {
				return;
			}
			this.kpi = new CCKpi();
			this.kpi.id = res.id;
			this.kpi.KPI_Name = res.KPI_Name;
			this.kpi.KPI_Thresold = res.KPI_Thresold;
			this.kpi.KPI_Min_Thresold = res.KPI_Min_Thresold;
			this.kpi.KPI_Max_Thresold = res.KPI_Max_Thresold;
			this.kpisSubject.next(res.CallCenter_ID);
			//alert(this.kpi.isCoreKpi);
		});
		this.auth.GetAllCallCenters().subscribe((callcenter: any[]) => {
			each(callcenter, (_callcenter: any) => {
				this.allcallcenters.push(_callcenter);
				this.unassignedcallcenters.push(_callcenter);
			});
			each([Number(this.kpisSubject.value.toString())], (ccid: number) => {
				const kpi = find(this.allcallcenters, (_kpi: any) => {
					return _kpi.cc_id === ccid;
				});
				if (kpi) {
					this.assignedcallcenters.push(kpi);
					remove(this.unassignedcallcenters, kpi);
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
	 * Returns kpi for save
	 */
	prepareKpi(): CCKpi {
		//let SelectData:any;
		//SelectData = this.mainmenufromArray;
		const _kpi = new CCKpi();
		if (this.kpiIdForAdding != undefined)
			_kpi.callcenterid = this.kpiIdForAdding;
		else
			_kpi.callcenterid = Number(this.kpisSubject.value);
		_kpi.id = this.kpi.id;
		_kpi.KPI_Name = this.kpi.KPI_Name;
		_kpi.KPI_Thresold = this.kpi.KPI_Thresold;
		_kpi.KPI_Min_Thresold = this.kpi.KPI_Min_Thresold;
		_kpi.KPI_Max_Thresold = this.kpi.KPI_Max_Thresold;
		//_kpi.privilegeid = 3;
		return _kpi;
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
		const editedKpi = this.prepareKpi();
		if (editedKpi.id > 0) {
			this.updateKpi(editedKpi);
		} else {
			this.createKpi(editedKpi);
		}
	}

	/**
	 * Update kpi
	 *
	 * @param _kpi: Kpi
	 */
	updateKpi(_kpi: CCKpi) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCCkpi(_kpi).subscribe(data => {
			console.log('UpdateCCKpi Data received: ' + data)
			this.selectedMMArray = [];
			this.selectedPRArray = [];
			of(undefined).pipe(delay(500)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_kpi,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create kpi
	 *
	 * @param _kpi: Kpi
	 */
	createKpi(_kpi: CCKpi) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCCKpi(_kpi).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_kpi,
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
		if (this.kpi && this.kpi.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit CCKpi '${this.kpi.KPI_Name}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New CC Kpi';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.kpi && this.kpi.KPI_Name && this.kpi.KPI_Name.length > 0);
	}
}
