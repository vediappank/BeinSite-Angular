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
import { allActivitysLoaded } from '../_selectors/ccactivity.selectors';
// Actions
import {
    AllActivitysLoaded,
    AllActivitysRequested,
    ActivityActionTypes,
    ActivitysPageRequested,
    ActivitysPageLoaded,
    ActivityUpdated,
    ActivitysPageToggleLoading,
    ActivityDeleted,
    ActivityOnServerCreated,
    ActivityCreated,
    ActivitysActionToggleLoading
} from '../_actions/ccactivity.actions'

@Injectable()
export class ActivityEffects {
    showPageLoadingDistpatcher = new ActivitysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new ActivitysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new ActivitysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new ActivitysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllActivitys$ = this.actions$
        .pipe(
            ofType<AllActivitysRequested>(ActivityActionTypes.AllActivitysRequested),
            withLatestFrom(this.store.pipe(select(allActivitysLoaded))),
            filter(([action, isAllActivitysLoaded]) => !isAllActivitysLoaded),
            mergeMap(() => this.auth.GetAllMasterActivity()),
            map(activitys => {                             
                return new AllActivitysLoaded({activitys});
            })
          );

    @Effect()
    loadActivitysPage$ = this.actions$
        .pipe(
            ofType<ActivitysPageRequested>(ActivityActionTypes.ActivitysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findActivitys called ');
                
                const requestToServer = this.auth.findCCActivity(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new ActivitysPageLoaded({
                    activitys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteActivity$ = this.actions$
        .pipe(
            ofType<ActivityDeleted>(ActivityActionTypes.ActivityDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteCCActivity(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateActivity$ = this.actions$
        .pipe(
            ofType<ActivityUpdated>(ActivityActionTypes.ActivityUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCCActivity(payload.activity);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createActivity$ = this.actions$
        .pipe(
            ofType<ActivityOnServerCreated>(ActivityActionTypes.ActivityOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCCActivity(payload.activity).pipe(
                    tap(res => {
                        this.store.dispatch(new ActivityCreated({ activity: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllActivitysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
