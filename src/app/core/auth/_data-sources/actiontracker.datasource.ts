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
import { selectActionTrackerQueryResult, selectActionTrackersPageLoading, selectActionTrackersShowInitWaitingMessage } from '../_selectors/ActionTracker.selectors';

export class ActionTrackersDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectActionTrackersPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectActionTrackersShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectActionTrackerQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
