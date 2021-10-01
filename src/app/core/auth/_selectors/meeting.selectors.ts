import { MeetingModel } from './../_models/meeting.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { MeetingState } from '../_reducers/meeting.reducers';
import * as fromMeeting from '../_reducers/meeting.reducers';
import { each } from 'lodash';

export const selectMeetingsState = createFeatureSelector<MeetingState>('Meeting');

export const selectMeetingById = (id: number) => createSelector(
    selectMeetingsState,
    meetingsState => meetingsState.entities[id]
);

export const selectAllMeetings = createSelector(
    selectMeetingsState,
    fromMeeting.selectAll
);

export const selectAllMeetingsIds = createSelector(
    selectMeetingsState,
    fromMeeting.selectIds
);

export const allMeetingsLoaded = createSelector(
    selectMeetingsState,
    meetingsState => meetingsState.isAllMeetingsLoaded
);


export const selectMeetingsPageLoading = createSelector(
    selectMeetingsState,
    meetingsState => meetingsState.listLoading
);

export const selectMeetingsActionLoading = createSelector(
    selectMeetingsState,
    meetingsState => meetingsState.actionsloading
);

export const selectLastCreatedMeetingId = createSelector(
    selectMeetingsState,
    meetingsState => meetingsState.lastCreatedMeetingId
);

export const selectMeetingsShowInitWaitingMessage = createSelector(
    selectMeetingsState,
    meetingsState => meetingsState.showInitWaitingMessage
);


export const MeetingselectQueryResult = createSelector(
    selectMeetingsState,
    meetingsState => {
        const items: MeetingModel[] = [];
        each(meetingsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MeetingModel[] = httpExtension.sortArray(items, meetingsState.lastQuery.sortField, meetingsState.lastQuery.sortOrder);

        return new QueryResultsModel(meetingsState.queryResult, meetingsState.queryRowsCount);
    }
);
