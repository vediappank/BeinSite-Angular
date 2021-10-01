import { CCActivity } from './../_models/ccactivity.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ActivitysState } from '../_reducers/ccactivity.reducers';
import * as fromActivity from '../_reducers/ccactivity.reducers';
import { each } from 'lodash';

export const selectActivitysState = createFeatureSelector<ActivitysState>('activitys');

export const selectActivityById = (activityId: number) => createSelector(
    selectActivitysState,
    acitivityState => acitivityState.entities[activityId]
);

export const allActivitysLoaded = createSelector(
    selectActivitysState,
    acitivityState => acitivityState.isAllActivitysLoaded
);


export const selectAllActivitys = createSelector(
    selectActivitysState,
    fromActivity.selectAll
);

export const selectAllActivitysIds = createSelector(
    selectActivitysState,
    fromActivity.selectIds
);

export const selectActivitysPageLoading = createSelector(
    selectActivitysState,
    activitysState => activitysState.listLoading
);

export const selectActivitysActionLoading = createSelector(
    selectActivitysState,
    activitysState => activitysState.actionsloading
);

export const selectLastCreatedActivityId = createSelector(
    selectActivitysState,
    activitysState => activitysState.lastCreatedActivityId
);

export const selectActivitysShowInitWaitingMessage = createSelector(
    selectActivitysState,
    activitysState => activitysState.showInitWaitingMessage
);


export const selectActivityQueryResult = createSelector(
    selectActivitysState,
    activitysState => {
        const items: CCActivity[] = [];
        each(activitysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: CCActivity[] = httpExtension.sortArray(items, activitysState.lastQuery.sortField, activitysState.lastQuery.sortOrder);

        return new QueryResultsModel(activitysState.queryResult, activitysState.queryRowsCount);
    }
);
