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
import { CCRoleselectQueryResult, selectCCRolesPageLoading, selectCCRolesShowInitWaitingMessage } from '../_selectors/ccrole.selectors';

export class CCRolesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCCRolesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCCRolesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(CCRoleselectQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
