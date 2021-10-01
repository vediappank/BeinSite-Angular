// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { CCRole } from '../_models/ccrole.model';

export enum CCRoleActionTypes {
    AllCCRolesRequested = '[CCRoles Home Page] All CCRoles Requested',
    AllCCRolesLoaded = '[CCRoles API] All CCRoles Loaded',
    CCRoleOnServerCreated = '[Edit CCRoles Dialog] CCRoles On Server Created',
    CCRoleCreated = '[Edit CCRoles Dialog] CCRoles Created',
    CCRoleUpdated = '[Edit CCRoles Dialog] CCRoles Updated',
    CCRoleDeleted = '[CCRoles List Page] CCRoles Deleted',
    CCRolesPageRequested = '[CCRoles List Page] CCRoles Page Requested',
    CCRolesPageLoaded = '[CCRoles API] CCRoles Page Loaded',
    CCRolesPageCancelled = '[CCRoles API] CCRoles Page Cancelled',
    CCRolesPageToggleLoading = '[CCRoles page] CCRoles Page Toggle Loading',
    CCRolesActionToggleLoading = '[CCRoles] CCRoles Action Toggle Loading'
}

export class CCRoleOnServerCreated implements Action {
    readonly type = CCRoleActionTypes.CCRoleOnServerCreated;
    constructor(public payload: { role: CCRole }) { }
}

export class CCRoleCreated implements Action {
    readonly type = CCRoleActionTypes.CCRoleCreated;
    constructor(public payload: { role: CCRole }) { }
}

export class CCRoleUpdated implements Action {
    readonly type = CCRoleActionTypes.CCRoleUpdated;
    constructor(public payload: {
        partialrole: Update<CCRole>,
        role: CCRole
    }) { }
}

export class CCRoleDeleted implements Action {
    readonly type = CCRoleActionTypes.CCRoleDeleted;
    constructor(public payload: { id: number }) {}
}

export class CCRolesPageRequested implements Action {
    readonly type = CCRoleActionTypes.CCRolesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CCRolesPageLoaded implements Action {
    readonly type = CCRoleActionTypes.CCRolesPageLoaded;
    constructor(public payload: { roles: CCRole[], totalCount: number, page: QueryParamsModel }) { }
}

export class CCRolesPageCancelled implements Action {
    readonly type = CCRoleActionTypes.CCRolesPageCancelled;
}

export class AllCCRolesRequested implements Action {
    readonly type = CCRoleActionTypes.AllCCRolesRequested;
}

export class AllCCRolesLoaded implements Action {
    readonly type = CCRoleActionTypes.AllCCRolesLoaded;
    constructor(public payload: { roles: CCRole[] }) { }
}

export class CCRolesPageToggleLoading implements Action {
    readonly type = CCRoleActionTypes.CCRolesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CCRolesActionToggleLoading implements Action {
    readonly type = CCRoleActionTypes.CCRolesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CCRoleActions = CCRoleCreated
| CCRoleUpdated
| CCRoleDeleted
| CCRolesPageRequested
| CCRolesPageLoaded
| CCRolesPageCancelled
| AllCCRolesLoaded
| AllCCRolesRequested
| CCRoleOnServerCreated
| CCRolesPageToggleLoading
| CCRolesActionToggleLoading;
