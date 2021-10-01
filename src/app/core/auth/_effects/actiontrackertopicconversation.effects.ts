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
import { allActionTrackerTopicConversationsLoaded } from '../_selectors/actiontrackertopicconversation.selectors';
// Actions
import {
    AllActionTrackerTopicConversationsLoaded,
    AllActionTrackerTopicConversationsRequested,
    ActionTrackerTopicConversationActionTypes,
    ActionTrackerTopicConversationsPageRequested,
    ActionTrackerTopicConversationsPageLoaded,
    ActionTrackerTopicConversationUpdated,
    ActionTrackerTopicConversationsPageToggleLoading,
    ActionTrackerTopicConversationDeleted,
    ActionTrackerTopicConversationOnServerCreated,
    ActionTrackerTopicConversationCreated,
    ActionTrackerTopicConversationsActionToggleLoading
} from '../_actions/actiontrackertopicconversation.actions'

@Injectable()
export class ActionTrackerTopicConversationEffects {
    showPageLoadingDistpatcher = new ActionTrackerTopicConversationsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new ActionTrackerTopicConversationsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new ActionTrackerTopicConversationsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new ActionTrackerTopicConversationsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllActionTrackerTopicConversations$ = this.actions$
        .pipe(
            ofType<AllActionTrackerTopicConversationsRequested>(ActionTrackerTopicConversationActionTypes.AllActionTrackerTopicConversationsRequested),
            withLatestFrom(this.store.pipe(select(allActionTrackerTopicConversationsLoaded))),
            filter(([action, isAllActionTrackerTopicConversationsLoaded]) => !isAllActionTrackerTopicConversationsLoaded),
            mergeMap(() => this.auth.getAllActionTrackerTopicsConversation()),
            map(ActionTrackerTopicConversations => {                             
                return new AllActionTrackerTopicConversationsLoaded({ActionTrackerTopicConversations});
            })
          );

    @Effect()
    loadActionTrackerTopicConversationsPage$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicConversationsPageRequested>(ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findActionTrackerTopicConversations called ');
                
                const requestToServer = this.auth.findActionTrackerTopicsConversation(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new ActionTrackerTopicConversationsPageLoaded({
                    ActionTrackerTopicConversations: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteActionTrackerTopicConversation$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicConversationDeleted>(ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteActionTrackerTopicConversation(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateActionTrackerTopicConversation$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicConversationUpdated>(ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateActionTrackerTopicConversation(payload.ActionTrackerTopicConversation);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createActionTrackerTopicConversation$ = this.actions$
        .pipe(
            ofType<ActionTrackerTopicConversationOnServerCreated>(ActionTrackerTopicConversationActionTypes.ActionTrackerTopicConversationOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createActionTrackerTopicConv(payload.ActionTrackerTopicConversation).pipe(
                    tap(res => {
                        this.store.dispatch(new ActionTrackerTopicConversationCreated({ ActionTrackerTopicConversation: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllActionTrackerTopicConversationsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
