// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { MeetingModel } from '../_models/meeting.model';

export enum MeetingActionTypes {
    AllMeetingsRequested = '[Meetings Home Page] All Meetings Requested',
    AllMeetingsLoaded = '[Meetings API] All Meetings Loaded',
    MeetingOnServerCreated = '[Edit Meetings Dialog] Meetings On Server Created',
    MeetingCreated = '[Edit Meetings Dialog] Meetings Created',
    MeetingUpdated = '[Edit Meetings Dialog] Meetings Updated',
    MeetingDeleted = '[Meetings List Page] Meetings Deleted',
    MeetingsPageRequested = '[Meetings List Page] Meetings Page Requested',
    MeetingsPageLoaded = '[Meetings API] Meetings Page Loaded',
    MeetingsPageCancelled = '[Meetings API] Meetings Page Cancelled',
    MeetingsPageToggleLoading = '[Meetings page] Meetings Page Toggle Loading',
    MeetingsActionToggleLoading = '[Meetings] Meetings Action Toggle Loading'
}

export class MeetingOnServerCreated implements Action {
    readonly type = MeetingActionTypes.MeetingOnServerCreated;
    constructor(public payload: { meeting: MeetingModel }) { }
}

export class MeetingCreated implements Action {
    readonly type = MeetingActionTypes.MeetingCreated;
    constructor(public payload: { meeting: MeetingModel }) { }
}

export class MeetingUpdated implements Action {
    readonly type = MeetingActionTypes.MeetingUpdated;
    constructor(public payload: {
        partialmeeting: Update<MeetingModel>,
        meeting: MeetingModel
    }) { }
}

export class MeetingDeleted implements Action {
    readonly type = MeetingActionTypes.MeetingDeleted;
    constructor(public payload: { Meeting_ID: number }) {}
}

export class MeetingsPageRequested implements Action {
    readonly type = MeetingActionTypes.MeetingsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class MeetingsPageLoaded implements Action {
    readonly type = MeetingActionTypes.MeetingsPageLoaded;
    constructor(public payload: { meetings: MeetingModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class MeetingsPageCancelled implements Action {
    readonly type = MeetingActionTypes.MeetingsPageCancelled;
}

export class AllMeetingsRequested implements Action {
    readonly type = MeetingActionTypes.AllMeetingsRequested;
}

export class AllMeetingsLoaded implements Action {
    readonly type = MeetingActionTypes.AllMeetingsLoaded;
    constructor(public payload: { meetings: MeetingModel[] }) { }
}

export class MeetingsPageToggleLoading implements Action {
    readonly type = MeetingActionTypes.MeetingsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class MeetingsActionToggleLoading implements Action {
    readonly type = MeetingActionTypes.MeetingsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type MeetingActions = MeetingCreated
| MeetingUpdated
| MeetingDeleted
| MeetingsPageRequested
| MeetingsPageLoaded
| MeetingsPageCancelled
| AllMeetingsLoaded
| AllMeetingsRequested
| MeetingOnServerCreated
| MeetingsPageToggleLoading
| MeetingsActionToggleLoading;
