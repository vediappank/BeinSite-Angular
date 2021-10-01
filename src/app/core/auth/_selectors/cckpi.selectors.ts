import { CCKpi } from './../_models/cckpi.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { CCKpiState } from '../_reducers/cckpi.reducers';
import * as fromKpi from '../_reducers/cckpi.reducers';
import { each } from 'lodash';

export const selectKpisState = createFeatureSelector<CCKpiState>('CCkpis');

export const selectCCKpiById = (id: number) => createSelector(
    selectKpisState,
    kpisState => kpisState.entities[id]
);

export const selectAllCCKpis = createSelector(
    selectKpisState,
    fromKpi.selectAll
);

export const selectAllCCKpisIds = createSelector(
    selectKpisState,
    fromKpi.selectIds
);

export const allCCKpisLoaded = createSelector(
    selectKpisState,
    kpisState => kpisState.isAllKpisLoaded
);


export const selectCCKpisPageLoading = createSelector(
    selectKpisState,
    kpisState => kpisState.listLoading
);

export const selectCCKpisActionLoading = createSelector(
    selectKpisState,
    kpisState => kpisState.actionsloading
);

export const selectLastCreatedCCKpiId = createSelector(
    selectKpisState,
    kpisState => kpisState.lastCreatedKpiId
);

export const selectCCKpisShowInitWaitingMessage = createSelector(
    selectKpisState,
    kpisState => kpisState.showInitWaitingMessage
);


export const CCKpiselectQueryResult = createSelector(
    selectKpisState,
    kpisState => {
        const items: CCKpi[] = [];
        each(kpisState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: CCKpi[] = httpExtension.sortArray(items, kpisState.lastQuery.sortField, kpisState.lastQuery.sortOrder);

        return new QueryResultsModel(kpisState.queryResult, kpisState.queryRowsCount);
    }
);
