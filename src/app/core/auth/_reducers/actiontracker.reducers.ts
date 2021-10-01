// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { ActionTrackerActions, ActionTrackerActionTypes } from '../_actions/ActionTracker.actions';
// Models
import { ActionTracker } from '../_models/ActionTracker.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ActionTrackersState extends EntityState<ActionTracker> {
    isAllActionTrackersLoaded: boolean;
    queryRowsCount: number;
    queryResult: ActionTracker[];
    lastCreatedActionTrackerId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ActionTracker> = createEntityAdapter<ActionTracker>();

export const initialActionTrackersState: ActionTrackersState = adapter.getInitialState({
    isAllActionTrackersLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedActionTrackerId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function ActionTrackerReducer(state = initialActionTrackersState, action: ActionTrackerActions): ActionTrackersState {
    switch  (action.type) {
        case ActionTrackerActionTypes.ActionTrackersPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedActionTrackerId: undefined
        };
        case ActionTrackerActionTypes.ActionTrackersActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case ActionTrackerActionTypes.ActionTrackerOnServerCreated: return {
            ...state
        };
        case ActionTrackerActionTypes.ActionTrackerCreated: return adapter.addOne(action.payload.ActionTracker, {
            ...state, lastCreatedActionTrackerId: action.payload.ActionTracker.id
        });
        case ActionTrackerActionTypes.ActionTrackerUpdated: return adapter.updateOne(action.payload.partialActionTracker, state);
        case ActionTrackerActionTypes.ActionTrackerDeleted: return adapter.removeOne(action.payload.id, state);
        case ActionTrackerActionTypes.AllActionTrackersLoaded: return adapter.addAll(action.payload.ActionTrackers, {
            ...state, isAllActionTrackersLoaded: true
        });
        case ActionTrackerActionTypes.ActionTrackersPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case ActionTrackerActionTypes.ActionTrackersPageLoaded: return adapter.addMany(action.payload.ActionTrackers, {
            ...initialActionTrackersState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.ActionTrackers,
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
