import { AfterViewInit, AfterViewChecked } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, BehaviorSubject, of, Subscription } from 'rxjs';
// LODASH
import { each, find, round } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Models
import {
	User,
	Role,
	UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles, AuthService
} from '../../../../../core/auth';
import { SubheaderService } from '../../../../../core/_base/layout';
import { UseractivateComponent } from '../useractivate/useractivate.component';
import { UserdeactivateComponent } from '../userdeactivate/userdeactivate.component';
import { Sort } from '@angular/material/sort';

@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: UsersDataSource;
	displayedColumns = ['id', 'callcenter', 'lastname', 'firstname', 'userrolename', 'userccrolename', 'active_flag', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	// @ViewChild('searchInputCallCentre', { static: true }) searchInputCallCentre: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	allRoles: Role[] = [];
	UserList: User[]=[];
	public viewFlag: Boolean = true;
	public addFlag: Boolean = true;
	public editFlag: Boolean = true;
	public deleteFlag: Boolean = true;
	pagenumber: number = 1;
	pagesize: number = 15;
	public totalRecords: number;
	public UserList$ = new BehaviorSubject<User[]>(this.UserList);
	public activateuserFlag: Boolean = true;
	public deactivateuserFlag: Boolean = true;
	sortedData: User[];
	filterUserId: number = undefined;
	filterUserName: string;
	filterCallCenter: string;
	filterLastName: string;
	filterFirstName: string;
	filterRoles: string;
	filterCCRoles: string;
	filterStatus: string;
	public CallCenterList: any[];
	public CCRolesList: User[];
	public RolesList: any[];
	callcenterIdForAdding: string;
	roleIdForAdding: string;
	tempSelectedsRole: string;
	ccRoleIdForAdding: string;
	// Subscriptions
	private subscriptions: Subscription[] = [];


	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService, private auth: AuthService,
		private cdr: ChangeDetectorRef, public dialog: MatDialog) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {

		//Load Permission
		let value = localStorage.getItem('Users');
		for (let i = 0; i < value.toString().split(',').length; i++) {
			var permissionName = value.toString().split(',')[i].toLowerCase();
			if (permissionName == "add")
				this.addFlag = false;
			else if (permissionName == "edit")
				this.editFlag = false;
			else if (permissionName == "delete")
				this.deleteFlag = false;
			else if (permissionName == "view")
				this.viewFlag = false;
		}
		console.log('User Menu Permission:::' + value);
		this.getCallCenter();
		this.getAgentRoles();
		this.getAgentCCRoles();
		this.pagenumber = 1;
		this.pagesize = 15;
		setText('#lblCurrentPage', this.pagenumber);
		this.loadUsers(this.pagenumber, this.pagesize)

	}

	getCallCenter() {
		this.auth.GetAllCallCenters().subscribe((_callcenter: any[]) => {
			this.CallCenterList = _callcenter;
		});
	}

	searchByEnter(event){
		debugger
		if (event.keyCode === 13) {
			this.loadUsers(this.pagenumber,this.pagesize);
		  }
	}
	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}


	// Dynamic Sorting
	sortData(sort: Sort) {

		const data = this.UserList.slice();
		if (sort.direction === '')
			sort.direction = 'asc';
		// if (!sort.active || sort.direction === '') {
		//   this.sortedData = data;
		//   return;
		// }

		this.sortedData = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'id': return compare(a.id, b.id, isAsc);
				// case 'username': return compare(a.username, b.username, isAsc);
				case 'callcenter': return compare(a.callcenter, b.callcenter, isAsc);
				case 'lastname': return compare(a.lastname, b.lastname, isAsc);
				case 'firstname': return compare(a.firstname, b.firstname, isAsc);
				case 'userrolename': return compare(a.userrolename, b.userrolename, isAsc);
				case 'userccrolename': return compare(a.userccrolename, b.userccrolename, isAsc);
				case 'active_flag': return compare(a.active_flag, b.active_flag, isAsc);
				default: return 0;
			}
		});
		this.UserList$.next(this.sortedData);
	}

	changeCallCenter(event: any) {

		this.callcenterIdForAdding = event;
		this.roleIdForAdding = '';
		this.getAgentRoles();
	}

	changeRole(event: any) {
		this.roleIdForAdding = event;
	}

	changeCCRole(event: any) {
		this.ccRoleIdForAdding = event;
	}
	getAgentRoles() {	
		let ccid:number;	
		if (this.callcenterIdForAdding != undefined)
		ccid = Number(this.callcenterIdForAdding);

		this.auth.RolesByCallCenter(ccid).subscribe((res: Role[]) => {
			this.allRoles=[];
			if(res.length > 0)
			{
				this.allRoles = res;
				this.roleIdForAdding =this.tempSelectedsRole;				
			}
			else{
				var EmptyData = new Role();
				this.allRoles.push(EmptyData);
			}
		});
	}
	getAgentCCRoles() {
		//CCRoles Ativity
		this.auth.GetAllCCRoles().subscribe((_ccRoles: User[]) => {
			this.CCRolesList = _ccRoles
		});
	}
	loadUsers(pagenumber: number, pagesize: number) {
		const filter: any = {};
		filter.ID = this.filterUserId;
		filter.CallCenter = this.callcenterIdForAdding;
		filter.LastName = this.filterLastName;
		filter.FirstName = this.filterFirstName;
		filter.UserRole = this.roleIdForAdding;
		filter.CCRole = this.ccRoleIdForAdding;
		filter.Status = this.filterStatus;
		filter.PageNumber = pagenumber;
		filter.PageSize = pagesize;
		this.auth.getAllUsers(filter).subscribe((_res: any) => {
			this.UserList = _res;
			if (this.UserList.length > 0) {
				this.totalRecords = _res[0].TotalRecords;
				this.UserList$.next(this.UserList);
			}
			else {
				this.totalRecords = 0;
				this.UserList$.next(this.UserList);
			}
		});

	}

	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	deleteUser(_item: User) {
		const _title: string = 'User Delete';
		const _description: string = 'Are you sure to permanently delete this user?';
		const _waitDesciption: string = 'User is deleting...';
		const _deleteMessage = `User has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new UserDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}


	/**
	 * Activate User
	 *
	 * @param User: User
	 */
	activateUser(id) {
		const _saveMessage = `user successfully has been saved.`;
		const _messageType = id ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(UseractivateComponent, { data: { activateuserid: id } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			// this.loadUsersList();
			this.pagenumber = 1;
			this.pagesize = 15;
			this.loadUsers(this.pagenumber, this.pagesize);
		});
	}
	ClearAll() {
		this.filterFirstName = '';
		this.filterLastName = '';
		this.ccRoleIdForAdding = '';
		this.roleIdForAdding = '';
		this.filterStatus = '';
		this.filterUserId = undefined;
		this.callcenterIdForAdding = '';
		this.allRoles =[];
	}
	/**
 * Activate User
 *
 * @param User: User
 */
	deactivateUser(id) {
		const _saveMessage = `user successfully has been saved.`;
		const _messageType = id ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(UserdeactivateComponent, { data: { activateuserid: id } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			// this.loadUsersList();
			this.pagenumber = 1;
			this.pagesize = 15;
			this.loadUsers(this.pagenumber, this.pagesize);
		});
	}


	/**
	 * Fetch selected rows
	 */
	fetchUsers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.firstname},${elem.userroleid},${elem.username}, ${elem.email}`,
				id: elem.id.toString(),
				status: elem.username
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.usersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.usersResult.length) {
			this.selection.clear();
		} else {
			this.usersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns user roles string
	 *
	 * @param user: User
	 */
	// getUserRolesStr(user: User): string {
	// 	const titles: string[] = [];
	// 	each(user.userroleid, (roleId: number) => {
	// 		const _role = find(this.allRoles, (role: Role) => role.id === roleId);
	// 		if (_role) {
	// 			titles.push(_role.RoleName);
	// 		}
	// 	});
	// 	return titles.join(', ');
	// }

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editUser(id) {
		this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
	}

	onBtFirst() {

		// this.gridApi.paginationGoToFirstPage();
		this.pagenumber = 1;

		this.loadUsers(this.pagenumber, this.pagesize);

		setText('#lblCurrentPage', this.pagenumber);

	}

	onChange() {
		// this.gridApi.paginationGoToFirstPage();
		this.pagenumber = 1;
		this.loadUsers(this.pagenumber, this.pagesize);

	}

	onBtLast() {

		console.log('here');

		this.pagenumber = round(this.totalRecords / this.pagesize) + 1;
		if (this.totalRecords != this.pagesize) {
			if (this.UserList.length >= this.pagesize) {

				this.loadUsers(this.pagenumber, this.pagesize);
				setText('#lblCurrentPage', this.pagenumber);
			}
		}
	}

	onBtNext() {

		if (this.totalRecords != this.pagesize) {
			if (this.UserList.length >= this.pagesize) {
				this.pagenumber = this.pagenumber + 1;

				this.loadUsers(this.pagenumber, this.pagesize);

				setText('#lblCurrentPage', this.pagenumber);
			}
		}
		// this.gridApi.paginationGoToNextPage();
	}

	onBtPrevious() {

		if (this.pagenumber > 1) {
			this.pagenumber = this.pagenumber - 1;
			this.loadUsers(this.pagenumber, this.pagesize);
			setText('#lblCurrentPage', this.pagenumber);
		}
	}

}
function setText(selector, text) {
	document.querySelector(selector).innerHTML = text;
}
// For Dynamic Sorting
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
