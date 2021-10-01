// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { MeetingActions, MeetingActionTypes } from '../_actions/meeting.actions';
// Models
import { MeetingModel } from '../_models/meeting.model'
import { QueryParamsModel } from '../../_base/crud';

export interface MeetingState extends EntityState<MeetingModel> {
    isAllMeetingsLoaded: boolean;
    queryRowsCount: number;
    queryResult: MeetingModel[];
    lastCreatedMeetingId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MeetingModel> = createEntityAdapter<MeetingModel>();

export const initialMeetingState: MeetingState = adapter.getInitialState({
    isAllMeetingsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedMeetingId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function MeetingReducer(state = initialMeetingState, action: MeetingActions): MeetingState {
    switch  (action.type) {
        case MeetingActionTypes.MeetingsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedMeetingId: undefined
        };
        case MeetingActionTypes.MeetingsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case MeetingActionTypes.MeetingOnServerCreated: return {
            ...state
        };
        case MeetingActionTypes.MeetingCreated: return adapter.addOne(action.payload.meeting, {
            ...state, lastCreatedKpiId: action.payload.meeting.id
        });
        case MeetingActionTypes.MeetingUpdated: return adapter.updateOne(action.payload.partialmeeting, state);
        case MeetingActionTypes.MeetingDeleted: return adapter.removeOne(action.payload.Meeting_ID, state);
        case MeetingActionTypes.AllMeetingsLoaded: return adapter.addAll(action.payload.meetings, {
            ...state, isAllKpisLoaded: true
        });
        case MeetingActionTypes.MeetingsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case MeetingActionTypes.MeetingsPageLoaded: return adapter.addMany(action.payload.meetings, {
            ...initialMeetingState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.meetings,
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
