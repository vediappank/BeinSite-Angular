// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CCRoleActions, CCRoleActionTypes } from '../_actions/ccrole.actions'
// Models
import { CCRole } from '../_models/ccrole.model';
import { QueryParamsModel } from '../../_base/crud';

export interface CCRolesState extends EntityState<CCRole> {
    isAllRolesLoaded: boolean;
    queryRowsCount: number;
    queryResult: CCRole[];
    lastCreatedRoleId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CCRole> = createEntityAdapter<CCRole>();

export const initialRolesState: CCRolesState = adapter.getInitialState({
    isAllRolesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedRoleId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function ccrolesReducer(state = initialRolesState, action: CCRoleActions): CCRolesState {
    switch  (action.type) {
        case CCRoleActionTypes.CCRolesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedRoleId: undefined
        };
        case CCRoleActionTypes.CCRolesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CCRoleActionTypes.CCRoleOnServerCreated: return {
            ...state
        };
        case CCRoleActionTypes.CCRoleCreated: return adapter.addOne(action.payload.role, {
            ...state, lastCreatedRoleId: action.payload.role.id
        });
        case CCRoleActionTypes.CCRoleUpdated: return adapter.updateOne(action.payload.partialrole, state);
        case CCRoleActionTypes.CCRoleDeleted: return adapter.removeOne(action.payload.id, state);
        case CCRoleActionTypes.AllCCRolesLoaded: return adapter.addAll(action.payload.roles, {
            ...state, isAllRolesLoaded: true
        });
        case CCRoleActionTypes.CCRolesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case CCRoleActionTypes.CCRolesPageLoaded: return adapter.addMany(action.payload.roles, {
            ...initialRolesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.roles,
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
