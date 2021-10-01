// Angular
import { Injectable } from '@angular/core';
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { AuthService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allMeetingsLoaded } from '../_selectors/meeting.selectors'
// Actions
import {
    AllMeetingsLoaded,
    AllMeetingsRequested,
    MeetingActionTypes,
    MeetingsPageRequested,
    MeetingsPageLoaded,
    MeetingUpdated,
    MeetingsPageToggleLoading,
    MeetingDeleted,
    MeetingOnServerCreated,
    MeetingCreated,
    MeetingsActionToggleLoading
} from '../_actions/meeting.actions'

@Injectable()
export class MeetingEffects {
    showPageLoadingDistpatcher = new MeetingsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new MeetingsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new MeetingsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new MeetingsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllMeetings$ = this.actions$
        .pipe(
            ofType<AllMeetingsRequested>(MeetingActionTypes.AllMeetingsRequested),
            withLatestFrom(this.store.pipe(select(allMeetingsLoaded))),
            filter(([action, isAllMeetingsLoaded]) => !isAllMeetingsLoaded),
            mergeMap(() => this.auth.GetAllMeeting()),
            map(meetings => {                   
                return new AllMeetingsLoaded({meetings});
            })
          );

    @Effect()
    loadMeetingsPage$ = this.actions$
        .pipe(
            ofType<MeetingsPageRequested>(MeetingActionTypes.MeetingsPageRequested),
            mergeMap(( { payload } ) => {
               //
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findMeetings called ');
                const requestToServer = this.auth.findMeeting(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new MeetingsPageLoaded({
                    meetings: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteMeeting$ = this.actions$
        .pipe(
            ofType<MeetingDeleted>(MeetingActionTypes.MeetingDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteMeeting(payload.Meeting_ID);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateMeeting$ = this.actions$
        .pipe(
            ofType<MeetingUpdated>(MeetingActionTypes.MeetingUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateMeeting(payload.meeting);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createMeeting$ = this.actions$
        .pipe(
            ofType<MeetingOnServerCreated>(MeetingActionTypes.MeetingOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createMeeting(payload.meeting).pipe(
                    tap(res => {
                        this.store.dispatch(new MeetingCreated({ meeting: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllMeetingsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
