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
import { CCKpiselectQueryResult, selectCCKpisPageLoading, selectCCKpisShowInitWaitingMessage } from '../_selectors/cckpi.selectors';

export class CCKpisDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCCKpisPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCCKpisShowInitWaitingMessage)
		);

		this.store.pipe(
			select(CCKpiselectQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
