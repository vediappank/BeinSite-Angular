// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { FormControl } from '@angular/forms';
import { each, find, remove } from 'lodash';
import { Role, selectAllRoles } from '../../../../../core/auth';
import { History } from '../../../../../core/auth/_models/history.model';



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
import { Options } from 'selenium-webdriver/safari';
import { stringify } from 'querystring';
import { AnyFn } from '@ngrx/store/src/selector';
//import { ConsoleReporter } from 'jasmine';



@Component({
	selector: 'kt-user-edit',
	templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {
	// Public properties


	Agents: any[] = [];
	selectedFDGroups: any[] = [];
	selectedPeople: any;
	tempSelectedsRole: string;
	source: Array<any>;
	confirmed: Array<any>;
	public selected_fd_groups: string;

	public isCollapsed = false;
	user: User;
	beinsight_access_flag: string;
	Password: string;
	ConfirmPassword: string;
	userId$: Observable<number>;
	oldUser: User;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	rolesSubject = new BehaviorSubject<number[]>([]);
	callcenterSubject = new BehaviorSubject<number[]>([]);
	ccRolesSubject = new BehaviorSubject<number[]>([]);
	ActivitySubject = new BehaviorSubject<number[]>([]);
	SupervisorSubject = new BehaviorSubject<number[]>([]);

	addressSubject = new BehaviorSubject<Address>(new Address());
	soicialNetworksSubject = new BehaviorSubject<SocialNetworks>(new SocialNetworks());
	userForm: FormGroup;
	userRoleForm: FormGroup;
	userActivityForm: FormGroup;
	hasFormErrors: boolean = false;
	activityIdForAdding: number;
	activityenddate: string;
	// Private properties
	private subscriptions: Subscription[] = [];

	allAgentActivity$: Observable<User[]>;
	allActivity: User[] = [];
	unassignedActivity: User[] = [];
	assignedActivity: User[] = [];
	AcitivityIdForAdding: number;
	supervisorIdForAdding: number;

	allAgentSupervisor$: Observable<User[]>;
	allSupervisor: User[] = [];
	unassignedSupervisor: User[] = [];
	assignedSupervisor: User[] = [];

	allOrganization: User[] = [];
	OrganizationIdForAdding: number;
	unassignedOrganization: User[] = [];
	assignedOrganization: User[] = [];
	OrganizationSubject = new BehaviorSubject<number[]>([]);

	myControl = new FormControl();
	public UserList: User[];
	public ActivityList: User[];
	public CallCenterList: any[];
	public CCRolesList: User[];
	public RolesList: any[];
	public SupervisorList: User[];
	public SupervisorList$: Observable<User[]>
	filteredOptions: Observable<User[]>;
	public UserList$: Observable<User[]>
	public OrganizationList: User[];

	public UserActivityHistory: History[];
	public UserWorkHistory: History[];
	public UserRoleHistory: History[];
	public UserCCRoleHistory: History[];
	public UserSupervisorHistory: History[];

	loadingSubject = new BehaviorSubject<boolean>(false);
	private _dateTimeObj: string;

	// Roles
	allUserRoles$: Observable<Role[]>;
	allRoles: Role[] = [];
	unassignedRoles: Role[] = [];
	assignedRoles: Role[] = [];
	roleIdForAdding: any;
	
	//CC Roles
	allUserCCRoles$: Observable<User[]>;
	allCCRoles: User[] = [];
	unassignedCCRoles: User[] = [];
	assignedCCRoles: User[] = [];
	ccRoleIdForAdding: any;

	//CC Roles
	allCallCenters$: Observable<any[]>;
	allCallCenter: any[] = [];
	unassignedCallCenter: any[] = [];
	assignedsCallCenter: any[] = [];
	callcenterIdForAdding: number;

	WorkHistorydisplayedColumns = ['startdate', 'enddate', 'attritionname', 'description'];
	ActivityHistorydisplayedColumns = ['activitynamehistory', 'activitystartdatehistory', 'activityenddatehistory'];
	RoleHistorydisplayedColumns = ['rolenamehistory', 'rolestartdatehistory', 'roleenddatehistory'];
	CCRoleHistorydisplayedColumns = ['ccrolenamehistory', 'ccrolestartdatehistory', 'ccroleenddatehistory'];
	SupervisorHistorydisplayedColumns = ['supervisornamehistory', 'supervisorstartdatehistory', 'supervisorenddatehistory'];
	ErrorMessage: string;
	RoleID: any;


	/**
	 * Component constructor
	 *	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param userAcivityFB: FormBuilder
	 * * @param userRoleFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */



	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private userFB: FormBuilder,
		private userAcivityFB: FormBuilder,
		private userRoleFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private calendar: NgbCalendar,
		private auth: AuthService,

		private layoutConfigService: LayoutConfigService) {
		this.confirmed = [];
	}

	public model: string;


	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.model = new Date().toISOString().split('T')[0];
		this.loading$ = this.store.pipe(select(selectUsersActionLoading));

		const routeSubscription = this.activatedRoute.params.subscribe(params => {

			const id = params['id'];
			if (id && id > 0) {
				const filter: any = {};
				filter.ID = id;
				filter.CallCenter = '';
				filter.LastName = '';
				filter.FirstName = '';
				filter.UserRole = '';
				filter.CCRole = '';
				filter.Status = '';
				filter.PageNumber = 0;
				filter.PageSize= 0;
				this.auth.getAllUsers(filter).subscribe((res: any) => {
					debugger
					if (res) {
						this.user = res[0];
						this.beinsight_access_flag = this.user.beinsight_access_flag;
						//this.Password = this.user.password;
						//this.ConfirmPassword = this.user.password;
						this.selected_fd_groups = this.user.selected_fd_groups;
						// this.rolesSubject.next(this.user.userroleid);
						// this.ccRolesSubject.next(this.user.userccroleid);
						// this.callcenterSubject.next(this.user.Callcenterid);
					
						this.ActivitySubject.next(this.user.useractivityid);
						this.SupervisorSubject.next(this.user.usersupervisorid);
						this.OrganizationSubject.next(this.user.userorganizationid);
						this.oldUser = Object.assign({}, this.user);
						this.tempSelectedsRole =this.user.userroleid.toString();
						this.roleIdForAdding= this.user.userroleid.toString();
						this.ccRoleIdForAdding= this.user.userccroleid.toString();
						this.callcenterIdForAdding= this.user.Callcenterid;
						this.initUser();
					}
				});
			} else {
				this.user = new User();
				this.user.clear();
				// this.rolesSubject.next(this.user.userroleid);
				// this.ccRolesSubject.next(this.user.userccroleid);
				// this.callcenterSubject.next(this.user.Callcenterid);

			

				this.ActivitySubject.next(this.user.useractivityid);
				this.SupervisorSubject.next(this.user.usersupervisorid);
				this.OrganizationSubject.next(this.user.userorganizationid);
				this.oldUser = Object.assign({}, this.user);
				this.initUser();
				this.tempSelectedsRole =this.user.userroleid.toString();
				this.roleIdForAdding= this.user.userroleid.toString();
				this.ccRoleIdForAdding= this.user.userccroleid.toString();
				this.callcenterIdForAdding= this.user.Callcenterid;
			}
			this.GetUserWorkHistory(id);
			this.getUserActivityHistory(id);
			this.getUserRoleHistory(id);
			this.getUserCCRoleHistory(id);
			this.getUserSupervisorHistory(id);
			this.getFDGroupsCollection();
		});

		this.subscriptions.push(routeSubscription);
		//Activity
		this.auth.GetAllActivity().subscribe((res: User[]) => {
			each(res, (_user: User) => {
				this.allActivity.push(_user);
				this.unassignedActivity.push(_user);
			});

			each([Number(this.ActivitySubject.value.toString())], (activityId: number) => {
				const activity = find(this.allActivity, (_activityId: User) => {
					return _activityId.id === activityId;
				});
				if (activity) {
					this.assignedActivity.push(activity);
					remove(this.unassignedActivity, activity);
				}
			});
		});
		//Supervisor
		this.auth.GetAllSupervisosr().subscribe((_resSupervisor: User[]) => {
			each(_resSupervisor, (_usersup: User) => {
				this.allSupervisor.push(_usersup);
				this.unassignedSupervisor.push(_usersup);
			});

			each([Number(this.SupervisorSubject.value.toString())], (_supervisorId: number) => {
				const _supervisor = find(this.allSupervisor, (_supervisor: User) => {
					return _supervisor.id === _supervisorId;
				});
				if (_supervisor) {
					this.assignedSupervisor.push(_supervisor);
					remove(this.unassignedSupervisor, _supervisor);
				}
			});
		});

		//Organization
		this.auth.GetAllOrganizations().subscribe((_resOrganization: User[]) => {
			each(_resOrganization, (_Organization: User) => {
				this.allOrganization.push(_Organization);
				this.unassignedOrganization.push(_Organization);
			});

			each([Number(this.OrganizationSubject.value.toString())], (_OrganizationId: number) => {
				const _Organization = find(this.allOrganization, (_Organization: User) => {
					return _Organization.orgid === _OrganizationId;
				});
				if (_Organization) {
					this.assignedOrganization.push(_Organization);
					remove(this.unassignedOrganization, _Organization);
				}
			});

		});

		//CC Roles
		this.auth.GetAllCCRoles().subscribe((res: User[]) => {
			each(res, (_ccUser: User) => {
				this.allCCRoles.push(_ccUser);
				this.unassignedCCRoles.push(_ccUser);
			});
			//
			each([Number(this.ccRolesSubject.value.toString())], (ccRoleId: number) => {
				const ccRole = find(this.allCCRoles, (_ccRoleId: User) => {
					return _ccRoleId.id === ccRoleId;
				});
				if (ccRole) {
					this.assignedCCRoles.push(ccRole);
					remove(this.unassignedCCRoles, ccRole);
				}
			});
		});

		//Roles	
		
		this.auth.GetAllCallCenters().subscribe((res: any[]) => {
			each(res, (_callcenter: any) => {
				this.allCallCenter.push(_callcenter);
				this.unassignedCallCenter.push(_callcenter);
			});
			each([Number(this.callcenterSubject.value.toString())], (roleId: number) => {
				const callcenter = find(this.allCallCenter, (_role: any) => {
					return _role.cc_id === roleId;
				});
				if (callcenter) {
					this.assignedsCallCenter.push(callcenter);
					remove(this.unassignedCallCenter, callcenter);
				}
			});
		});

		//Roles	
		//this.auth.getAllRoles().subscribe((res: Role[]) => {
			
			let ccid:number;
		if (this.callcenterIdForAdding != undefined)
		ccid = Number(this.callcenterIdForAdding);
		else
		ccid = Number(this.callcenterSubject.value);
		//this.auth.getAllRoles().subscribe((_roles: any[]) => {
			this.auth.RolesByCallCenter(ccid).subscribe((res: Role[]) => {
				this.allRoles = res;
		
		});
	}

	selectToday() {
		//this.model = this.calendar.getToday();
	}

	getAgentActivity() {
		//DropDown Ativity
		this.auth.GetAllActivity().subscribe((users: User[]) => {
			this.ActivityList = users
		});
	}
	getCallCenter() {		
			this.auth.GetAllCallCenters().subscribe((_callcenter: any[]) => {   
				this.CallCenterList =  _callcenter; 
			  });
			}

	getAgentRoles() {	
		let ccid:number;	
		this.assignedRoles=[];
		if (this.callcenterIdForAdding != undefined)
		ccid = Number(this.callcenterIdForAdding);
		else
		ccid = Number(this.callcenterSubject.value);
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
	getAllSupervisor() {
		//DropDown Ativity		
		this.auth.GetAllSupervisosr().subscribe((_Super: User[]) => {
			this.SupervisorList = _Super;
		});
	}
	getAllOrganisations() {
		//DropDown Ativity		
		this.auth.GetAllOrganizations().subscribe((_org: User[]) => {
			this.OrganizationList = _org;
		});
	}
	getUserActivityHistory(user_id: number) {
		this.auth.GetUserActivityHistory(user_id).subscribe((history: History[]) => {
			this.UserActivityHistory = history;
		});
	}
	GetUserWorkHistory(user_id: number) {
		this.auth.GetUserWorkHistory(user_id).subscribe((history: History[]) => {
			this.UserWorkHistory = history;
		});
	}

	getUserRoleHistory(user_id: number) {
		this.auth.GetUserRoleHistory(user_id).subscribe((history: History[]) => {
			this.UserRoleHistory = history;
		});
	}
	getUserCCRoleHistory(user_id: number) {
		this.auth.GetUserCCRoleHistory(user_id).subscribe((history: History[]) => {
			this.UserCCRoleHistory = history;
		});
	}
	getUserSupervisorHistory(user_id: number) {
		this.auth.GetUserSupervisorHistory(user_id).subscribe((history: History[]) => {
			this.UserSupervisorHistory = history;
		});
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	/**
	 * Init user
	 */
	initUser() {
		this.createForm();
		if (!this.user.id) {			
			return;
		}		
		this.getAgentActivity();
		this.getCallCenter();
		this.getAgentRoles();
		this.getAgentCCRoles();
		this.getAllSupervisor();
		this.getAllOrganisations();
	}



	/**
	 * Create form
	 */
	createForm() {
		this.userForm = this.userFB.group({
			username: [this.user.username, Validators.required],
			firstname: [this.user.firstname, Validators.required],
			callcenter: [this.user.callcenter, Validators.required],
			email: [this.user.email, Validators.email],
			lastname: [this.user.lastname],
			userccrolename: [this.user.userccrolename],
			userorganizationname: [this.user.userorganizationname]
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshUser(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}
		url = `/user-management/users/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.user = Object.assign({}, this.oldUser);
		this.createForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
		this.userForm.markAsUntouched();
		this.userForm.updateValueAndValidity();
		this.userActivityForm.markAsPristine();
		this.userActivityForm.markAsUntouched();
		this.userActivityForm.updateValueAndValidity();
		this.userRoleForm.markAsPristine();
		this.userRoleForm.markAsUntouched();
		this.userRoleForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
	
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			
			return;
		}
		
		var roleID:Number;
		var ccroleID:Number;

		if (this.roleIdForAdding != undefined)
			roleID = this.roleIdForAdding;
		else
			roleID = Number(this.rolesSubject.value);
		
		if (this.ccRoleIdForAdding != undefined)
			ccroleID = this.ccRoleIdForAdding;
		else
			ccroleID = Number(this.ccRolesSubject.value);

		if(roleID == 0 || roleID == undefined)
			{
				this.hasFormErrors = true;
				this.selectedTab = 2;
				this.ErrorMessage ="Please select the Role";
			}
			else if(ccroleID == 0 || ccroleID == undefined)
			{
				this.hasFormErrors = true;
				this.selectedTab = 2;
				this.ErrorMessage ="Please select the CC Role";
			}
			else
			{
		const editedUser = this.prepareUser();
		if (editedUser.id > 0) {
			this.updateUser(editedUser, withBack);
			return;
		}
		this.addUser(editedUser, withBack);
	}
	}
	changeCallCenter(event:any)
	{
		
		this.callcenterIdForAdding =event;
		this.roleIdForAdding=0;
		this.getAgentRoles();
	}

	changeRole(event:any)
	{
		this.roleIdForAdding =event;
	}

	changeCCRole(event:any)
	{
		this.ccRoleIdForAdding =event;
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {		
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		//_user.userroleid = this.roleIdForAdding.value;
		//_user.userccroleid = this.ccRolesSubject.value;
		_user.userroleid = this.roleIdForAdding;
		_user.userccroleid = this.ccRoleIdForAdding;
		_user.callcenterid = Number(this.callcenterIdForAdding);
		_user.useractivityid = this.ActivitySubject.value;
		_user.usersupervisorid = this.SupervisorSubject.value;
		_user.userorganizationid = this.OrganizationSubject.value;
		if (this.roleIdForAdding != undefined)
			_user.roleid = this.roleIdForAdding;
		else
			_user.roleid = Number(this.rolesSubject.value);

		if (this.ccRoleIdForAdding != undefined)
			_user.ccroleid = this.ccRoleIdForAdding;
		else
			_user.ccroleid = Number(this.ccRolesSubject.value);

		if (this.activityIdForAdding != undefined)
			_user.activityid = this.activityIdForAdding;
		else
			_user.activityid = Number(this.ActivitySubject.value);

		if (this.supervisorIdForAdding != undefined)
			_user.supervisorid = this.supervisorIdForAdding;
		else
			_user.supervisorid = Number(this.SupervisorSubject.value);

		if (this.OrganizationIdForAdding != undefined)
			_user.orgid = Number(this.OrganizationIdForAdding);
		else
			_user.orgid = Number(this.OrganizationSubject.value);

		if (this.OrganizationIdForAdding != undefined)
			_user.orgid = Number(this.OrganizationIdForAdding);
		else
			_user.orgid = Number(this.OrganizationSubject.value);
		_user.refreshToken = this.user.refreshToken;
		_user.id = this.user.id;
		_user.username = controls['username'].value;
		_user.email = controls['email'].value;
		if (_user.email == undefined || !_user.email)
			_user.email = '';
		_user.firstname = controls['firstname'].value;
		_user.lastname = controls['lastname'].value;
		//_user.callcenter = controls['CallCenterIdForAdding'].value;
		_user.userorganizationname = controls['userorganizationname'].value;
		if (this.CheckPassword(this.Password, this.ConfirmPassword)) {
			_user.password = this.Password;
			_user.beinsight_access_flag = this.beinsight_access_flag;
			_user.userccrolename = this.user.userccrolename;
			_user.SelectedFDGroups = this.selectedFDGroups;
			return _user;
			}
	}

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	addUser(_user: User, withBack: boolean = false) {
		this.store.dispatch(new UserOnServerCreated({ user: _user }));
		const addSubscription = this.store.pipe(select(selectLastCreatedUserId)).subscribe(newId => {
			const message = `New user successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (newId) {
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshUser(true, newId);
				}
			}
		});
		this.subscriptions.push(addSubscription);
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const

		const updatedUser: Update<User> = {
			id: _user.id,
			changes: _user
		};
		//
		///this.store.dispatch(new UserUpdated({ partialUser: updatedUser, user: _user }));
		this.auth.updateUser(_user).subscribe(data => {		
			console.log('User Upadted Status ::::' + data);
			if (data == "SUCCESS") {

				withBack = true;
				const message = `User successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshUser(false);
				}
			}
		});


	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create user';
		if (!this.user || !this.user.id) {
			return result;
		}
		result = `Edit user - ${this.user.firstname}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	/**
	 * Assign role
	 */
	assignRole() {

		if (this.roleIdForAdding === 0) {
			return;
		}

		const role = find(this.allRoles, (_role: Role) => {
			return _role.id === (+this.roleIdForAdding);
		});

		if (role) {
			this.assignedRoles.push(role);
			remove(this.unassignedRoles, role);
			//this.roleIdForAdding = 0;
			this.updateRoles();
		}
	}

	/**
	 * Unassign role
	 *
	 * @param role: Role
	 */
	unassingRole(role: Role) {
		//this.roleIdForAdding = 0;
		this.unassignedRoles.push(role);
		remove(this.assignedRoles, role);
		this.updateRoles();
	}

	/**
	 * Update roles
	 */
	updateRoles() {
		const _roles = [];
		each(this.assignedRoles, elem => _roles.push(elem.id));
		this.rolesSubject.next(_roles);
	}

	/**
	 * Assign Activity
	 */
	assignActivity() {
		if (this.activityIdForAdding === 0) {
			return;
		}
		const role = find(this.getAgentActivity, (_user: User) => {
			return _user.id === (+this.activityIdForAdding);
		});
		if (role) {
			this.assignedActivity.push(role);
			remove(this.unassignedActivity, role);
			this.activityIdForAdding = 0;
			this.updateActivity();
		}
	}

	/**
	 * Unassign Activity
	 *
	 * @param Activity: User
	 */
	unassingnActivity(user: User) {
		this.activityIdForAdding = 0;
		this.unassignedActivity.push(user);
		remove(this.assignedActivity, user);
		this.updateActivity();
	}

	/**
	 * Update ACtivity
	 */
	updateActivity() {
		const _Activity = [];
		each(this.assignedActivity, elem => _Activity.push(elem.id));
		this.rolesSubject.next(_Activity);
	}


	/**
	 * Assign Supervisor
	 */
	assignSupervisor() {
		if (this.supervisorIdForAdding === 0) {
			return;
		}

		const role = find(this.getAllSupervisor, (_Supervisor: User) => {
			return _Supervisor.id === (+this.supervisorIdForAdding);
		});

		if (role) {
			this.assignedSupervisor.push(role);
			remove(this.unassignedSupervisor, role);
			this.supervisorIdForAdding = 0;
			this.updateActivity();
		}
	}

	/**
	 * Unassign Supervisor
	 *
	 * @param Activity: User
	 */
	unassingnSupervisor(user: User) {
		this.supervisorIdForAdding = 0;
		this.unassignedSupervisor.push(user);
		remove(this.assignedSupervisor, user);
		this.updateSupervisor();
	}

	/**
	 * Update ACtivity
	 */
	updateSupervisor() {
		const _Supervisor = [];
		each(this.assignedSupervisor, elem => _Supervisor.push(elem.id));
		this.rolesSubject.next(_Supervisor);
	}

	getFDGroupsCollection() {
		this.auth.GetFDGroupCollection()
			.subscribe((res) => {
				this.Agents = res;
				this.source = res;
				this.confirmed = [];
				console.log('FD Groups List::::' + JSON.stringify(this.Agents));
				console.log(' this.confirmed User List::::' + JSON.stringify(this.confirmed));
				console.log('selected_fd_groups FD Groups List::::' + JSON.stringify(this.selected_fd_groups));
				this.confirmed = [];
				this.selectedPeople = this.selected_fd_groups;
				let SelectedFDGroups: any;
				if (this.selectedPeople != null && this.selectedPeople != undefined) {
					SelectedFDGroups = this.selectedPeople.split(',');
					for (let i = 0; i < SelectedFDGroups.length; i++) {
						const selectdata = this.Agents.find(x => x.FDGroupID == SelectedFDGroups[i].toString());
						this.confirmed.push(selectdata);
						this.selectedFDGroups.push(SelectedFDGroups[i].toString());
					}
				}
			});
	}


	OnChangeFDDesignation($event) {
		this.selectedFDGroups = [];
		for (let i = 0; i < $event.length; i++) {
			this.selectedFDGroups.push($event[i].FDGroupID);
		}
		console.log('Selected FD Group List::::' + JSON.stringify(this.selectedFDGroups));
	}

	CheckPassword(newpassword, confirmpassword) {
		
		this.hasFormErrors = false;
		if ((newpassword != '' && newpassword != undefined) || (confirmpassword != '' && confirmpassword != undefined)) {
			if (newpassword != confirmpassword) {
				this.hasFormErrors = true;
				this.ErrorMessage = 'New Password & Confirm Password Should be same.';
				return false;
			}
			if (!confirmpassword.match(/[a-z]/)) {
				this.hasFormErrors = true;
				this.ErrorMessage = "Password must contain at least one lower case letter.";
				return false;
			}
			//check for upper ase
			if (!confirmpassword.match(/[A-Z]/)) {
				this.hasFormErrors = true;
				this.ErrorMessage = "Password must contain at least one upper case letter.";
				return false;
			}
			//check for number
			if (!confirmpassword.match(/\d+/g)) {
				this.hasFormErrors = true;
				this.ErrorMessage = "Password must contain at least one number.";

				return false;
			}
			//Validating length
			if ((confirmpassword).length < 8) {
				this.hasFormErrors = true;
				this.ErrorMessage = "Your password has less than 8 characters.";
				return false;
			}
			//confirm passwords match and have been created
			if (newpassword == confirmpassword) {
				// this.hasFormErrors = true;
				// this.ErrorMessage = "Your password has been updated!";
				return true;
			}
		}
		else {
			if(newpassword == undefined || newpassword =='')
			{
				this.Password ='';
			}
			return true;
		}
	}


}
