// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../reducers';
// Selectirs
import { selectActionTrackerTopicConversationQueryResult, selectActionTrackerTopicConversationsPageLoading, selectActionTrackerTopicConversationsShowInitWaitingMessage } from '../_selectors/actiontrackertopicconversation.selectors';

export class ActionTrackerTopicConversationsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectActionTrackerTopicConversationsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectActionTrackerTopicConversationsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectActionTrackerTopicConversationQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
