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
import { allCallCentersLoaded } from '../_selectors/CallCenter.selectors';
// Actions
import {
    AllCallCentersLoaded,
    AllCallCentersRequested,
    CallCenterActionTypes,
    CallCentersPageRequested,
    CallCentersPageLoaded,
    CallCenterUpdated,
    CallCentersPageToggleLoading,
    CallCenterDeleted,
    CallCenterOnServerCreated,
    CallCenterCreated,
    CallCentersActionToggleLoading
} from '../_actions/calcenter.actions'

@Injectable()
export class CallCenterEffects {
    showPageLoadingDistpatcher = new CallCentersPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new CallCentersPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new CallCentersActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new CallCentersActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllCallCenters$ = this.actions$
        .pipe(
            ofType<AllCallCentersRequested>(CallCenterActionTypes.AllCallCentersRequested),
            withLatestFrom(this.store.pipe(select(allCallCentersLoaded))),
            filter(([action, isAllCallCentersLoaded]) => !isAllCallCentersLoaded),
            mergeMap(() => this.auth.GetAllCallCenters()),
            map(CallCenters => {                             
                return new AllCallCentersLoaded({CallCenters});
            })
          );

    @Effect()
    loadCallCentersPage$ = this.actions$
        .pipe(
            ofType<CallCentersPageRequested>(CallCenterActionTypes.CallCentersPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // 
                //alert('findCallCenters called ');                
                const requestToServer = this.auth.findCallCenters(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new CallCentersPageLoaded({
                    CallCenters: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteCallCenter$ = this.actions$
        .pipe(
            ofType<CallCenterDeleted>(CallCenterActionTypes.CallCenterDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteCallCenter(payload.cc_id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateCallCenter$ = this.actions$
        .pipe(
            ofType<CallCenterUpdated>(CallCenterActionTypes.CallCenterUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCallCenter(payload.CallCenter);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createCallCenter$ = this.actions$
        .pipe(
            ofType<CallCenterOnServerCreated>(CallCenterActionTypes.CallCenterOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCallCenter(payload.CallCenter).pipe(
                    tap(res => {
                        this.store.dispatch(new CallCenterCreated({ CallCenter: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllCallCentersRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
