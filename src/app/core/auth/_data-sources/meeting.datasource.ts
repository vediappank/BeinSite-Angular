// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
// Selectirs
import { MeetingselectQueryResult, selectMeetingsPageLoading, selectMeetingsShowInitWaitingMessage } from '../_selectors/meeting.selectors';

export class MeetingDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectMeetingsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectMeetingsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(MeetingselectQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
