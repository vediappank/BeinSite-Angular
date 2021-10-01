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
import { allActionTrackerTopicsLoaded } from '../_selectors/ActionTrackerTopic.selectors';
// Actions
import {
    AllActionTrackerTopicsLoaded,
    AllActionTrackerTopicsRequested,
    ActionTrackerTopicActionTypes,
    ActionTrackerTopicsPageRequested,
    ActionTrackerTopicsPageLoaded,
    ActionTrackerTopicUpdated,
    ActionTrackerTopicsPageToggleLoading,
    ActionTrackerTopicDeleted,
    ActionTrackerTopicOnServerCreated,
    ActionTrackerTopicCreated,
    ActionTrackerTopicsActionToggleLoading
} from '../_actions/ActionTrackerTopic.actions'

@Injectable()
export class ActionTrackerTopicEffects {
    showPageLoadingDistpatcher = new ActionTrackerTopicsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new ActionTrackerTopicsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new ActionTrackerTopicsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new ActionTrackerTopicsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllActionTrackerTopics$ = this.actions$
        .pipe(
            ofType<AllActionTrackerTopicsRequested>(ActionTrackerTopicActionTypes.AllActionTrackerTopicsRequested),
            withLatestFrom(this.store.pipe(select(allActionTrackerTopicsLoaded))),
            filter(([action, isAllActionTrackerTopicsLoaded]) => !isAllActionTrackerTopicsLoaded),
            mergeMap(() => this.auth.getAllActionTrackerTopics()),
            map(ActionTrackerTopics => {                             
                return new AllActionTrackerTopicsLoaded({ActionTrackerTopics});
            })
          );

    @Effect()
    loadActionTrackerTopicsPage$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicsPageRequested>(ActionTrackerTopicActionTypes.ActionTrackerTopicsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findActionTrackerTopics called ');
                
                const requestToServer = this.auth.findActionTrackerTopics(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new ActionTrackerTopicsPageLoaded({
                    ActionTrackerTopics: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteActionTrackerTopic$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicDeleted>(ActionTrackerTopicActionTypes.ActionTrackerTopicDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteActionTrackerTopic(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateActionTrackerTopic$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicUpdated>(ActionTrackerTopicActionTypes.ActionTrackerTopicUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateActionTrackerTopic(payload.ActionTrackerTopic);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createActionTrackerTopic$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicOnServerCreated>(ActionTrackerTopicActionTypes.ActionTrackerTopicOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createActionTrackerTopic(payload.ActionTrackerTopic).pipe(
                    tap(res => {
                        this.store.dispatch(new ActionTrackerTopicCreated({ ActionTrackerTopic: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllActionTrackerTopicsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
