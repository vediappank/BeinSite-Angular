import { ActionTracker } from './../_models/ActionTracker.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ActionTrackersState } from '../_reducers/ActionTracker.reducers';
import * as fromActionTracker from '../_reducers/ActionTracker.reducers';
import { each } from 'lodash';

export const selectActionTrackersState = createFeatureSelector<ActionTrackersState>('ActionTrackers');

export const selectActionTrackerById = (ActionTrackerId: number) => createSelector(
    selectActionTrackersState,
    acitivityState => acitivityState.entities[ActionTrackerId]
);

export const allActionTrackersLoaded = createSelector(
    selectActionTrackersState,
    acitivityState => acitivityState.isAllActionTrackersLoaded
);


export const selectAllActionTrackers = createSelector(
    selectActionTrackersState,
    fromActionTracker.selectAll
);

export const selectAllActionTrackersIds = createSelector(
    selectActionTrackersState,
    fromActionTracker.selectIds
);

export const selectActionTrackersPageLoading = createSelector(
    selectActionTrackersState,
    ActionTrackersState => ActionTrackersState.listLoading
);

export const selectActionTrackersActionLoading = createSelector(
    selectActionTrackersState,
    ActionTrackersState => ActionTrackersState.actionsloading
);

export const selectLastCreatedActionTrackerId = createSelector(
    selectActionTrackersState,
    ActionTrackersState => ActionTrackersState.lastCreatedActionTrackerId
);

export const selectActionTrackersShowInitWaitingMessage = createSelector(
    selectActionTrackersState,
    ActionTrackersState => ActionTrackersState.showInitWaitingMessage
);


export const selectActionTrackerQueryResult = createSelector(
    selectActionTrackersState,
    ActionTrackersState => {
        const items: ActionTracker[] = [];
        each(ActionTrackersState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: ActionTracker[] = httpExtension.sortArray(items, ActionTrackersState.lastQuery.sortField, ActionTrackersState.lastQuery.sortOrder);

        return new QueryResultsModel(ActionTrackersState.queryResult, ActionTrackersState.queryRowsCount);
    }
);
