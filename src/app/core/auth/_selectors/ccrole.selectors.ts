import { CCRole } from './../_models/ccrole.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { CCRolesState } from '../_reducers/ccrole.reducers';
import * as fromRole from '../_reducers/ccrole.reducers';
import { each } from 'lodash';

export const selectRolesState = createFeatureSelector<CCRolesState>('ccroles');

export const selectCCRoleById = (roleId: number) => createSelector(
    selectRolesState,
    rolesState => rolesState.entities[roleId]
);

export const selectAllCCRoles = createSelector(
    selectRolesState,
    fromRole.selectAll
);

export const selectAllCCRolesIds = createSelector(
    selectRolesState,
    fromRole.selectIds
);

export const allCCRolesLoaded = createSelector(
    selectRolesState,
    rolesState => rolesState.isAllRolesLoaded
);


export const selectCCRolesPageLoading = createSelector(
    selectRolesState,
    rolesState => rolesState.listLoading
);

export const selectCCRolesActionLoading = createSelector(
    selectRolesState,
    rolesState => rolesState.actionsloading
);

export const selectLastCreatedCCRoleId = createSelector(
    selectRolesState,
    rolesState => rolesState.lastCreatedRoleId
);

export const selectCCRolesShowInitWaitingMessage = createSelector(
    selectRolesState,
    rolesState => rolesState.showInitWaitingMessage
);


export const CCRoleselectQueryResult = createSelector(
    selectRolesState,
    rolesState => {
        const items: CCRole[] = [];
        each(rolesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: CCRole[] = httpExtension.sortArray(items, rolesState.lastQuery.sortField, rolesState.lastQuery.sortOrder);

        return new QueryResultsModel(rolesState.queryResult, rolesState.queryRowsCount);
    }
);
