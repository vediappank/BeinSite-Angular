// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ActionTrackerTopicConversation } from '../_models/actiontrackertopicconversation.model';

export enum ActionTrackerTopicConversationActionTypes {
    AllActionTrackerTopicConversationsRequested = '[ActionTrackerTopicConversations Home Page] All ActionTrackerTopicConversations Requested',
    AllActionTrackerTopicConversationsLoaded = '[ActionTrackerTopicConversations API] All ActionTrackerTopicConversations Loaded',
    ActionTrackerTopicConversationOnServerCreated = '[Edit ActionTrackerTopicConversation Dialog] ActionTrackerTopicConversation On Server Created',
    ActionTrackerTopicConversationCreated = '[Edit ActionTrackerTopicConversations Dialog] ActionTrackerTopicConversations Created',
    ActionTrackerTopicConversationUpdated = '[Edit ActionTrackerTopicConversation Dialog] ActionTrackerTopicConversation Updated',
    ActionTrackerTopicConversationDeleted = '[ActionTrackerTopicConversations List Page] ActionTrackerTopicConversation Deleted',
    ActionTrackerTopicConversationsPageRequested = '[ActionTrackerTopicConversations List Page] ActionTrackerTopicConversations Page Requested',
    ActionTrackerTopicConversationsPageLoaded = '[ActionTrackerTopicConversations API] ActionTrackerTopicConversations Page Loaded',
    ActionTrackerTopicConversationsPageCancelled = '[ActionTrackerTopicConversations API] ActionTrackerTopicConversations Page Cancelled',
    ActionTrackerTopicConversationsPageToggleLoading = '[ActionTrackerTopicConversations page] ActionTrackerTopicConversations Page Toggle Loading',
    ActionTrackerTopicConversationsActionToggleLoading = '[ActionTrackerTopicConversations] ActionTrackerTopicConversations Action Toggle Loading'
}

export class ActionTrackerTopicConversationOnServerCreated implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationOnServerCreated;
    constructor(public payload: { ActionTrackerTopicConversation: ActionTrackerTopicConversation }) { }
}

export class ActionTrackerTopicConversationCreated implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationCreated;
    constructor(public payload: { ActionTrackerTopicConversation: ActionTrackerTopicConversation }) { }
}

export class ActionTrackerTopicConversationUpdated implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationUpdated;
    constructor(public payload: {
        partialActionTrackerTopicConversation: Update<ActionTrackerTopicConversation>,
        ActionTrackerTopicConversation: ActionTrackerTopicConversation
    }) { }
}

export class ActionTrackerTopicConversationDeleted implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationDeleted;
    constructor(public payload: { id: number }) {}
}

export class ActionTrackerTopicConversationsPageRequested implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class ActionTrackerTopicConversationsPageLoaded implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageLoaded;
    constructor(public payload: { ActionTrackerTopicConversations: ActionTrackerTopicConversation[], totalCount: number, page: QueryParamsModel }) { }
}

export class ActionTrackerTopicConversationsPageCancelled implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageCancelled;
}

export class AllActionTrackerTopicConversationsRequested implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.AllActionTrackerTopicConversationsRequested;
}

export class AllActionTrackerTopicConversationsLoaded implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.AllActionTrackerTopicConversationsLoaded;
    constructor(public payload: { ActionTrackerTopicConversations: ActionTrackerTopicConversation[] }) { }
}

export class ActionTrackerTopicConversationsPageToggleLoading implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class ActionTrackerTopicConversationsActionToggleLoading implements Action {
    readonly type = ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type ActionTrackerTopicConversationActions = ActionTrackerTopicConversationCreated
| ActionTrackerTopicConversationUpdated
| ActionTrackerTopicConversationDeleted
| ActionTrackerTopicConversationsPageRequested
| ActionTrackerTopicConversationsPageLoaded
| ActionTrackerTopicConversationsPageCancelled
| AllActionTrackerTopicConversationsLoaded
| AllActionTrackerTopicConversationsRequested
| ActionTrackerTopicConversationOnServerCreated
| ActionTrackerTopicConversationsPageToggleLoading
| ActionTrackerTopicConversationsActionToggleLoading;
