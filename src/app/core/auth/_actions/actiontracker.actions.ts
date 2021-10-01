// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ActionTracker } from '../_models/ActionTracker.model';

export enum ActionTrackerActionTypes {
    AllActionTrackersRequested = '[ActionTrackers Home Page] All ActionTrackers Requested',
    AllActionTrackersLoaded = '[ActionTrackers API] All ActionTrackers Loaded',
    ActionTrackerOnServerCreated = '[Edit ActionTracker Dialog] ActionTracker On Server Created',
    ActionTrackerCreated = '[Edit ActionTrackers Dialog] ActionTrackers Created',
    ActionTrackerUpdated = '[Edit ActionTracker Dialog] ActionTracker Updated',
    ActionTrackerDeleted = '[ActionTrackers List Page] ActionTracker Deleted',
    ActionTrackersPageRequested = '[ActionTrackers List Page] ActionTrackers Page Requested',
    ActionTrackersPageLoaded = '[ActionTrackers API] ActionTrackers Page Loaded',
    ActionTrackersPageCancelled = '[ActionTrackers API] ActionTrackers Page Cancelled',
    ActionTrackersPageToggleLoading = '[ActionTrackers page] ActionTrackers Page Toggle Loading',
    ActionTrackersActionToggleLoading = '[ActionTrackers] ActionTrackers Action Toggle Loading'
}

export class ActionTrackerOnServerCreated implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackerOnServerCreated;
    constructor(public payload: { ActionTracker: ActionTracker }) { }
}

export class ActionTrackerCreated implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackerCreated;
    constructor(public payload: { ActionTracker: ActionTracker }) { }
}

export class ActionTrackerUpdated implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackerUpdated;
    constructor(public payload: {
        partialActionTracker: Update<ActionTracker>,
        ActionTracker: ActionTracker
    }) { }
}

export class ActionTrackerDeleted implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackerDeleted;
    constructor(public payload: { id: number }) {}
}

export class ActionTrackersPageRequested implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackersPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class ActionTrackersPageLoaded implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackersPageLoaded;
    constructor(public payload: { ActionTrackers: ActionTracker[], totalCount: number, page: QueryParamsModel }) { }
}

export class ActionTrackersPageCancelled implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackersPageCancelled;
}

export class AllActionTrackersRequested implements Action {
    readonly type = ActionTrackerActionTypes.AllActionTrackersRequested;
}

export class AllActionTrackersLoaded implements Action {
    readonly type = ActionTrackerActionTypes.AllActionTrackersLoaded;
    constructor(public payload: { ActionTrackers: ActionTracker[] }) { }
}

export class ActionTrackersPageToggleLoading implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackersPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class ActionTrackersActionToggleLoading implements Action {
    readonly type = ActionTrackerActionTypes.ActionTrackersActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type ActionTrackerActions = ActionTrackerCreated
| ActionTrackerUpdated
| ActionTrackerDeleted
| ActionTrackersPageRequested
| ActionTrackersPageLoaded
| ActionTrackersPageCancelled
| AllActionTrackersLoaded
| AllActionTrackersRequested
| ActionTrackerOnServerCreated
| ActionTrackersPageToggleLoading
| ActionTrackersActionToggleLoading;
