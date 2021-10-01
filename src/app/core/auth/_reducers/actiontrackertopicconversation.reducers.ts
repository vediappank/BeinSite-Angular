// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { ActionTrackerTopicConversationActions, ActionTrackerTopicConversationActionTypes } from '../_actions/ActionTrackerTopicConversation.actions';
// Models
import { ActionTrackerTopicConversation } from '../_models/ActionTrackerTopicConversation.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ActionTrackerTopicConversationsState extends EntityState<ActionTrackerTopicConversation> {
    isAllActionTrackerTopicConversationsLoaded: boolean;
    queryRowsCount: number;
    queryResult: ActionTrackerTopicConversation[];
    lastCreatedActionTrackerTopicConversationId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ActionTrackerTopicConversation> = createEntityAdapter<ActionTrackerTopicConversation>();

export const initialActionTrackerTopicConversationsState: ActionTrackerTopicConversationsState = adapter.getInitialState({
    isAllActionTrackerTopicConversationsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedActionTrackerTopicConversationId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function ActionTrackerTopicConversationReducer(state = initialActionTrackerTopicConversationsState, action: ActionTrackerTopicConversationActions): ActionTrackerTopicConversationsState {
    switch  (action.type) {
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedActionTrackerTopicConversationId: undefined
        };
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationOnServerCreated: return {
            ...state
        };
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationCreated: return adapter.addOne(action.payload.ActionTrackerTopicConversation, {
            ...state, lastCreatedActionTrackerTopicConversationId: action.payload.ActionTrackerTopicConversation.topic_id
        });
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationUpdated: return adapter.updateOne(action.payload.partialActionTrackerTopicConversation, state);
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationDeleted: return adapter.removeOne(action.payload.id, state);
        case ActionTrackerTopicConversationActionTypes.AllActionTrackerTopicConversationsLoaded: return adapter.addAll(action.payload.ActionTrackerTopicConversations, {
            ...state, isAllActionTrackerTopicConversationsLoaded: true
        });
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageLoaded: return adapter.addMany(action.payload.ActionTrackerTopicConversations, {
            ...initialActionTrackerTopicConversationsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.ActionTrackerTopicConversations,
            lastQuery: action.payload.page,
            showInitWaitingMessage: false
        });
        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
