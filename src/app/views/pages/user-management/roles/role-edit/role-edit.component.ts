// Angular
import { Component, OnInit, Inject, Injectable, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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
	Role,
	Permission,
	selectRoleById,
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
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { array } from '@amcharts/amcharts4/core';
import { ModuleModel } from '../../../../../core/auth/_models/role.model';



/**
 * Node for to-do org
 */
export class TodoOrgNode {
	children: TodoOrgNode[];
	org: string;
	orgid: number;
	assignedOrg: number;
}

/** Flat to-do org node with expandable and level information */
export class TodoOrgFlatNode {
	org: string;
	orgid: number;
	level: number;
	assignedOrg: number;
	expandable: boolean;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do org or a category.
 * If a node is a category, it has children orgs and new orgs can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
	public OraganizationList: any[] = [];
	dataChange = new BehaviorSubject<TodoOrgNode[]>([]);
	public roleID: number = 0;
	get data(): TodoOrgNode[] { return this.dataChange.value; }

	constructor(public auth: AuthService, private layoutUtilsService: LayoutUtilsService, private activatedRoute: ActivatedRoute) {
		this.initialize();
	}

	initialize() {
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			this.roleID = params['id'] == "undefined" ? 0 : params['id'];
		});
		this.auth.GetOrgTreeConfig(this.roleID).subscribe((_ccorg: any[]) => {

			if (_ccorg) {
				console.log('data:' + JSON.stringify(_ccorg["subOrg"]));
				this.OraganizationList = _ccorg["subOrg"];
			}
			const data = this.buildFileTree(this.OraganizationList, 0);

			// Notify the change.
			this.dataChange.next(data);
		});
	}



	/**
	 * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
	 * The return value is the list of `TodoOrgNode`.
	 */
	buildFileTree(obj: { [key: string]: any }, level: number): TodoOrgNode[] {
		return Object.values(obj).reduce<TodoOrgNode[]>((accumulator, key) => {
			const orgname = key["Organization"];
			const orgid = key["orgId"];
			const assignedOrg = key["assignedOrg"];
			//const value = obj[key];
			const value = key["subOrg"];
			const node = new TodoOrgNode();
			node.org = orgname;
			node.orgid = orgid;
			node.assignedOrg = assignedOrg;

			if (value != null) {
				if (typeof value === 'object') {
					node.children = this.buildFileTree(value, level + 1);
				} else {
					node.org = value;
					node.orgid = orgid;
					node.assignedOrg = assignedOrg;
				}
			}
			return accumulator.concat(node);
		}, []);
	}
}
@Component({
	selector: 'kt-role-edit',
	templateUrl: './role-edit.component.html',
	styleUrls: ['./role-edit.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [ChecklistDatabase]

})
export class RoleEditComponent implements OnInit, OnDestroy {
	seletedDashboardModule: ModuleModel[] = [];
	mainmenufromArray: Array<Permission> = [];
	mainmenuPriviegefromArrays: Array<any> = [];
	menuCollection: Array<any> = [];
	privilegeCollection: Array<privilege> = [];
	dashbaordModuleCollection: Array<any> = [];
	dashbaordassignedModuleCollection: Array<any> = [];
	role: Role;
	filterMenus: any;
	filterMenustring: any;
	role$: Observable<Role>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	allPermissions$: Observable<Permission[]>;
	rolePermissions: Permission[] = [];
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray: any[] = [];
	public selectedPRArray: any[] = [];
	private subscriptions: Subscription[] = [];
	/** Map from flat node to nested node. This helps us finding the nested node to be modified */
	flatNodeMap = new Map<TodoOrgFlatNode, TodoOrgNode>();

	/** Map from nested node to flattened node. This helps us to keep the same object for selection */
	nestedNodeMap = new Map<TodoOrgNode, TodoOrgFlatNode>();

	/** A selected parent node to be inserted */
	selectedParent: TodoOrgFlatNode | null = null;

	/** The new org's name */
	newOrgName = '';

	treeControl: FlatTreeControl<TodoOrgFlatNode>;

	treeFlattener: MatTreeFlattener<TodoOrgNode, TodoOrgFlatNode>;

	dataSource: MatTreeFlatDataSource<TodoOrgNode, TodoOrgFlatNode>;

	/** The selection for checklist */
	checklistSelection = new SelectionModel<TodoOrgFlatNode>(true /* multiple */);
	roleID: any;



	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private store: Store<AppState>, public auth: AuthService, private _database: ChecklistDatabase, private layoutUtilsService: LayoutUtilsService, private router: Router) {

		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
			this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<TodoOrgFlatNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

		_database.dataChange.subscribe(data => {
			this.dataSource.data = data;
			this.assignedOrgBind();
			this.ExpandOrg();
		});
	}


	getLevel = (node: TodoOrgFlatNode) => node.level;

	isExpandable = (node: TodoOrgFlatNode) => node.expandable;

	getChildren = (node: TodoOrgNode): TodoOrgNode[] => node.children;

	hasChild = (_: number, _nodeData: TodoOrgFlatNode) => _nodeData.expandable;

	hasNoContent = (_: number, _nodeData: TodoOrgFlatNode) => _nodeData.org === '';

	/**
	 * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
	 */
	transformer = (node: TodoOrgNode, level: number) => {
		const existingNode = this.nestedNodeMap.get(node);
		const flatNode = existingNode && existingNode.org === node.org && existingNode.orgid === node.orgid
			? existingNode
			: new TodoOrgFlatNode();
		flatNode.org = node.org;
		flatNode.orgid = node.orgid;
		flatNode.assignedOrg = node.assignedOrg;
		flatNode.level = level;
		flatNode.expandable = !!node.children;
		this.flatNodeMap.set(flatNode, node);
		this.nestedNodeMap.set(node, flatNode);
		return flatNode;
	}
	ExpandOrg() {
		for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
			this.treeControl.expand(this.treeControl.dataNodes[i])
		}
	}
	CollapseOrg() {
		for (let j = 0; j < this.treeControl.dataNodes.length; j++) {
			this.treeControl.collapse(this.treeControl.dataNodes[j])
		}
	}
	assignedOrgBind() {
		let currentNode: TodoOrgFlatNode;
		for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
			currentNode = this.treeControl.dataNodes[i];
			if (currentNode.assignedOrg > 0) {
				this.checklistSelection.isSelected(currentNode);
				this.checklistSelection.select(currentNode);
				//this.descendantsAllSelected(currentNode);
				//this.todoLeafOrgSelectionToggle(currentNode);
			}
		}
	}




	chckedOrganization(node: TodoOrgFlatNode): boolean {
		const result = this.treeControl.dataNodes.filter(row => row.assignedOrg > 0 && row.orgid == node.orgid && row.org == node.org);
		if (result.length > 0)
			return true;
		else
			return false;
	}
	// /** Whether all the descendants of the node are selected. */
	descendantsAllSelected(node: TodoOrgFlatNode): boolean {
		const descendants = this.treeControl.getDescendants(node);
		const descAllSelected = descendants.every(child =>
			this.checklistSelection.isSelected(child),
		);
		return descAllSelected;
	}

	/** Whether part of the descendants are selected */
	descendantsPartiallySelected(node: TodoOrgFlatNode): boolean {

		const descendants = this.treeControl.getDescendants(node);
		const result = descendants.some(child => this.checklistSelection.isSelected(child));
		return result && !this.descendantsAllSelected(node);
	}

	/** Toggle the to-do org selection. Select/deselect all the descendants node */
	todoOrgSelectionToggle(node: TodoOrgFlatNode): void {
		this.checklistSelection.toggle(node);
		const descendants = this.treeControl.getDescendants(node);
		this.checklistSelection.isSelected(node)
			? this.checklistSelection.select(...descendants)
			: this.checklistSelection.deselect(...descendants);

		// Force update for the parent
		descendants.every(child =>
			this.checklistSelection.isSelected(child)
		);
		this.checkAllParentsSelection(node);
	}

	/** Toggle a leaf to-do org selection. Check all the parents to see if they changed */
	todoLeafOrgSelectionToggle(node: TodoOrgFlatNode): void {
		this.checklistSelection.toggle(node);
		this.checkAllParentsSelection(node);
	}

	/* Checks all the parents when a leaf node is selected/unselected */
	checkAllParentsSelection(node: TodoOrgFlatNode): void {
		let parent: TodoOrgFlatNode | null = this.getParentNode(node);
		while (parent) {
			this.checkRootNodeSelection(parent);
			parent = this.getParentNode(parent);
		}
		//alert('parent' + parent);
	}

	/** Check root node checked state and change it accordingly */
	checkRootNodeSelection(node: TodoOrgFlatNode): void {
		const nodeSelected = this.checklistSelection.isSelected(node);
		const descendants = this.treeControl.getDescendants(node);
		const descAllSelected = descendants.every(child =>
			this.checklistSelection.isSelected(child)
		);
		if (nodeSelected && !descAllSelected) {
			this.checklistSelection.deselect(node);
		} else if (!nodeSelected && descAllSelected) {
			this.checklistSelection.select(node);
		}
	}

	/* Get the parent node of a node */
	getParentNode(node: TodoOrgFlatNode): TodoOrgFlatNode | null {
		const currentLevel = this.getLevel(node);
		if (currentLevel < 1) {
			return null;
		}
		const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
		for (let i = startIndex; i >= 0; i--) {
			const currentNode = this.treeControl.dataNodes[i];

			if (this.getLevel(currentNode) < currentLevel) {
				return currentNode;
			}
		}
		return null;
	}


	/**
	 Expand collapse logic
	 */
	step = 0;

	setStep(index: number) {
		this.step = index;
	}

	nextStep() {
		this.step++;
	}

	prevStep() {
		this.step--;
	}

	/**
	 * On init
	 */
	ngOnInit() {

		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			this.roleID = params['id'];
			if (this.roleID && this.roleID > 0) {
				//if (this.data.roleId) {
				this.role$ = this.store.pipe(select(selectRoleById(this.roleID)));
				this.getRoleMenu(this.roleID);
				//this.getAllModulePermission(this.data.roleId);
				this.getAllPrivileges();
				this.getAllDashboardModules(this.roleID);

			} else {
				this.getRoleMenu(0);
				this.getAllPrivileges();
				this.getAllDashboardModules(0);
				const newRole = new Role();
				newRole.clear();
				this.role$ = of(newRole);
			}
		});

		this.role$.subscribe(res => {
			if (!res) {
				return;
			}

			this.role = new Role();
			this.role.id = res.id;
			this.role.RoleName = res.RoleName;
			this.role.RoleShortName = res.RoleShortName;
			this.role.permissions = res.permissions;
			this.role.isCoreRole = res.isCoreRole;
			this.role.TeamMeetingApprover = res.TeamMeetingApprover;
			this.role.OnetoOneMeetingApprover = res.OnetoOneMeetingApprover;
			this.role.TrainingMeetingApprover = res.TrainingMeetingApprover;
			this.role.ForecastApprover = res.ForecastApprover;
			this.role.ActionTrackerApprover = res.ActionTrackerApprover;
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
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/roles`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshRole(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}
		url = `/user-management/roles/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	//Load MainMenu
	// getMainMenu(roleid: number) {
	// 	this.auth.GetAllMainMenu(roleid).subscribe((_mainMenus: any) => {
	// 		console.log('MainMenu collection:: Response::' + JSON.stringify(_mainMenus));
	// 		this.menuCollection = _mainMenus;
	// 		if (this.menuCollection.length > 0) {
	// 			this.selectedMMArray = [];
	// 			this.selectedPRArray = [];
				
	// 			for (let j = 0; j < this.menuCollection.length; j++) {
	// 				for (let k = 0; k < this.menuCollection[j].submenu.length; k++) {
	// 					this.selectedMMArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + this.menuCollection[j].submenu[k].title);
	// 					let permissionViewIDs: any;
	// 					let permissionViewName: any;
	// 					let permissionIDArray: any[];
	// 					let permissionNameArray: any[];
	// 					let permissionViewID: number;
	// 					if (this.menuCollection[j].submenu.length > 0) {
	// 						permissionViewIDs = this.menuCollection[j].submenu[k].map_privilegeid;
	// 						permissionViewName = this.menuCollection[j].submenu[k].map_privilegename;
	// 						if (permissionViewIDs.indexOf(',') > -1) {
	// 							permissionIDArray = permissionViewIDs.split(',');
	// 							permissionNameArray = permissionViewName.split(',');
	// 							for (let l = 0; l < permissionIDArray.length; l++) {
	// 								this.selectedPRArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + permissionIDArray[l] + '-' + permissionNameArray[l]);
	// 							}
	// 						}
	// 						else {
	// 							permissionViewID = Number(permissionViewIDs);
	// 							this.selectedPRArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + permissionViewID + '-' + permissionViewName);
	// 						}
	// 					}
	// 				}
	// 			}

	// 			this.mainmenuPriviegefromArrays = [];
	// 			for (let i = 0; i < this.selectedMMArray.length; i++) {
	// 				let Menus: string;
	// 				Menus = this.selectedMMArray[i].split('-');
	// 				var mainmenuid = Menus[0];
	// 				var submenumenuid = Menus[1];
	// 				let priv: string;
	// 				for (let j = 0; j < this.selectedPRArray.length; j++) {
	// 					priv = this.selectedPRArray[j].split('-')
	// 					if (priv[0] === Menus[0] && priv[1] === Menus[1]) {
	// 						this.mainmenuPriviegefromArrays.push({ "menuId": mainmenuid, "submenuId": submenumenuid, "title": Menus[2], "privilegeid": priv[2], "privilegename": priv[3] });
	// 					}
	// 				}
	// 			}
	// 		}
	// 	});
	// }

	getRoleMenu(roleid: number) {
		this.auth.GetRoleMenuCollection(roleid).subscribe((_mainMenus: any) => {
			console.log('MainMenu collection:: Response::' + JSON.stringify(_mainMenus));
			this.menuCollection = _mainMenus;
			if (this.menuCollection && this.menuCollection.length > 0) {
				this.selectedMMArray = [];
				this.selectedPRArray = [];
				
				for (let j = 0; j < this.menuCollection.length; j++) {
					if( this.menuCollection[j].submenu && this.menuCollection[j].submenu.length > 0 ){
						for (let k = 0; k < this.menuCollection[j].submenu.length; k++) {
							this.selectedMMArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + this.menuCollection[j].submenu[k].title);
							let permissionViewIDs: any;
							let permissionViewName: any;
							let permissionIDArray: any[];
							let permissionNameArray: any[];
							let permissionViewID: number;
							if (this.menuCollection[j].submenu.length > 0) {
								permissionViewIDs = this.menuCollection[j].submenu[k].map_privilegeid;
								permissionViewName = this.menuCollection[j].submenu[k].map_privilegename;
								if (permissionViewIDs.indexOf(',') > -1) {
									permissionIDArray = permissionViewIDs.split(',');
									permissionNameArray = permissionViewName.split(',');
									for (let l = 0; l < permissionIDArray.length; l++) {
										this.selectedPRArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + permissionIDArray[l] + '-' + permissionNameArray[l]);
									}
								}
								else {
									permissionViewID = Number(permissionViewIDs);
									this.selectedPRArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + permissionViewID + '-' + permissionViewName);
								}
							}
						}
					}
				}

				this.mainmenuPriviegefromArrays = [];
				for (let i = 0; i < this.selectedMMArray.length; i++) {
					let Menus: string;
					Menus = this.selectedMMArray[i].split('-');
					var mainmenuid = Menus[0];
					var submenumenuid = Menus[1];
					let priv: string;
					for (let j = 0; j < this.selectedPRArray.length; j++) {
						priv = this.selectedPRArray[j].split('-')
						if (priv[0] === Menus[0] && priv[1] === Menus[1]) {
							this.mainmenuPriviegefromArrays.push({ "menuId": mainmenuid, "submenuId": submenumenuid, "title": Menus[2], "privilegeid": priv[2], "privilegename": priv[3] });
						}
					}
				}
			}
		});
	}

	getAllPrivileges() {
		this.auth.GetAllPrivileges().subscribe((_privilege: privilege[]) => {
			console.log('getAllPrivileges collection:: Response::' + JSON.stringify(_privilege));
			this.privilegeCollection = _privilege;
		});
	}
	getPrivilegeName(privilegeid: number): string {		
		let selectedprvilegeArray: any[];
		let selectedprvilegeArrayvalue: string = '';
		if(privilegeid > 0){
		selectedprvilegeArray = this.privilegeCollection.filter(row => row.privilege_id == Number(privilegeid));
		console.log(privilegeid +'::::'+ JSON.stringify(selectedprvilegeArray));
		selectedprvilegeArrayvalue = selectedprvilegeArray[0].privilege_name;
		}
		return selectedprvilegeArrayvalue;
	}
	getPrivilegeID(privilegename: string): number {
		let selectedprvilegeArray: any;
		selectedprvilegeArray = this.privilegeCollection.filter(row => row.privilege_name === privilegename);
		return selectedprvilegeArray[0].privilege_id;

	}

	getAllDashboardModules(roleid: number) {
		this.auth.GetAllDashboardModules(roleid).subscribe((_dashboardmodule: any[]) => {
			console.log('getAllDashboardModules collection:: Response::' + JSON.stringify(_dashboardmodule));
			this.dashbaordModuleCollection = _dashboardmodule;
			if (this.dashbaordModuleCollection.length > 0) {
				this.dashbaordModuleCollection.forEach((myObject, index) => {
					if (myObject.Checked == true)
						this.seletedDashboardModule.push(myObject);
				});
			}
		});
	}


	checkuncheckOrg(node: any) {
		this.checklistSelection.toggle(node);
		console.log('Selected Org:::' + JSON.stringify(node));
	}

	checkuncheckModule(ModuleID: number, DashboardID: number): boolean {
		//alert(ModuleID + DashboardID)		
		let filterData: any;
		//let filteredCards = this.dashbaordassignedModuleCollection.filter(row=>row.ModuleID.toString() === ModuleID.toString()).filter(row=>row.ModuleID.toString() === ModuleID.toString());
		filterData = this.dashbaordassignedModuleCollection.find(row => row.ModuleID.toString() == ModuleID.toString());
		console.log('check/uncheck Module collection:: Response::' + JSON.stringify(filterData));
		return true;
	}
	
	checkuncheckPrivilege(mainmenuid: number, submenuid: number, prviligeid: number): boolean {
		if (prviligeid > 0) {
			let filtermainnmenu: any[];
			filtermainnmenu = this.mainmenuPriviegefromArrays.filter(row => row.menuId == mainmenuid.toString()
				&& row.submenuId == submenuid.toString()
				&& row.privilegeid == prviligeid.toString()
			);
			console.log('CheckUncheckPrivilege:::: Menu Filtered List: '+JSON.stringify(filtermainnmenu, null, 8));
			if (filtermainnmenu.length > 0)
				return true;
			else
				return false;
		}
		else
			return false;
	}

	/**
	 * Returns role for save
	 */
	prepareRole(): Role {
		const _role = new Role();
		_role.id = this.role.id;
		let filterDashboardID: ModuleModel[];
		let falsefilterDashboardID: ModuleModel[];
		console.log('PrepareRole mainmenuPriviegefromArrays ::' + JSON.stringify(this.mainmenuPriviegefromArrays, null, 8));
		for (let j = 0; j < this.mainmenuPriviegefromArrays.length; j++) {
			filterDashboardID = this.dashbaordModuleCollection.filter(row => row.Checked == true && row.DashboardID == this.mainmenuPriviegefromArrays[j].submenuId);
			console.log('PrepareRole filterDashboardID::' + JSON.stringify(filterDashboardID, null, 8));
			if (filterDashboardID.length > 0) {
				console.log('PrepareRole filterDashboardID Submitted::' + JSON.stringify(filterDashboardID, null, 8));
				this.mainmenuPriviegefromArrays[j].privilegeid = "1";
				this.mainmenuPriviegefromArrays[j].privilegename = "View";
			}
			else {
				falsefilterDashboardID = this.dashbaordModuleCollection.filter(row1 => row1.Checked == false && row1.DashboardID == this.mainmenuPriviegefromArrays[j].submenuId);
				if (falsefilterDashboardID.length > 0) {
					this.mainmenuPriviegefromArrays[j].privilegeid = "0";
					this.mainmenuPriviegefromArrays[j].privilegename = "No Access";
				}
			}
		}
		_role.permissions = this.mainmenuPriviegefromArrays;
		_role.DashboardModulePermission = this.seletedDashboardModule;
		_role.orgpermissions = this.checklistSelection.selected;
		_role.RoleName = this.role.RoleName;
		_role.RoleShortName = this.role.RoleShortName;
		_role.isCoreRole = this.role.isCoreRole;
		_role.TeamMeetingApprover = this.role.TeamMeetingApprover;
		_role.OnetoOneMeetingApprover = this.role.OnetoOneMeetingApprover;
		_role.TrainingMeetingApprover = this.role.TrainingMeetingApprover;
		_role.ForecastApprover = this.role.ForecastApprover;
		_role.ActionTrackerApprover = this.role.ActionTrackerApprover;
		return _role;
	}

	/**
	 * Save data
	 */
	onSubmit() {
		//
		//console.log( 'Tree Data Selection' + JSON.stringify(this.checklistSelection.selected));
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedRole = this.prepareRole();
		if (editedRole.id > 0) {
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
	updateRole(_role: Role, withBack: boolean = false) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateRole(_role).subscribe(data => {
			console.log(' updateRole Data received: ' + data)
			this.selectedMMArray = [];
			this.selectedPRArray = [];
			const message = `Role updated successfully.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (data == "SUCCESS") {

				withBack = true;
				const message = `User successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshRole(false);
				}
			}
		});// Remove this line
	}

	/**
	 * Create role
	 *
	 * @param _role: Role
	 */
	createRole(_role: Role, withBack: boolean = false) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		debugger;
		this.auth.createRole(_role).subscribe(newId => {
			console.log('Data received: ' + newId)
			this.viewLoading = false;
			const message = `Role created successfully.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (newId) {
				this.goBackWithId();
			} else {
				this.refreshRole(true, newId);
			}

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

			return `Edit Role '${this.role.RoleName}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Role';
	}
	getAssignTitle(): string {

		if (this.role && this.role.id) {
			return `Modifiy Menu Permissions`;
		}

		return 'Assign Menu Permissions';
	}
	getOrgnaizationTitle(): string {

		if (this.role && this.role.id) {
			return `Modifiy Organization Permissions`;
		}
		return 'Assign Organization Permissions';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		console.log('isTitleValid called');
		return (this.role.RoleName && this.role.RoleName.length > 0);
	}




	onChangeDasboardModule(event, index, item) {
		item.Checked = !item.Checked;
		let currentItem = new ModuleModel();
		currentItem.DashboardID = item.DashboardID;
		currentItem.DashboardName = item.DashboardName;
		currentItem.ModuleID = item.ModuleID;
		currentItem.ModuleName = item.ModuleName;
		//let selectmoduleID = item.DashboardID + '-' + item.ModuleID + '-' + item.checked;
		if (item.Checked) {
			currentItem.Checked = item.Checked;
			this.seletedDashboardModule.push(item);
		}
		else {
			currentItem.Checked = item.Checked;
			var index1 = this.seletedDashboardModule.indexOf(item);
			if (index1 > -1) {
				this.seletedDashboardModule.splice(index1, 1);
			}
		}
		console.log('Selected Modules by Dahboard::' + JSON.stringify(this.seletedDashboardModule));
		//this.lastAction = 'index: ' + index + ', label: ' + item.label + ', checked: ' + item.checked;
		//console.log(index, event, item);
	}

	onEditChangePrivilege(event, Selectdata: any) {
		// debugger;
		// let sub_menu_id:any;
		// let menu_menu_id:any;
		// let sub_menu_name:any;
		// let privilege_name:any;
		// if (event.source.checked) {
		// 	var nameArr = event.source.value.split('-');
		// 	if (nameArr.length > 2) {
		// 		sub_menu_id = nameArr[2];
		// 		menu_menu_id = nameArr[0];
		// 		sub_menu_name = nameArr[1];
		// 		privilege_name=nameArr[3]
		// 	}
		// 	else {
		// 		sub_menu_id = 'NOSUBMENU';
		// 		menu_menu_id = nameArr[1];
		// 		sub_menu_name = nameArr[0];
		// 	}

		// 	let index: any;
		// 	if (this.selectedMMArray.length > 0) {
		// 		index = this.selectedMMArray.indexOf(menu_menu_id + '-' + sub_menu_id + '-' +sub_menu_name);
		// 		if (index >= 0) {
		// 			//this.selectedMMArray.push(menu_menu_id + '-' + sub_menu_id + '-' + sub_menu_name);
		// 			this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + event.source.value.split('-')[3] + '-' + privilege_name);
		// 		}
		// 		//else
		// 		//	this.selectedPRArray.splice(index, 1, menu_menu_id + '-' + sub_menu_id + '-' + event.source.value.split('-')[3] + '-' + privilege_name);
		// 	}
		// 	// else {
		// 	// 	this.selectedMMArray.push(menu_menu_id + '-' + sub_menu_id + '-' + sub_menu_name);
		// 	// 	this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + event.source.value.split('-')[3] + '-' + privilege_name);
		// 	// }
		// 	this.mainmenuPriviegefromArrays = [];
		// 	for (let i = 0; i < this.selectedMMArray.length; i++) {
		// 		let Menus: string;
		// 		Menus = this.selectedMMArray[i].split('-');
		// 		let priv: string;
		// 		priv = this.selectedPRArray[i].split('-')
		// 		this.mainmenuPriviegefromArrays.push({ "menuId": Menus[0], "submenuId": Menus[1], "title": Menus[2], "privilegeid": priv[0], "privilegename": priv[1] });
		// 	}
		// }
		// console.log('Menu Wise Privileges:::' + JSON.stringify(this.mainmenuPriviegefromArrays));
		
		let sub_menu_id: any;
		let menu_menu_id: any;
		let sub_menu_name: any;
		let privilege_name: any;
		if (event.source.checked) {
			var nameArr = event.source.value.split('-');
			if (nameArr.length > 2) {
				sub_menu_id = nameArr[2];
				menu_menu_id = nameArr[0];
				sub_menu_name = nameArr[1];
				privilege_name = nameArr[3]
			}
			else {
				sub_menu_id = 'NOSUBMENU';
				menu_menu_id = nameArr[1];
				sub_menu_name = nameArr[0];
			}
			let index: any;
			if (this.selectedMMArray.length > 0) {
				index = this.selectedMMArray.indexOf(menu_menu_id + '-' + sub_menu_id + '-' + sub_menu_name);
				//if (index < 0) {
				if (index >= 0) {
					///	this.selectedMMArray.push(menu_menu_id + '-' + sub_menu_id + '-' + sub_menu_name);
					this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + event.source.value.split('-')[3] + '-' + privilege_name);
				}
			}
			else {
				//this.selectedMMArray.push(menu_menu_id + '-' + sub_menu_id + '-' + sub_menu_name);
				this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + event.source.value.split('-')[3] + '-' + privilege_name);
			}
		}
		else {
			let index1: any;
			index1 = this.selectedPRArray.indexOf(event.source.value.split('-')[0] + '-' + event.source.value.split('-')[2] + '-' + event.source.value.split('-')[3] + '-' + privilege_name);
			this.selectedPRArray.splice(index1, 1);
		}
		this.mainmenuPriviegefromArrays = [];
		for (let i = 0; i < this.selectedMMArray.length; i++) {
			let Menus: string;
			Menus = this.selectedMMArray[i].split('-');
			var mainmenuid = Menus[0];
			var submenumenuid = Menus[1];
			let priv: string;
			for (let j = 0; j < this.selectedPRArray.length; j++) {
				priv = this.selectedPRArray[j].split('-')
				if (priv[0] === mainmenuid && priv[1] === submenumenuid) {
					this.mainmenuPriviegefromArrays.push({ "menuId": mainmenuid, "submenuId": submenumenuid, "title": Menus[2], "privilegeid": priv[2], "privilegename": priv[3] });
				}
			}
		}
		console.log('Menu Wise Privileges:::' + JSON.stringify(this.mainmenuPriviegefromArrays));
	}

	onChangePrivilege(event, Selectdata: any) {
	
		let sub_menu_id: any;
		let menu_menu_id: any;
		let sub_menu_name: any;
		let privilege_name: any;
		let privilege_id: any;
		var nameArr = event.source.value.split('-');
		if (nameArr.length > 2) {
			sub_menu_id = nameArr[2];
			menu_menu_id = nameArr[0];
			sub_menu_name = nameArr[1];
			privilege_name = nameArr[3];
			privilege_id = this.getPrivilegeID(nameArr[3]);
		}
		else {
			sub_menu_id = 'NOSUBMENU';
			menu_menu_id = nameArr[1];
			sub_menu_name = nameArr[0];
		}
		if (event.source.checked) {

			let index: any;
			if (this.selectedMMArray.length > 0) {
				index = this.selectedMMArray.indexOf(menu_menu_id + '-' + sub_menu_id + '-' + sub_menu_name);
				if (index >= 0) {
					this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + privilege_id + '-' + privilege_name);
					if (privilege_name != 'VIEW')
					{
						var viewIndex:number;
						viewIndex = this.selectedPRArray.indexOf(menu_menu_id + '-' + sub_menu_id + '-' + '1' + '-' + 'VIEW');
						if(viewIndex < 0)
						this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + '1' + '-' + 'VIEW');
					}
				}
			}
			else {
				this.selectedPRArray.push(menu_menu_id + '-' + sub_menu_id + '-' + privilege_id + '-' + privilege_name);
			}			
		}
		else {
			let index1: any;			
			index1 = this.selectedPRArray.indexOf(menu_menu_id + '-' + sub_menu_id + '-' + privilege_id + '-' + privilege_name);
			this.selectedPRArray.splice(index1, 1);
			
		}
		this.mainmenuPriviegefromArrays = [];
		for (let i = 0; i < this.selectedMMArray.length; i++) {
			let Menus: string;
			Menus = this.selectedMMArray[i].split('-');
			var t_main_menu_id = Menus[0];
			var t_sub_menu_id = Menus[1];
			let seelctedprivilege: string;
			for (let j = 0; j < this.selectedPRArray.length; j++) {
				seelctedprivilege = this.selectedPRArray[j].split('-')
				var selectedprivilege_main_menu_id = seelctedprivilege[0];
				var selectedprivilege_sub_menu_id = seelctedprivilege[1];
				var prid = seelctedprivilege[2];
				var prname = seelctedprivilege[3];
				if (selectedprivilege_main_menu_id === t_main_menu_id && selectedprivilege_sub_menu_id === t_sub_menu_id) {
					this.mainmenuPriviegefromArrays.push({ "menuId": selectedprivilege_main_menu_id, "submenuId": selectedprivilege_sub_menu_id, "title": Menus[2], "privilegeid": prid, "privilegename": prname });
				}
			}
		}
		console.log('Menu Wise Privileges:::' + JSON.stringify(this.mainmenuPriviegefromArrays));
	}
	

	disableViews(mainmenuid: number, submenuid: number): boolean {
		//console.log('disableViews called');
		let flag: boolean = false;
		let filteredPRArray : any[] = [];
		// filteredPRArray = this.selectedPRArray.filter((res) => res.toString().split('-')[0] == mainmenuid && res.toString().split('-')[1] == submenuid);
		filteredPRArray = this.mainmenuPriviegefromArrays.filter(res => res.menuId == mainmenuid && res.submenuId == submenuid && res.privilegeid > 0);

		if (filteredPRArray.length > 1 )
			flag = true;

		return flag;
	}
	duplicate() {
		console.log(JSON.stringify(this.mainmenuPriviegefromArrays));
	}
}



