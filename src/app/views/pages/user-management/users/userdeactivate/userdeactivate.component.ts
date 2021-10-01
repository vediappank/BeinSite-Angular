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

import { UserDeActivateModel } from '../_model/userdeactivate.model';

@Component({
  selector: 'kt-userdeactivate',
  templateUrl: './userdeactivate.component.html',
  styleUrls: ['./userdeactivate.component.scss']
})
export class UserdeactivateComponent implements OnInit {
  user: User;
 
  CallCenterList: User[];
  user$: Observable<User>;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;

  public userAttritionData: any[];
  public userAttritionData$ = new BehaviorSubject<any[]>(this.userAttritionData);

  //Lists
  public ActivityList: User[];


  //Subjects

  ActivitySubject = new BehaviorSubject<number[]>([]);
  description:string;


ErrorMessage:string;

  // Activity
  allActivity: User[] = [];
  unassignedActivity: User[] = [];
  assignedActivity: User[] = [];
  attritionIdForAdding: number;
  assignedActivityList$ = new BehaviorSubject<User[]>(this.assignedActivity);

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<UserEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
  constructor(public dialogRef: MatDialogRef<UserdeactivateComponent>,
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
          this.auth.GetAllAttrition().subscribe((res: any[]) => {
            this.userAttritionData = res;
            this.userAttritionData$.next(this.userAttritionData);
          });
    }
  }


	/**
	 * Returns user for save
	 */
  prepareUser(): UserDeActivateModel {
    const _user = new UserDeActivateModel();
    _user.id = this.data.activateuserid;
   
    if (this.attritionIdForAdding != undefined)
      _user.attritionid = this.attritionIdForAdding;
    else
      _user.attritionid = Number(this.ActivitySubject.value);
      _user.description = this.description;
    return _user;
  }

	/**
	 * Save data
	 */
  onSubmit() {  
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    /** check form */
    let condtion:boolean;
    condtion = this.isTitleValid()
    if (!condtion) {
      this.ErrorMessage ="Please select the attrition."
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
  updateUser(_user: UserDeActivateModel) {
     this.loadingAfterSubmit = true;
     this.viewLoading = true;
    const _saveMessage = `User successfully deactivated.`;
    const _messageType = _user.id ? MessageType.Update : MessageType.Create;
    this.auth.deActivateUser(_user.id, _user.attritionid,_user.description).subscribe(res => {
     
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
    return 'DeActivate User';
  }

	/**
	 * Returns is title valid
	 */
  isTitleValid(): boolean {
    return this.attritionIdForAdding != null && this.attritionIdForAdding != undefined && this.attritionIdForAdding > 0 ;
  }
}
