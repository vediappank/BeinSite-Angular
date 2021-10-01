// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Models
import { MeetingModel, MeetingDataSource, MeetingDeleted, MeetingsPageRequested } from '../../../../core/auth';
import { AppState } from '../../../../core/reducers';
import { QueryParamsModel } from '../../../../core/_base/crud';
import { MeetingEditComponent } from '../meeting-edit/meeting-edit.component';
import { AuthService } from '../../../../core/auth';
import { MeetingViewComponent } from '../meeting-view/meeting-view.component';
import * as moment from 'moment';

import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';


@Component({
  selector: 'kt-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleMeetingComponent implements OnInit {
  // Table fields
  public isApprover: string;
  dataSource: MeetingDataSource;
  displayedColumns = ['select', 'Subject', 'Description', 'Meeting_Type', 'Schedule_Start_Datetime', 'Schedule_End_Datetime', 'StartTime', 'EndTime', 'Duration', 'Status', 'ApproverName', 'actions', 'approver'];
  // ,'Created_By','Created_Datetime','Approved_By','Approved_Datetime','Supervisor_ID','Close_Datetime','Status','Meeting_Summary'
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MeetingModel>(true, []);
  MeetingsResult: MeetingModel[] = [];
  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;
  public approveFlag: Boolean = false;
  public cancelFlag: Boolean = false;
  public meeting = new MeetingModel();
  // Subscriptions
  private subscriptions: Subscription[] = [];
  isonetoonemeetingApprover: boolean = false;
  istrainingmeetingApprover: boolean = false;
  isTeamMeetingApprover: boolean = false;


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
    private layoutUtilsService: LayoutUtilsService, public auth: AuthService
    , private subheaderService: SubheaderService) {
  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Meetings'));
    this.subheaderService.setTitle('Meeting');
    if (localStorage.hasOwnProperty('Meeting')) {
      let value = localStorage.getItem('Meeting');
      for (let i = 0; i < value.toString().split(',').length; i++) {

        var permissionName = value.toString().split(',')[i].toLowerCase();
        if (permissionName == "add")
          this.addFlag = false;
        else if (permissionName == "edit")
          this.editFlag = false;
        else if (permissionName == "delete")
          this.deleteFlag = false;
        else if (permissionName == "view")
          this.viewFlag = false;
         else if (permissionName == "teammeetingapprover")
          this.isTeamMeetingApprover = true;
        else if (permissionName == "onetoonemeetingapprover")
          this.isonetoonemeetingApprover = true;
        else if (permissionName == "trainingmeetingapprover")
          this.istrainingmeetingApprover = true;
      }
      console.log('Activity Menu Permission:::' + value);
    }



    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.loadMeetingsList();
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
        this.loadMeetingsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource
    //
    this.dataSource = new MeetingDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {

      this.MeetingsResult = res;

      console.log('this.MeetingsResult::' + JSON.stringify(res))
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadMeetingsList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Meetings List
   */
  loadMeetingsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new MeetingsPageRequested({ page: queryParams }));
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.Subject = searchText;
    filter.Description = searchText;
    filter.Status = searchText;
    filter.Schedule_Start_Datetime = searchText;
    filter.Schedule_End_Datetime = searchText;
    filter.StartTime = searchText;
    filter.EndTime = searchText;
    filter.Duration = searchText;
    filter.Meeting_Type = searchText;
    filter.ApproverName = searchText;

    return filter;
  }

  showColumn(): string {





    if (localStorage.hasOwnProperty('currentUser')) {
      this.isTeamMeetingApprover = JSON.parse(localStorage.getItem('currentUser')).teammeetingapprover;
      this.isonetoonemeetingApprover = JSON.parse(localStorage.getItem('currentUser')).onetoonemeetingapprover;
      this.istrainingmeetingApprover = JSON.parse(localStorage.getItem('currentUser')).trainingmeetingapprover;
      if (this.isApprover == "False")
        return 'hidden-row';
      else
        return '';
    }
  }



  showhideapprovebutton(Meeting?: any): Boolean {
    let validateapprover: boolean = false;
    console.log('showcolumn before validate');
    let meetingstatus: boolean = false;
    if (Meeting.Status === 'Pending-Approval') {

      if (localStorage.hasOwnProperty('currentUser')) {
        console.log('showcolumn after validate');
        console.log('Teammeetingapprove', this.isTeamMeetingApprover);
        console.log('onetoonemeetingapprove', this.isonetoonemeetingApprover);
        console.log('Trainingmeetingapprove', this.istrainingmeetingApprover);

        if (Meeting.Meeting_Type == 'Team Meeting') {
          if (this.isTeamMeetingApprover == false)
            validateapprover = false;
          else
            validateapprover = true;
        }
        else if (Meeting.Meeting_Type == 'One to One') {
          if (this.isonetoonemeetingApprover == false)
            validateapprover = false;
          else
            validateapprover = true;
        }
        else if (Meeting.Meeting_Type == 'Training') {
          if (this.istrainingmeetingApprover == false)
            validateapprover = false;
          else
            validateapprover = true;
        }

        if (validateapprover == false)
          // return 'hidden-row'; 
          return false;
        else
          // return ''
          return true;
      }
    }
  }
  ColorColumn(status: string): string {
    if (status === 'Approved')
      return 'Approved';
    else if (status === 'Pending-Approval')
      return 'Pending-Approval';
    else if (status === 'Completed')
      return 'Completed';
    else if (status === 'Expired')
      return 'Expired';
    else if (status === 'Canceled')
      return 'Canceled';

  }




  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchMeetings() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.Subject},${elem.Schedule_Start_Datetime},${elem.Schedule_End_Datetime}`,
        id: elem.id.toString(),
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Meeting
   */
  addMeeting() {
    const newMeeting = new MeetingModel();
    newMeeting.clear(); // Set all defaults fields
    this.editMeeting(newMeeting);
  }

  /**
  * Approve Meeting
  */
  approveMeeting(Meeting: MeetingModel) {
    const _title: string = 'Meeting Approve Confirmation?';
    const _description: string = 'Are you sure to permanently Approve this Meeting?';
    const _waitDesciption: string = 'Meeting is Approving...';
    const _deleteMessage = `Meeting has been Approved`;
    const _buttonText = `Approve`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _buttonText);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        if (Meeting.Status !== 'Approved') {
          if (localStorage.hasOwnProperty('currentUser')) {
            let ApprovedBy: string;
            ApprovedBy = JSON.parse(localStorage.getItem('currentUser')).agentid.toString();
            this.meeting = new MeetingModel();
            this.meeting.id = Meeting.id;
            this.meeting.Meeting_Summary = '';
            this.meeting.Approved_By = ApprovedBy;
            this.meeting.Status = 'Approved';
          }
          this.auth.ApproveMeeting(this.meeting).subscribe(data => {
            console.log('Meeting Approved confirmation from Database: ' + data)
            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Read);
            this.loadMeetingsList();
          });
        }
      }
    });
  }

  /**
 * Cancel Meeting
 */
  declineMeeting(Meeting: MeetingModel) {
    const _title: string = 'Meeting Cancel Confirmation?';
    const _description: string = 'Are you sure to permanently Cancel this Meeting?';
    const _waitDesciption: string = 'Meeting is Canceling...';
    const _deleteMessage = `Meeting has been Canceled`;
    const _buttonType = `Cancel Meeting`;
    const _buttonText = `Ok`;
    const _cancelDescription = ``;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _buttonText, _cancelDescription, _buttonType);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        if (Meeting.Status !== 'Canceled') {
          if (localStorage.hasOwnProperty('currentUser')) {
            let CanceledBy: string;
            CanceledBy = JSON.parse(localStorage.getItem('currentUser')).agentid.toString();
            this.meeting = new MeetingModel();
            this.meeting.id = Meeting.id;
            this.meeting.Approved_By = CanceledBy;
            this.meeting.Meeting_Summary = res.cancelDescription;
            this.meeting.Status = 'Canceled';
          }
          this.auth.ApproveMeeting(this.meeting).subscribe(data => {
            console.log('Meeting Canceled confirmation from Database: ' + data)
            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Read);
            this.loadMeetingsList();
          });
        }
      }
    });
  }

  /**
 * Cancel Meeting
 */
  CompleteMeeting(Meeting: MeetingModel) {
    const _title: string = 'Meeting Complete Confirmation?';
    const _description: string = 'Are you sure to permanently Complete this Meeting?';
    const _waitDesciption: string = 'Meeting is Completeing...';
    const _deleteMessage = `Meeting has been Completed`;
    const _buttonType = `Completed Meeting`;
    const _buttonText = `Ok`;
    const _cancelDescription = ``;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _buttonText, _cancelDescription, _buttonType);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {

        if (localStorage.hasOwnProperty('currentUser')) {
          let CompletedBy: string;
          CompletedBy = JSON.parse(localStorage.getItem('currentUser')).agentid.toString();
          this.meeting = new MeetingModel();
          this.meeting.id = Meeting.id;
          this.meeting.Approved_By = CompletedBy;
          this.meeting.Meeting_Summary = res.cancelDescription;
          this.meeting.Status = 'Completed';
        }
        this.auth.ApproveMeeting(this.meeting).subscribe(data => {
          console.log('Meeting Completed confirmation from Database: ' + data)
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Read);
          this.loadMeetingsList();
        });
      }
    });
  }


  /**
   * Edit Meeting
   *
   * @param Meeting: Meeting
   */
  editMeeting(Meeting: MeetingModel) {
    const _saveMessage = `Meeting successfully has been saved.`;
    const _messageType = Meeting.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(MeetingEditComponent, { data: { id: Meeting.id, Buttontype: 'Ca' } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadMeetingsList();
    });
  }


  /** ACTIONS */
  /**
   * Delete Meeting
   *
   * @param _item: Meeting
   */
  deleteMeeting(_item: MeetingModel) {
    const _title: string = 'Meeting Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Meeting?';
    const _waitDesciption: string = 'Meeting is deleting...';
    const _deleteMessage = `Meeting has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteMeeting(_item.id).subscribe(data => {
          console.log('Meeting Deleted conformation received: ' + data)
          this.store.dispatch(new MeetingDeleted({ Meeting_ID: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadMeetingsList();
        });
      }
    });
  }


  /** ACTIONS */
  /**
   * Delete Meeting
   *
   * @param _item: Meeting
   */
  ViewMeeting(Meeting: MeetingModel) {
    const _saveMessage = `Meeting successfully has been saved.`;
    const _messageType = Meeting.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(MeetingViewComponent, { data: { id: Meeting.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadMeetingsList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.MeetingsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.MeetingsResult.length) {
      this.selection.clear();
    } else {
      this.MeetingsResult.forEach(row => this.selection.select(row));
    }
  }
}
