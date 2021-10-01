import { ActionTrackerTopic } from './../_models/ActionTrackerTopic.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ActionTrackerTopicsState } from '../_reducers/actiontrackertopic.reducers';
import * as fromActionTrackerTopic from '../_reducers/actiontrackertopic.reducers';
import { each } from 'lodash';

export const selectActionTrackerTopicsState = createFeatureSelector<ActionTrackerTopicsState>('ActionTrackerTopics');

export const selectActionTrackerTopicById = (ActionTrackerTopicId: number) => createSelector(
    selectActionTrackerTopicsState,
    acitivityState => acitivityState.entities[ActionTrackerTopicId]
);

export const allActionTrackerTopicsLoaded = createSelector(
    selectActionTrackerTopicsState,
    acitivityState => acitivityState.isAllActionTrackerTopicsLoaded
);


export const selectAllActionTrackerTopics = createSelector(
    selectActionTrackerTopicsState,
    fromActionTrackerTopic.selectAll
);

export const selectAllActionTrackerTopicsIds = createSelector(
    selectActionTrackerTopicsState,
    fromActionTrackerTopic.selectIds
);

export const selectActionTrackerTopicsPageLoading = createSelector(
    selectActionTrackerTopicsState,
    ActionTrackerTopicsState => ActionTrackerTopicsState.listLoading
);

export const selectActionTrackerTopicsActionLoading = createSelector(
    selectActionTrackerTopicsState,
    ActionTrackerTopicsState => ActionTrackerTopicsState.actionsloading
);

export const selectLastCreatedActionTrackerTopicId = createSelector(
    selectActionTrackerTopicsState,
    ActionTrackerTopicsState => ActionTrackerTopicsState.lastCreatedActionTrackerTopicId
);

export const selectActionTrackerTopicsShowInitWaitingMessage = createSelector(
    selectActionTrackerTopicsState,
    ActionTrackerTopicsState => ActionTrackerTopicsState.showInitWaitingMessage
);


export const selectActionTrackerTopicQueryResult = createSelector(
    selectActionTrackerTopicsState,
    ActionTrackerTopicsState => {
        const items: ActionTrackerTopic[] = [];
        each(ActionTrackerTopicsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: ActionTrackerTopic[] = httpExtension.sortArray(items, ActionTrackerTopicsState.lastQuery.sortField, ActionTrackerTopicsState.lastQuery.sortOrder);

        return new QueryResultsModel(ActionTrackerTopicsState.queryResult, ActionTrackerTopicsState.queryRowsCount);
    }
);
