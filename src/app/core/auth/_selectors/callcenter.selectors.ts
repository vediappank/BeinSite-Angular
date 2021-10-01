import { CallCenter } from './../_models/CallCenter.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { CallCentersState } from '../_reducers/CallCenter.reducers';
import * as fromCallCenter from '../_reducers/CallCenter.reducers';
import { each } from 'lodash';

export const selectCallCentersState = createFeatureSelector<CallCentersState>('callcenters');

export const selectCallCenterById = (CallCenterId: number) => createSelector(
    selectCallCentersState,
    callcenterState => callcenterState.entities[CallCenterId]
);

export const allCallCentersLoaded = createSelector(
    selectCallCentersState,
    callcenterState => callcenterState.isAllCallCentersLoaded
);


export const selectAllCallCenters = createSelector(
    selectCallCentersState,
    fromCallCenter.selectAll
);

export const selectAllCallCentersIds = createSelector(
    selectCallCentersState,
    fromCallCenter.selectIds
);

export const selectCallCentersPageLoading = createSelector(
    selectCallCentersState,
    CallCentersState => CallCentersState.listLoading
);

export const selectCallCentersActionLoading = createSelector(
    selectCallCentersState,
    CallCentersState => CallCentersState.actionsloading
);

export const selectLastCreatedCallCenterId = createSelector(
    selectCallCentersState,
    CallCentersState => CallCentersState.lastCreatedCallCenterId
);

export const selectCallCentersShowInitWaitingMessage = createSelector(
    selectCallCentersState,
    CallCentersState => CallCentersState.showInitWaitingMessage
);


export const selectCallCenterQueryResult = createSelector(
    selectCallCentersState,
    CallCentersState => {
        const items: CallCenter[] = [];
        each(CallCentersState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: CallCenter[] = httpExtension.sortArray(items, CallCentersState.lastQuery.sortField, CallCentersState.lastQuery.sortOrder);

        return new QueryResultsModel(CallCentersState.queryResult, CallCentersState.queryRowsCount);
    }
);
