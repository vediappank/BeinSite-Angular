import { ActionTrackerTopicConversation } from './../_models/actiontrackertopicconversation.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ActionTrackerTopicConversationsState } from '../_reducers/actiontrackertopicconversation.reducers';
import * as fromActionTrackerTopicConversation from '../_reducers/actiontrackertopicconversation.reducers';
import { each } from 'lodash';

export const selectActionTrackerTopicConversationsState = createFeatureSelector<ActionTrackerTopicConversationsState>('ActionTrackerTopicCovnersation');

export const selectActionTrackerTopicConversationById = (ActionTrackerTopicConversationId: number) => createSelector(
    selectActionTrackerTopicConversationsState,
    acitivityState => acitivityState.entities[ActionTrackerTopicConversationId]
);

export const allActionTrackerTopicConversationsLoaded = createSelector(
    selectActionTrackerTopicConversationsState,
    acitivityState => acitivityState.isAllActionTrackerTopicConversationsLoaded
);


export const selectAllActionTrackerTopicConversations = createSelector(
    selectActionTrackerTopicConversationsState,
    fromActionTrackerTopicConversation.selectAll
);

export const selectAllActionTrackerTopicConversationsIds = createSelector(
    selectActionTrackerTopicConversationsState,
    fromActionTrackerTopicConversation.selectIds
);

export const selectActionTrackerTopicConversationsPageLoading = createSelector(
    selectActionTrackerTopicConversationsState,
    ActionTrackerTopicConversationsState => ActionTrackerTopicConversationsState.listLoading
);

export const selectActionTrackerTopicConversationsActionLoading = createSelector(
    selectActionTrackerTopicConversationsState,
    ActionTrackerTopicConversationsState => ActionTrackerTopicConversationsState.actionsloading
);

export const selectLastCreatedActionTrackerTopicConversationId = createSelector(
    selectActionTrackerTopicConversationsState,
    ActionTrackerTopicConversationsState => ActionTrackerTopicConversationsState.lastCreatedActionTrackerTopicConversationId
);

export const selectActionTrackerTopicConversationsShowInitWaitingMessage = createSelector(
    selectActionTrackerTopicConversationsState,
    ActionTrackerTopicConversationsState => ActionTrackerTopicConversationsState.showInitWaitingMessage
);


export const selectActionTrackerTopicConversationQueryResult = createSelector(
    selectActionTrackerTopicConversationsState,
    ActionTrackerTopicConversationsState => {
        const items: ActionTrackerTopicConversation[] = [];
        each(ActionTrackerTopicConversationsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: ActionTrackerTopicConversation[] = httpExtension.sortArray(items, ActionTrackerTopicConversationsState.lastQuery.sortField, ActionTrackerTopicConversationsState.lastQuery.sortOrder);

        return new QueryResultsModel(ActionTrackerTopicConversationsState.queryResult, ActionTrackerTopicConversationsState.queryRowsCount);
    }
);
