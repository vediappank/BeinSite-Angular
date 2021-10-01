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
import {
	CCRole,
	Permission,
	selectCCRoleById,
	RoleUpdated,
	selectAllPermissions,
	selectAllRoles,

	selectLastCreatedRoleId,
	RoleOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 

import { privilege } from '../../../../../core/auth/_models/privilege.model'

import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
  selector: 'kt-ccroleedit',
  templateUrl: './ccroleedit.component.html',
  styleUrls: ['./ccroleedit.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CcroleeditComponent implements OnInit {

  mainmenufromArray: Array<Permission> = [];
	mainmenuPriviegefromArrays: Array<any> = [];
	menuCollection: Array<any> = [];
	privilegeCollection: Array<privilege> = [];
	role: CCRole;
	filterMenus: any;
	filterMenustring: any;
	role$: Observable<CCRole>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	allPermissions$: Observable<Permission[]>;
	rolePermissions: Permission[] = [];
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray:any[]=[];
	public selectedPRArray:any[]=[];
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<CcroleeditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
	}

	/**
	 * On init
	 */
	ngOnInit() {		
		if (this.data.roleId) {
		//	
			this.role$ = this.store.pipe(select(selectCCRoleById(this.data.roleId)));			
		} else {
			
			const newRole = new CCRole();
			newRole.clear();
			this.role$ = of(newRole);
		}

		this.role$.subscribe(res => {
			if (!res) {
				return;
			}
			this.role = new CCRole();
			this.role.id = res.id;
			this.role.RoleName = res.RoleName;
			this.role.RoleShortName = res.RoleShortName;
			this.role.permissions = res.permissions;
			this.role.isCoreRole = res.isCoreRole;
			//alert(this.role.isCoreRole);
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
	 * Returns role for save
	 */
	prepareRole(): CCRole {
		//let SelectData:any;
		//SelectData = this.mainmenufromArray;
		const _role = new CCRole();
		_role.roleid = this.role.id;
		_role.permissions = this.mainmenuPriviegefromArrays;
		//each(this.mainmenufromArray, (_role: Role) => _user.roles.push(_role.id));
		_role.RoleName = this.role.RoleName;
		_role.RoleShortName = this.role.RoleShortName;
		_role.isCoreRole = this.role.isCoreRole;
		//_role.privilegeid = 3;
		return _role;
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
		const editedRole = this.prepareRole();
		if (editedRole.roleid > 0) {
			this.updateRole(editedRole);
		} else {
			this.createRole(editedRole);
		}
	}

	/**
	 * Update role
	 *
	 * @param _role: Role
	 */
	updateRole(_role: CCRole) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCCRole(_role).subscribe(data => {
			console.log('Update Designation Data received: ' + data)
			this.selectedMMArray=[];
			this.selectedPRArray=[];
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_role,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create role
	 *
	 * @param _role: Role
	 */
	createRole(_role: CCRole) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCCRole(_role).subscribe(data => {
			console.log('Inserted Designation Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_role,
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
		if (this.role && this.role.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Designation '${this.role.RoleName}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Designation';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.role && this.role.RoleName && this.role.RoleName.length > 0);
	}

	

}
