// Angular
import { Component, OnInit, Input, Inject, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
// import { actiontrackertopicconversation, ActionTrackerTopicConversationsDataSource, actiontrackertopicconversationDeleted,actiontrackertopicconversationsPageRequested   } from '../../../../../core/auth';

// Lodash
import { each, find, some, remove } from 'lodash';

import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { TimelineEvent } from 'ngx-timeline';
import { AuthService } from '../../../../../core/auth';
import { ActionTrackerTopicConversation } from '../../../../../core/auth/_models/actiontrackertopicconversation.model';
import { ActionTrackerTopicConversationsDataSource } from '../../../../../core/auth/_data-sources/actiontrackertopicconversation.datasource';
import { ActionTrackerTopicConversationsPageRequested, ActionTrackerTopicConversationDeleted } from '../../../../../core/auth/_actions/actiontrackertopicconversation.actions';
import { debug } from 'console';

@Component({
  selector: 'kt-actiontrackertopicconversation',
  templateUrl: './actiontrackertopicconversation.component.html',
  styleUrls: ['./actiontrackertopicconversation.component.scss']
})
export class ActionTrackerTopicConversationComponent implements OnInit {

  dataSource: ActionTrackerTopicConversationsDataSource;
  displayedColumns = ['comments'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<ActionTrackerTopicConversation>(true, []);
  actiontrackertopicconversationsconvResult: ActionTrackerTopicConversation[] = [];
  ActionTrackerTopicConversation: ActionTrackerTopicConversation;
  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;
  public topicid: number;
  public actiontrackerid: number;
  // Subscriptions
  private subscriptions: Subscription[] = [];
  // events: Array<TimelineEvent>;
  events : any[];
  createddate: string;
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
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
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
    //PageWisePermission
    //alert(localStorage.getItem('Call Center actiontrackertopicconversations'));

    if (this.data.id) {
      this.topicid = this.data.id;
      this.actiontrackerid = this.data.actiontrackerid;
    }

    let value = localStorage.getItem('ActionTrackerTopicCovnersation');



    this.auth.getAllActionTrackerTopicsConversation().subscribe((_resOrganization: ActionTrackerTopicConversation[]) => {
   // alert(JSON.stringify(_resOrganization));
      each(_resOrganization, (_Organization: ActionTrackerTopicConversation) => {
        this.actiontrackertopicconversationsconvResult.push(_Organization);
        this.onTimmelineload();
      });

      

    });
    //    this.actiontrackertopicconversationsconvResult= this.actiontrackertopicconversationsconvResult.filter(row=>row.action_tracker_id=this.actiontrackerid);


    // this.events.push({ "date": new Date(), "header": "test", "body": "aaa", "icon": "fa-github" });
    // this.events.push({ "date": new Date(), "header": "WeUI", "body": "Test" });
    // this.events.push({ "date": new Date(), "header": "aaa" });

  }

  onTimmelineload() {
    // this.events = new Array<TimelineEvent>();
    this.events=[];
    if (this.actiontrackertopicconversationsconvResult.length > 0)
      this.actiontrackertopicconversationsconvResult = this.actiontrackertopicconversationsconvResult.filter(row => row.topic_id == this.topicid && row.action_tracker_id == this.actiontrackerid );

    if (this.actiontrackertopicconversationsconvResult.length > 0) {
      for (let i = 0; i < this.actiontrackertopicconversationsconvResult.length; i++) {
        // this.createddate = this.actiontrackertopicconversationsconvResult[i].cdate.toString();
        this.events.push({
          "date": this.actiontrackertopicconversationsconvResult[i].cdate,
          "createdby": this.actiontrackertopicconversationsconvResult[i].createdby,
          "body": this.actiontrackertopicconversationsconvResult[i].conv_text
        })
      }
    }
  }
  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load actiontrackertopicconversations List
   */
  loadactiontrackertopicconversationsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new ActionTrackerTopicConversationsPageRequested({ page: queryParams }));
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    filter.conv_text = searchText;
    return filter;
  }

  /** ACTIONS */
  /**
   * Delete actiontrackertopicconversation
   *
   * @param _item: actiontrackertopicconversation
   */
  deleteactiontrackertopicconversation(_item: ActionTrackerTopicConversation) {
    //
    const _title: string = 'actiontrackertopicconversation Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this actiontrackertopicconversation?';
    const _waitDesciption: string = 'actiontrackertopicconversation is deleting...';
    const _deleteMessage = `actiontrackertopicconversation has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteActionTrackerTopicConversation(_item.conv_id).subscribe(data => {
          console.log('actiontrackertopicconversation Deteleted conformationreceived: ' + data)
          this.store.dispatch(new ActionTrackerTopicConversationDeleted({ id: _item.conv_id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadactiontrackertopicconversationsList();
        });

      }

    });
  }

  /**
     * Fetch selected rows
     */
  fetchactiontrackertopicconversations() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.topic_id},${elem.action_tracker_id},${elem.conv_id}, ${elem.conv_text}`,
        id: elem.conv_id.toString(),
        status: elem.conv_text
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }



  sAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.actiontrackertopicconversationsconvResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.actiontrackertopicconversationsconvResult.length) {
      this.selection.clear();
    } else {
      this.actiontrackertopicconversationsconvResult.forEach(row => this.selection.select(row));
    }
  }
}
