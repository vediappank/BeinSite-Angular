// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
// Selectirs
import { selectCallCenterQueryResult, selectCallCentersPageLoading, selectCallCentersShowInitWaitingMessage } from '../_selectors/CallCenter.selectors';

export class CallCentersDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCallCentersPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCallCentersShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCallCenterQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
