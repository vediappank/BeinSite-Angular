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
import { allCCRolesLoaded } from '../_selectors/ccrole.selectors'
// Actions
import {
    AllCCRolesLoaded,
    AllCCRolesRequested,
    CCRoleActionTypes,
    CCRolesPageRequested,
    CCRolesPageLoaded,
    CCRoleUpdated,
    CCRolesPageToggleLoading,
    CCRoleDeleted,
    CCRoleOnServerCreated,
    CCRoleCreated,
    CCRolesActionToggleLoading
} from '../_actions/ccrole.actions';

@Injectable()
export class CCRoleEffects {
    showPageLoadingDistpatcher = new CCRolesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new CCRolesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new CCRolesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new CCRolesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllCCRoles$ = this.actions$
        .pipe(
            ofType<AllCCRolesRequested>(CCRoleActionTypes.AllCCRolesRequested),
            withLatestFrom(this.store.pipe(select(allCCRolesLoaded))),
            filter(([action, isAllRolesLoaded]) => !isAllRolesLoaded),
            mergeMap(() => this.auth.GetAllCCMasterRoles()),
            map(roles => { 
              //                
                return new AllCCRolesLoaded({roles});
            })
          );

    @Effect()
    loadCCRolesPage$ = this.actions$
        .pipe(
            ofType<CCRolesPageRequested>(CCRoleActionTypes.CCRolesPageRequested),
            mergeMap(( { payload } ) => {
               //
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findCCRoles called ');
                const requestToServer = this.auth.findCCRoles(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new CCRolesPageLoaded({
                    roles: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteCCRole$ = this.actions$
        .pipe(
            ofType<CCRoleDeleted>(CCRoleActionTypes.CCRoleDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteRole(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateCCRole$ = this.actions$
        .pipe(
            ofType<CCRoleUpdated>(CCRoleActionTypes.CCRoleUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCCRole(payload.role);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createCCRole$ = this.actions$
        .pipe(
            ofType<CCRoleOnServerCreated>(CCRoleActionTypes.CCRoleOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCCRole(payload.role).pipe(
                    tap(res => {
                        this.store.dispatch(new CCRoleCreated({ role: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllCCRolesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
