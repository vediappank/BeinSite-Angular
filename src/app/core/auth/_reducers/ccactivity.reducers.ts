// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { ActivityActions, ActivityActionTypes } from '../_actions/ccactivity.actions';
// Models
import { CCActivity } from '../_models/ccactivity.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ActivitysState extends EntityState<CCActivity> {
    isAllActivitysLoaded: boolean;
    queryRowsCount: number;
    queryResult: CCActivity[];
    lastCreatedActivityId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CCActivity> = createEntityAdapter<CCActivity>();

export const initialActivitysState: ActivitysState = adapter.getInitialState({
    isAllActivitysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedActivityId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function activityReducer(state = initialActivitysState, action: ActivityActions): ActivitysState {
    switch  (action.type) {
        case ActivityActionTypes.ActivitysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedActivityId: undefined
        };
        case ActivityActionTypes.ActivitysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case ActivityActionTypes.ActivityOnServerCreated: return {
            ...state
        };
        case ActivityActionTypes.ActivityCreated: return adapter.addOne(action.payload.activity, {
            ...state, lastCreatedActivityId: action.payload.activity.id
        });
        case ActivityActionTypes.ActivityUpdated: return adapter.updateOne(action.payload.partialactivity, state);
        case ActivityActionTypes.ActivityDeleted: return adapter.removeOne(action.payload.id, state);
        case ActivityActionTypes.AllActivitysLoaded: return adapter.addAll(action.payload.activitys, {
            ...state, isAllActivitysLoaded: true
        });
        case ActivityActionTypes.ActivitysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case ActivityActionTypes.ActivitysPageLoaded: return adapter.addMany(action.payload.activitys, {
            ...initialActivitysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.activitys,
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
