// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { ActionTrackerTopicActions, ActionTrackerTopicActionTypes } from '../_actions/ActionTrackerTopic.actions';
// Models
import { ActionTrackerTopic } from '../_models/actiontrackertopic.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ActionTrackerTopicsState extends EntityState<ActionTrackerTopic> {
    isAllActionTrackerTopicsLoaded: boolean;
    queryRowsCount: number;
    queryResult: ActionTrackerTopic[];
    lastCreatedActionTrackerTopicId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ActionTrackerTopic> = createEntityAdapter<ActionTrackerTopic>();

export const initialActionTrackerTopicsState: ActionTrackerTopicsState = adapter.getInitialState({
    isAllActionTrackerTopicsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedActionTrackerTopicId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function ActionTrackerTopicReducer(state = initialActionTrackerTopicsState, action: ActionTrackerTopicActions): ActionTrackerTopicsState {
    switch  (action.type) {
        case ActionTrackerTopicActionTypes.ActionTrackerTopicsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedActionTrackerTopicId: undefined
        };
        case ActionTrackerTopicActionTypes.ActionTrackerTopicsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case ActionTrackerTopicActionTypes.ActionTrackerTopicOnServerCreated: return {
            ...state
        };
        case ActionTrackerTopicActionTypes.ActionTrackerTopicCreated: return adapter.addOne(action.payload.ActionTrackerTopic, {
            ...state, lastCreatedActionTrackerTopicId: action.payload.ActionTrackerTopic.id
        });
        case ActionTrackerTopicActionTypes.ActionTrackerTopicUpdated: return adapter.updateOne(action.payload.partialActionTrackerTopic, state);
        case ActionTrackerTopicActionTypes.ActionTrackerTopicDeleted: return adapter.removeOne(action.payload.id, state);
        case ActionTrackerTopicActionTypes.AllActionTrackerTopicsLoaded: return adapter.addAll(action.payload.ActionTrackerTopics, {
            ...state, isAllActionTrackerTopicsLoaded: true
        });
        case ActionTrackerTopicActionTypes.ActionTrackerTopicsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case ActionTrackerTopicActionTypes.ActionTrackerTopicsPageLoaded: return adapter.addMany(action.payload.ActionTrackerTopics, {
            ...initialActionTrackerTopicsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.ActionTrackerTopics,
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
