// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { CCActivity } from '../_models/ccactivity.model';

export enum ActivityActionTypes {
    AllActivitysRequested = '[Activitys Home Page] All Activitys Requested',
    AllActivitysLoaded = '[Activitys API] All Activitys Loaded',
    ActivityOnServerCreated = '[Edit Activity Dialog] Activity On Server Created',
    ActivityCreated = '[Edit Activitys Dialog] Activitys Created',
    ActivityUpdated = '[Edit Activity Dialog] Activity Updated',
    ActivityDeleted = '[Activitys List Page] Activity Deleted',
    ActivitysPageRequested = '[Activitys List Page] Activitys Page Requested',
    ActivitysPageLoaded = '[Activitys API] Activitys Page Loaded',
    ActivitysPageCancelled = '[Activitys API] Activitys Page Cancelled',
    ActivitysPageToggleLoading = '[Activitys page] Activitys Page Toggle Loading',
    ActivitysActionToggleLoading = '[Activitys] Activitys Action Toggle Loading'
}

export class ActivityOnServerCreated implements Action {
    readonly type = ActivityActionTypes.ActivityOnServerCreated;
    constructor(public payload: { activity: CCActivity }) { }
}

export class ActivityCreated implements Action {
    readonly type = ActivityActionTypes.ActivityCreated;
    constructor(public payload: { activity: CCActivity }) { }
}

export class ActivityUpdated implements Action {
    readonly type = ActivityActionTypes.ActivityUpdated;
    constructor(public payload: {
        partialactivity: Update<CCActivity>,
        activity: CCActivity
    }) { }
}

export class ActivityDeleted implements Action {
    readonly type = ActivityActionTypes.ActivityDeleted;
    constructor(public payload: { id: number }) {}
}

export class ActivitysPageRequested implements Action {
    readonly type = ActivityActionTypes.ActivitysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class ActivitysPageLoaded implements Action {
    readonly type = ActivityActionTypes.ActivitysPageLoaded;
    constructor(public payload: { activitys: CCActivity[], totalCount: number, page: QueryParamsModel }) { }
}

export class ActivitysPageCancelled implements Action {
    readonly type = ActivityActionTypes.ActivitysPageCancelled;
}

export class AllActivitysRequested implements Action {
    readonly type = ActivityActionTypes.AllActivitysRequested;
}

export class AllActivitysLoaded implements Action {
    readonly type = ActivityActionTypes.AllActivitysLoaded;
    constructor(public payload: { activitys: CCActivity[] }) { }
}

export class ActivitysPageToggleLoading implements Action {
    readonly type = ActivityActionTypes.ActivitysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class ActivitysActionToggleLoading implements Action {
    readonly type = ActivityActionTypes.ActivitysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type ActivityActions = ActivityCreated
| ActivityUpdated
| ActivityDeleted
| ActivitysPageRequested
| ActivitysPageLoaded
| ActivitysPageCancelled
| AllActivitysLoaded
| AllActivitysRequested
| ActivityOnServerCreated
| ActivitysPageToggleLoading
| ActivitysActionToggleLoading;
