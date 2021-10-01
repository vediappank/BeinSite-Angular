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
import { allCCKpisLoaded } from '../_selectors/cckpi.selectors';
// Actions
import {
    AllCCKpisLoaded,
    AllCCKpisRequested,
    CCKpiActionTypes,
    CCKpisPageRequested,
    CCKpisPageLoaded,
    CCKpiUpdated,
    CCKpisPageToggleLoading,
    CCKpiDeleted,
    CCKpiOnServerCreated,
    CCKpiCreated,
    CCKpisActionToggleLoading
} from '../_actions/cckpi.actions';

@Injectable()
export class CCKpiEffects {
    showPageLoadingDistpatcher = new CCKpisPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new CCKpisPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new CCKpisActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new CCKpisActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllCCKpis$ = this.actions$
        .pipe(
            ofType<AllCCKpisRequested>(CCKpiActionTypes.AllCCKpisRequested),
            withLatestFrom(this.store.pipe(select(allCCKpisLoaded))),
            filter(([action, isAllKpisLoaded]) => !isAllKpisLoaded),
            mergeMap(() => this.auth.GetAllCCKpi()),
            map(kpis => { 
              //                
                return new AllCCKpisLoaded({kpis});
            })
          );

    @Effect()
    loadCCKpisPage$ = this.actions$
        .pipe(
            ofType<CCKpisPageRequested>(CCKpiActionTypes.CCKpisPageRequested),
            mergeMap(( { payload } ) => {
               //
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findCCKpis called ');
                const requestToServer = this.auth.findCCKpi(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new CCKpisPageLoaded({
                    kpis: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteCCKpi$ = this.actions$
        .pipe(
            ofType<CCKpiDeleted>(CCKpiActionTypes.CCKpiDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteCCKpi(payload.Kpi_ID);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateCCKpi$ = this.actions$
        .pipe(
            ofType<CCKpiUpdated>(CCKpiActionTypes.CCKpiUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCCkpi(payload.kpi);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createCCKpi$ = this.actions$
        .pipe(
            ofType<CCKpiOnServerCreated>(CCKpiActionTypes.CCKpiOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCCKpi(payload.kpi).pipe(
                    tap(res => {
                        this.store.dispatch(new CCKpiCreated({ kpi: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllCCKpisRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
