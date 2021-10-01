// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { CallCenter } from '../_models/CallCenter.model';

export enum CallCenterActionTypes {
    AllCallCentersRequested = '[CallCenters Home Page] All CallCenters Requested',
    AllCallCentersLoaded = '[CallCenters API] All CallCenters Loaded',
    CallCenterOnServerCreated = '[Edit CallCenter Dialog] CallCenter On Server Created',
    CallCenterCreated = '[Edit CallCenters Dialog] CallCenters Created',
    CallCenterUpdated = '[Edit CallCenter Dialog] CallCenter Updated',
    CallCenterDeleted = '[CallCenters List Page] CallCenter Deleted',
    CallCentersPageRequested = '[CallCenters List Page] CallCenters Page Requested',
    CallCentersPageLoaded = '[CallCenters API] CallCenters Page Loaded',
    CallCentersPageCancelled = '[CallCenters API] CallCenters Page Cancelled',
    CallCentersPageToggleLoading = '[CallCenters page] CallCenters Page Toggle Loading',
    CallCentersActionToggleLoading = '[CallCenters] CallCenters Action Toggle Loading'
}

export class CallCenterOnServerCreated implements Action {
    readonly type = CallCenterActionTypes.CallCenterOnServerCreated;
    constructor(public payload: { CallCenter: CallCenter }) { }
}

export class CallCenterCreated implements Action {
    readonly type = CallCenterActionTypes.CallCenterCreated;
    constructor(public payload: { CallCenter: CallCenter }) { }
}

export class CallCenterUpdated implements Action {
    readonly type = CallCenterActionTypes.CallCenterUpdated;
    constructor(public payload: {
        partialCallCenter: Update<CallCenter>,
        CallCenter: CallCenter
    }) { }
}

export class CallCenterDeleted implements Action {
    readonly type = CallCenterActionTypes.CallCenterDeleted;
    constructor(public payload: { cc_id: number }) {}
}

export class CallCentersPageRequested implements Action {
    readonly type = CallCenterActionTypes.CallCentersPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CallCentersPageLoaded implements Action {
    readonly type = CallCenterActionTypes.CallCentersPageLoaded;
    constructor(public payload: { CallCenters: CallCenter[], totalCount: number, page: QueryParamsModel }) { }
}

export class CallCentersPageCancelled implements Action {
    readonly type = CallCenterActionTypes.CallCentersPageCancelled;
}

export class AllCallCentersRequested implements Action {
    readonly type = CallCenterActionTypes.AllCallCentersRequested;
}

export class AllCallCentersLoaded implements Action {
    readonly type = CallCenterActionTypes.AllCallCentersLoaded;
    constructor(public payload: { CallCenters: CallCenter[] }) { }
}

export class CallCentersPageToggleLoading implements Action {
    readonly type = CallCenterActionTypes.CallCentersPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CallCentersActionToggleLoading implements Action {
    readonly type = CallCenterActionTypes.CallCentersActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CallCenterActions = CallCenterCreated
| CallCenterUpdated
| CallCenterDeleted
| CallCentersPageRequested
| CallCentersPageLoaded
| CallCentersPageCancelled
| AllCallCentersLoaded
| AllCallCentersRequested
| CallCenterOnServerCreated
| CallCentersPageToggleLoading
| CallCentersActionToggleLoading;
