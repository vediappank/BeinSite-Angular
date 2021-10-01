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
import { selectActionTrackerTopicQueryResult, selectActionTrackerTopicsPageLoading, selectActionTrackerTopicsShowInitWaitingMessage } from '../_selectors/ActionTrackerTopic.selectors';

export class ActionTrackerTopicsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectActionTrackerTopicsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectActionTrackerTopicsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectActionTrackerTopicQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
