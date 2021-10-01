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
import { allActionTrackersLoaded } from '../_selectors/ActionTracker.selectors';
// Actions
import {
    AllActionTrackersLoaded,
    AllActionTrackersRequested,
    ActionTrackerActionTypes,
    ActionTrackersPageRequested,
    ActionTrackersPageLoaded,
    ActionTrackerUpdated,
    ActionTrackersPageToggleLoading,
    ActionTrackerDeleted,
    ActionTrackerOnServerCreated,
    ActionTrackerCreated,
    ActionTrackersActionToggleLoading
} from '../_actions/ActionTracker.actions'

@Injectable()
export class ActionTrackerEffects {
    showPageLoadingDistpatcher = new ActionTrackersPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new ActionTrackersPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new ActionTrackersActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new ActionTrackersActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllActionTrackers$ = this.actions$
        .pipe(
            ofType<AllActionTrackersRequested>(ActionTrackerActionTypes.AllActionTrackersRequested),
            withLatestFrom(this.store.pipe(select(allActionTrackersLoaded))),
            filter(([action, isAllActionTrackersLoaded]) => !isAllActionTrackersLoaded),
            mergeMap(() => this.auth.getAllActionTrackers()),
            map(ActionTrackers => {                             
                return new AllActionTrackersLoaded({ActionTrackers});
            })
          );

    @Effect()
    loadActionTrackersPage$ = this.actions$
        .pipe(
            ofType<ActionTrackersPageRequested>(ActionTrackerActionTypes.ActionTrackersPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findActionTrackers called ');
                
                const requestToServer = this.auth.findActionTrackers(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new ActionTrackersPageLoaded({
                    ActionTrackers: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteActionTracker$ = this.actions$
        .pipe(
            ofType<ActionTrackerDeleted>(ActionTrackerActionTypes.ActionTrackerDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteActionTracker(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateActionTracker$ = this.actions$
        .pipe(
            ofType<ActionTrackerUpdated>(ActionTrackerActionTypes.ActionTrackerUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateActionTracker(payload.ActionTracker);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createActionTracker$ = this.actions$
        .pipe(
            ofType<ActionTrackerOnServerCreated>(ActionTrackerActionTypes.ActionTrackerOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createActionTracker(payload.ActionTracker).pipe(
                    tap(res => {
                        this.store.dispatch(new ActionTrackerCreated({ ActionTracker: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllActionTrackersRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
