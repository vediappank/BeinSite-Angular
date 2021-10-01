// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ActionTrackerTopic } from '../_models/actiontrackertopic.model';

export enum ActionTrackerTopicActionTypes {
    AllActionTrackerTopicsRequested = '[ActionTrackerTopics Home Page] All ActionTrackerTopics Requested',
    AllActionTrackerTopicsLoaded = '[ActionTrackerTopics API] All ActionTrackerTopics Loaded',
    ActionTrackerTopicOnServerCreated = '[Edit ActionTrackerTopic Dialog] ActionTrackerTopic On Server Created',
    ActionTrackerTopicCreated = '[Edit ActionTrackerTopics Dialog] ActionTrackerTopics Created',
    ActionTrackerTopicUpdated = '[Edit ActionTrackerTopic Dialog] ActionTrackerTopic Updated',
    ActionTrackerTopicDeleted = '[ActionTrackerTopics List Page] ActionTrackerTopic Deleted',
    ActionTrackerTopicsPageRequested = '[ActionTrackerTopics List Page] ActionTrackerTopics Page Requested',
    ActionTrackerTopicsPageLoaded = '[ActionTrackerTopics API] ActionTrackerTopics Page Loaded',
    ActionTrackerTopicsPageCancelled = '[ActionTrackerTopics API] ActionTrackerTopics Page Cancelled',
    ActionTrackerTopicsPageToggleLoading = '[ActionTrackerTopics page] ActionTrackerTopics Page Toggle Loading',
    ActionTrackerTopicsActionToggleLoading = '[ActionTrackerTopics] ActionTrackerTopics Action Toggle Loading'
}

export class ActionTrackerTopicOnServerCreated implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicOnServerCreated;
    constructor(public payload: { ActionTrackerTopic: ActionTrackerTopic }) { }
}

export class ActionTrackerTopicCreated implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicCreated;
    constructor(public payload: { ActionTrackerTopic: ActionTrackerTopic }) { }
}

export class ActionTrackerTopicUpdated implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicUpdated;
    constructor(public payload: {
        partialActionTrackerTopic: Update<ActionTrackerTopic>,
        ActionTrackerTopic: ActionTrackerTopic
    }) { }
}

export class ActionTrackerTopicDeleted implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicDeleted;
    constructor(public payload: { id: number }) {}
}

export class ActionTrackerTopicsPageRequested implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class ActionTrackerTopicsPageLoaded implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicsPageLoaded;
    constructor(public payload: { ActionTrackerTopics: ActionTrackerTopic[], totalCount: number, page: QueryParamsModel }) { }
}

export class ActionTrackerTopicsPageCancelled implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicsPageCancelled;
}

export class AllActionTrackerTopicsRequested implements Action {
    readonly type = ActionTrackerTopicActionTypes.AllActionTrackerTopicsRequested;
}

export class AllActionTrackerTopicsLoaded implements Action {
    readonly type = ActionTrackerTopicActionTypes.AllActionTrackerTopicsLoaded;
    constructor(public payload: { ActionTrackerTopics: ActionTrackerTopic[] }) { }
}

export class ActionTrackerTopicsPageToggleLoading implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class ActionTrackerTopicsActionToggleLoading implements Action {
    readonly type = ActionTrackerTopicActionTypes.ActionTrackerTopicsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type ActionTrackerTopicActions = ActionTrackerTopicCreated
| ActionTrackerTopicUpdated
| ActionTrackerTopicDeleted
| ActionTrackerTopicsPageRequested
| ActionTrackerTopicsPageLoaded
| ActionTrackerTopicsPageCancelled
| AllActionTrackerTopicsLoaded
| AllActionTrackerTopicsRequested
| ActionTrackerTopicOnServerCreated
| ActionTrackerTopicsPageToggleLoading
| ActionTrackerTopicsActionToggleLoading;
