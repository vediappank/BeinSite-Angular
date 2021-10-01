// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CCKpiActions, CCKpiActionTypes } from '../_actions/cckpi.actions';
// Models
import { CCKpi } from '../_models/cckpi.model';
import { QueryParamsModel } from '../../_base/crud';

export interface CCKpiState extends EntityState<CCKpi> {
    isAllKpisLoaded: boolean;
    queryRowsCount: number;
    queryResult: CCKpi[];
    lastCreatedKpiId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CCKpi> = createEntityAdapter<CCKpi>();

export const initialKpisState: CCKpiState = adapter.getInitialState({
    isAllKpisLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedKpiId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function CCkpiReducer(state = initialKpisState, action: CCKpiActions): CCKpiState {
    switch  (action.type) {
        case CCKpiActionTypes.CCKpisPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedKpiId: undefined
        };
        case CCKpiActionTypes.CCKpisActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CCKpiActionTypes.CCKpiOnServerCreated: return {
            ...state
        };
        case CCKpiActionTypes.CCKpiCreated: return adapter.addOne(action.payload.kpi, {
            ...state, lastCreatedKpiId: action.payload.kpi.id
        });
        case CCKpiActionTypes.CCKpiUpdated: return adapter.updateOne(action.payload.partialkpi, state);
        case CCKpiActionTypes.CCKpiDeleted: return adapter.removeOne(action.payload.Kpi_ID, state);
        case CCKpiActionTypes.AllCCKpisLoaded: return adapter.addAll(action.payload.kpis, {
            ...state, isAllKpisLoaded: true
        });
        case CCKpiActionTypes.CCKpisPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case CCKpiActionTypes.CCKpisPageLoaded: return adapter.addMany(action.payload.kpis, {
            ...initialKpisState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.kpis,
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
