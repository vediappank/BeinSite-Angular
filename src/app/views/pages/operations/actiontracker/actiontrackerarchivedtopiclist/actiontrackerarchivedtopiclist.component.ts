// Angular
import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
// import { actiontrackertopic, actiontrackertopicsDataSource, actiontrackertopicDeleted,actiontrackertopicsPageRequested   } from '../../../../../core/auth';

import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { ActiontrackertopiceditComponent } from '../actiontrackertopicedit/actiontrackertopicedit.component';
import { AuthService } from '../../../../../core/auth';
import { ActionTrackerTopic } from '../../../../../core/auth/_models/actiontrackertopic.model';
import { ActionTrackerTopicsDataSource } from '../../../../../core/auth/_data-sources/actiontrackertopic.datasource';
import { ActionTrackerTopicsPageRequested, ActionTrackerTopicDeleted } from '../../../../../core/auth/_actions/actiontrackertopic.actions';
import { ActionTrackerTopicConversation } from '../../../../../core/auth/_models/actiontrackertopicconversation.model';

import { ActionTrackerTopicConversationComponent } from '../actiontrackertopicconversation/actiontrackertopicconversation.component';

@Component({
  selector: 'kt-actiontrackerarchivedtopiclist',
  templateUrl: './actiontrackerarchivedtopiclist.component.html',
  styleUrls: ['./actiontrackerarchivedtopiclist.component.scss']
})
export class ActiontrackerarchivedtopiclistComponent implements OnInit {
  @Input() actiontrackerid: number;
  // Table fields
  dataSource: ActionTrackerTopicsDataSource;
  displayedColumns = ['id', 'topicname', 'Findings_or_issues', 'actions', 'launch_deadline_datetime', 'ownername', 'control_deadline_datetime', 'target', 'priorityname', 'status', 'executed_per', 'action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<ActionTrackerTopic>(true, []);
  actiontrackertopicsResult: ActionTrackerTopic[] = [];
  actiontrackertopicconversation: ActionTrackerTopicConversation;
  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  /**
   * Component constructor
   *
   * @param store: Store<AppState>
   * @param dialog: MatDialog
   * @param snackBar: MatSnackBar
   * @param layoutUtilsService: LayoutUtilsService
   */
  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService, public auth: AuthService) {
  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */

  ngOnInit() {
    let value = localStorage.getItem('actiontrackertopics');
    localStorage.setItem('actiontrackerid', this.actiontrackerid.toString())
    localStorage.setItem('isarchive', 'true');
    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.loadactiontrackertopicsList();
      })
    )
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    // Filtration, bind to searchInput
    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      // tslint:disable-next-line:max-line-length
      debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
      distinctUntilChanged(), // This operator will eliminate duplicate values
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadactiontrackertopicsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource
    //
    this.dataSource = new ActionTrackerTopicsDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {

      this.actiontrackertopicsResult = res;
      // this.actiontrackertopicsResult.map(row=>res.filter(res1=>res1.action_tracker_id =this.actiontrackerid));
      if (this.actiontrackertopicsResult.length > 0)
        this.actiontrackertopicsResult = this.actiontrackertopicsResult.filter(row => row.action_tracker_id == this.actiontrackerid && row.isarchive == true);
    });


    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadactiontrackertopicsList();
    });
    // if(this.actiontrackertopicsResult.length>0)
    //    this.actiontrackertopicsResult= this.actiontrackertopicsResult.filter(row=>row.action_tracker_id=this.actiontrackerid);

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load actiontrackertopics List
   */
  loadactiontrackertopicsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new ActionTrackerTopicsPageRequested({ page: queryParams }));
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.topic = searchText;
    filter.Findings_or_issues = searchText;
    filter.actions = searchText;
    filter.owner = searchText;
    filter.executed_per = searchText;
    filter.status = searchText;
    return filter;
  }

  /** ACTIONS */
  /**
   * Delete actiontrackertopic
   *
   * @param _item: actiontrackertopic
   */
  deleteactiontrackertopic(_item: ActionTrackerTopic) {
    //
    const _title: string = 'actiontrackertopic Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this actiontrackertopic?';
    const _waitDesciption: string = 'actiontrackertopic is deleting...';
    const _deleteMessage = `actiontrackertopic has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteActionTrackerTopic(_item.id).subscribe(data => {
          console.log('actiontrackertopic Deteleted conformationreceived: ' + data)
          this.store.dispatch(new ActionTrackerTopicDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadactiontrackertopicsList();
        });

      }

    });
  }


  // ColorColumn(status: string): string {
  //   if (status === 'Cancelled')
  //     return 'Cancelled';
  //   else if (status === 'To be launched')
  //     return 'Tobelaunched';
  //   else if (status === 'Ongoing')
  //     return 'Ongoing';
  //   else if (status === 'Finalized')
  //     return 'Finalized';
  //   else if (status === 'Delayed')
  //     return 'Delayed';

  // }


  // priorityColor(priority: string): string {
  //   if (priority === 'High')
  //     return 'high';
  //   else if (priority === 'Medium')
  //     return 'medium';
  //   else if (priority === 'Low')
  //     return 'low';
  // }

  addactionTrackerToicConv(ActionTrackerTopicConv: ActionTrackerTopic) {
    const _title: string = 'Enter Conversation';
    const _description: string = 'Start Topic Conversation';
    const _waitDesciption: string = 'Topic conversation...';
    const _deleteMessage = `Topic conversation Added`;
    const _buttonType = `Add Conversation`;
    const _buttonText = `Ok`;
    const _cancelDescription = ``;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _buttonText, _cancelDescription, _buttonType);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        if (localStorage.hasOwnProperty('currentUser')) {
          let TextedBy: number;
          TextedBy = JSON.parse(localStorage.getItem('currentUser')).agentid.toString();
          this.actiontrackertopicconversation = new ActionTrackerTopicConversation();
          this.actiontrackertopicconversation.topic_id = ActionTrackerTopicConv.id;
          this.actiontrackertopicconversation.action_tracker_id = ActionTrackerTopicConv.action_tracker_id;
          this.actiontrackertopicconversation.cid = TextedBy;
          this.actiontrackertopicconversation.conv_text = res.cancelDescription;
        }
        this.auth.createActionTrackerTopicConv(this.actiontrackertopicconversation).subscribe(data => {
          console.log('Conversation Saved confirmation from Database: ' + data)
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Read);
          this.loadactiontrackertopicsList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchactiontrackertopics() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.topic},${elem.Findings_or_issues},${elem.actions},${elem.owner},${elem.launch_deadline_datetime},${elem.control_deadline_datetime},${elem.target},${elem.executed_per},${elem.status}`,
        id: elem.id.toString(),
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add actiontrackertopic
   */
  addactiontrackertopic() {
    const newactiontrackertopic = new ActionTrackerTopic();
    newactiontrackertopic.clear(); // Set all defaults fields
    this.editactiontrackertopic(newactiontrackertopic);
  }

  /**
   * Edit actiontrackertopic
   *
   * @param actiontrackertopic: actiontrackertopic
   */
  editactiontrackertopic(actiontrackertopic: ActionTrackerTopic) {

    const _saveMessage = `actiontrackertopic successfully has been saved.`;
    const _messageType = actiontrackertopic.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ActiontrackertopiceditComponent, { data: { id: actiontrackertopic.id, actiontrackerid: this.actiontrackerid } });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadactiontrackertopicsList();
    });
  }

  viewactionTrackerToicConv(actiontrackertopic: ActionTrackerTopic) {

    const _saveMessage = `actiontrackertopic successfully has been saved.`;
    const _messageType = actiontrackertopic.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ActionTrackerTopicConversationComponent, { data: { id: actiontrackertopic.id, actiontrackerid: this.actiontrackerid } });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadactiontrackertopicsList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.actiontrackertopicsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.actiontrackertopicsResult.length) {
      this.selection.clear();
    } else {
      this.actiontrackertopicsResult.forEach(row => this.selection.select(row));
    }
  }
}
