// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CallCenterActions, CallCenterActionTypes } from '../_actions/calcenter.actions';
// Models
import { CallCenter } from '../_models/CallCenter.model';
import { QueryParamsModel } from '../../_base/crud';

export interface CallCentersState extends EntityState<CallCenter> {
    isAllCallCentersLoaded: boolean;
    queryRowsCount: number;
    queryResult: CallCenter[];
    lastCreatedCallCenterId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CallCenter> = createEntityAdapter<CallCenter>();

export const initialCallCentersState: CallCentersState = adapter.getInitialState({
    isAllCallCentersLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedCallCenterId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function CallCenterReducer(state = initialCallCentersState, action: CallCenterActions): CallCentersState {
    switch  (action.type) {
        case CallCenterActionTypes.CallCentersPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedCallCenterId: undefined
        };
        case CallCenterActionTypes.CallCentersActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CallCenterActionTypes.CallCenterOnServerCreated: return {
            ...state
        };
        case CallCenterActionTypes.CallCenterCreated: return adapter.addOne(action.payload.CallCenter, {
            ...state, lastCreatedCallCenterId: action.payload.CallCenter.cc_id
        });
        case CallCenterActionTypes.CallCenterUpdated: return adapter.updateOne(action.payload.partialCallCenter, state);
        case CallCenterActionTypes.CallCenterDeleted: return adapter.removeOne(action.payload.cc_id, state);
        case CallCenterActionTypes.AllCallCentersLoaded: return adapter.addAll(action.payload.CallCenters, {
            ...state, isAllCallCentersLoaded: true
        });
        case CallCenterActionTypes.CallCentersPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case CallCenterActionTypes.CallCentersPageLoaded: return adapter.addMany(action.payload.CallCenters, {
            ...initialCallCentersState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.CallCenters,
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
