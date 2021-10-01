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
import { ActivatedRoute, Router } from '@angular/router';

import { Role, selectAllRoles } from '../../../../../core/auth';
// State
import { AppState } from '../../../../../core/reducers';
import { delay } from 'rxjs/operators';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Services and Models
import {
  User,
  UserUpdated,
  Address,
  SocialNetworks,
  selectHasUsersInStore,
  selectUserById,
  UserOnServerCreated,
  selectLastCreatedUserId,
  selectUsersActionLoading,
  AuthService
} from '../../../../../core/auth';

import { UserActivateModel } from '../_model/useractivate.model';


@Component({
  selector: 'kt-useractivate',
  templateUrl: './useractivate.component.html',
  styleUrls: ['./useractivate.component.scss']
})
export class UseractivateComponent implements OnInit {
  user: User;
  filterMenus: any;
  filterMenustring: any;
  CallCenterList: User[];
  user$: Observable<User>;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;

  // Roles	
  allUsers: User[] = [];
  unassignedUsers: User[] = [];
  assignedUsers: User[] = [];
  userIdForAdding: number;
  usersSubject = new BehaviorSubject<number[]>([]);
  // Private properties
  private componentSubscriptions: Subscription;

  //Lists
  public ActivityList: User[];
  public CCRolesList: User[];
  public RolesList: any[];
  public SupervisorList: User[];

  //Subjects
  rolesSubject = new BehaviorSubject<number[]>([]);
  ccRolesSubject = new BehaviorSubject<number[]>([]);
  ActivitySubject = new BehaviorSubject<number[]>([]);
  SupervisorSubject = new BehaviorSubject<number[]>([]);




  // Activity
  allActivity: User[] = [];
  unassignedActivity: User[] = [];
  assignedActivity: User[] = [];
  acitivityIdForAdding: number;
  assignedActivityList$ = new BehaviorSubject<User[]>(this.assignedActivity);

  //Supervisor
  allSupervisor: User[] = [];
  unassignedSupervisor: User[] = [];
  assignedSupervisor: User[] = [];
  supervisorIdForAdding: number;
  assignedSupervisorList$ = new BehaviorSubject<User[]>(this.assignedSupervisor);

  // Roles
  allUserRoles$: Observable<Role[]>;
  allRoles: Role[] = [];
  unassignedRoles: Role[] = [];
  assignedRoles: Role[] = [];
  roleIdForAdding: number;
  assignedRolesList$ = new BehaviorSubject<Role[]>(this.assignedRoles);
  //CC Roles
  allUserCCRoles$: Observable<User[]>;
  allCCRoles: User[] = [];
  unassignedCCRoles: User[] = [];
  assignedCCRoles: User[] = [];
  ccRoleIdForAdding: number;
  assignedCCRolesList$ = new BehaviorSubject<User[]>(this.assignedCCRoles);

  loading$: Observable<boolean>;
  model: string;

  assignActivity:string;
  assignSupervisor:string;
  assignRole:string;
  assignCCRole:string;

 
  

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<UserEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
  constructor(public dialogRef: MatDialogRef<UseractivateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private activatedRoute: ActivatedRoute,
    private store: Store<AppState>, public auth: AuthService, private layoutUtilsService: LayoutUtilsService, private router: Router) {
  }

	/**
	 * On init
	 */
  ngOnInit() {
    //this.loading$ = this.store.pipe(select(selectUsersActionLoading));

    const id = this.data.activateuserid;
    if (id && id > 0) {
      this.auth.getUserById(Number(id)).subscribe((res: User) => {
        if (res) {
          this.user = res;          
          this.rolesSubject.next(this.user[0].userroleid);
          this.ccRolesSubject.next(this.user[0].userccroleid);
          this.ActivitySubject.next(this.user[0].useractivityid);
          this.SupervisorSubject.next(this.user[0].usersupervisorid);           
          
          this.assignRole = this.user[0].userrolename;  
          this.assignActivity = this.user[0].useractivityname;  
          this.assignCCRole = this.user[0].userccrolename;  
          this.assignSupervisor = this.user[0].usersupervisorname;	

          this.auth.GetAllActivity().subscribe((res: User[]) => {
            each(res, (_user: User) => {
              this.allActivity.push(_user);
              this.unassignedActivity.push(_user);
            });
            
            if (Number(this.ActivitySubject.value) > 0) {
              each([Number(this.ActivitySubject.value.toString())], (activityId: number) => {
                const activity = find(this.allActivity, (_activityId: User) => {
                  return _activityId.id === activityId;
                });
                if (activity) {
                
                  //this.assignedActivity.push(activity);find
                  
                  console.log('assignedActivity:::1:'+ JSON.stringify(this.assignedActivity));
                  remove(this.unassignedActivity, activity);
                }
               // this.assignedActivityList$.next(this.assignedSupervisor);
              });
            }
          });
      
          //Supervisor
          this.auth.GetAllSupervisosr().subscribe((_resSupervisor: User[]) => {
            each(_resSupervisor, (_usersup: User) => {
              this.allSupervisor.push(_usersup);
              this.unassignedSupervisor.push(_usersup);
            });
            if (Number(this.SupervisorSubject.value) > 0) {
              each([Number(this.SupervisorSubject.value.toString())], (_supervisorId: number) => {
                const _supervisor = find(this.allSupervisor, (_supervisor: User) => {
                  return _supervisor.id === _supervisorId;
                });
                if (_supervisor) {
                 
                 // this.assignedSupervisor.push(_supervisor);
                
                  console.log('assignedSupervisor:::2:'+ JSON.stringify(this.assignedSupervisor));
                  remove(this.unassignedSupervisor, _supervisor);
                }
               // this.assignedSupervisorList$.next(this.assignedSupervisor);
              });
            }
          });
      
      
          //CC Roles
          this.auth.GetAllCCRoles().subscribe((res: User[]) => {
            each(res, (_ccUser: User) => {
              this.allCCRoles.push(_ccUser);
              this.unassignedCCRoles.push(_ccUser);
            });
            if (Number(this.ccRolesSubject.value) > 0) {
              each([Number(this.ccRolesSubject.value.toString())], (ccRoleId: number) => {
                const ccRole = find(this.allCCRoles, (_ccRoleId: User) => {
                  return _ccRoleId.id === ccRoleId;
                });
                if (ccRole) {
                
                 // this.assignedCCRoles.push(ccRole);
                  console.log('assignedCCRoles:::3:'+ JSON.stringify(this.assignedCCRoles));
                  remove(this.unassignedCCRoles, ccRole);
                }
               // this.assignedCCRolesList$.next(this.assignedCCRoles);
              });
            }
          });
      
          //Roles
          //this.allUserRoles$ = this.store.pipe(select(selectAllRoles));
          this.auth.getAllRoles().subscribe((res: Role[]) => {
            each(res, (_role: Role) => {
              this.allRoles.push(_role);
              this.unassignedRoles.push(_role);
            });
            if (Number(this.ccRolesSubject.value) > 0) {
              each([Number(this.rolesSubject.value.toString())], (roleId: number) => {
                const role = find(this.allRoles, (_role: Role) => {
                  return _role.id === roleId;
                });
                if (role) {
                
               //   this.assignedRoles.push(role);
                  console.log('assignedRoles:::4:'+ JSON.stringify(this.assignedRoles));
                  remove(this.unassignedRoles, role);
                }
                //this.assignedRolesList$.next(this.assignedRoles);
              });
            }
          });

        }
      });
    }
   
   
  }
	/**
	//  * On destroy
	//  */
  // ngOnDestroy() {
  //   if (this.componentSubscriptions) {
  //     this.componentSubscriptions.unsubscribe();
  //   }
  // }

	/**
	 * Returns user for save
	 */
  prepareUser(): UserActivateModel {
    const _user = new UserActivateModel();
    _user.id = this.data.activateuserid;
    if (this.roleIdForAdding != undefined)
      _user.roleid = this.roleIdForAdding;
    else
      _user.roleid = Number(this.rolesSubject.value);

    if (this.ccRoleIdForAdding != undefined)
      _user.ccroleid = this.ccRoleIdForAdding;
    else
      _user.ccroleid = Number(this.ccRolesSubject.value);

    if (this.acitivityIdForAdding != undefined)
      _user.activityid = this.acitivityIdForAdding;
    else
      _user.activityid = Number(this.ActivitySubject.value);

    if (this.supervisorIdForAdding != undefined)
      _user.supervisorid = this.supervisorIdForAdding;
    else
      _user.supervisorid = Number(this.SupervisorSubject.value);
    return _user;
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
    const editedUser = this.prepareUser();
    if (editedUser.id > 0) {
      this.updateUser(editedUser);
    }
  }

	/**
	 * Update user
	 *
	 * @param _user: User
	 */
  updateUser(_user: UserActivateModel) {
     this.loadingAfterSubmit = true;
     this.viewLoading = true;
    const _saveMessage = `User successfully activated.`;
    const _messageType = _user.id ? MessageType.Update : MessageType.Create;
    this.auth.activateUser(_user).subscribe(res => {
     
      if(res =='SUCCESS')
    this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);    	
    this.viewLoading = false;
    this.dialogRef.close({
      _user,
      isEdit: false
    });
    this.router.navigate(['user-management/users'], { relativeTo: this.activatedRoute });
    });// Remove this line
  }

  // /**
  //  * Create user
  //  *
  //  * @param _user: User
  //  */
  // createUser(_user: User) {
  // 	this.loadingAfterSubmit = true;
  // 	this.viewLoading = true;
  // 	this.auth.createUser(_user).subscribe(data => {
  // 		console.log('Inserted Data received: ' + data)
  // 		this.viewLoading = false;
  // 		this.dialogRef.close({
  // 			_user,
  // 			isEdit: false
  // 		});
  // 	});
  // }

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
    return 'Activate User';
  }

	/**
	 * Returns is title valid
	 */
  isTitleValid(): boolean {
    //return ((this.acitivityIdForAdding != undefined || this.user.useractivityid.toString().length > 0 ) &&  (this.ccRolesSubject!= undefined || this.user.userccroleid.toString().length > 0 ) && (this.supervisorIdForAdding!= undefined || this.user.usersupervisorid.toString().length > 0 ));
    return true;

  }
}
