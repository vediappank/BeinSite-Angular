import {
  Component,
  ChangeDetectionStrategy,
  ViewChild, ElementRef,
  TemplateRef, OnInit, ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject, of, BehaviorSubject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
// Lodash
import { each, find, some, remove } from 'lodash';
import { SalescallbacktaskdialogueComponent } from '../salescallbacktaskdialogue/salescallbacktaskdialogue.component';
import { CalendarTask, AuthService, SaleCallBackTaskFilter, SalesCallBackTaskStatus, SalesCallBackTaskUsers } from '../../../../../core/auth';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { round } from 'lodash';
import { Sort } from '@angular/material/sort';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'kt-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent {
  selectedDate: any;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalNewTaskContent', { static: true }) modalNewTaskContent: TemplateRef<any>;


  sortBy: any;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  public ErrorMessage: string;
  dateError: string;
  hasFormErrors: boolean = false;

  // Event Properties
  salescallbacktaskfilter: SaleCallBackTaskFilter;
  calendartasks: CalendarTask[];
  calendartaskIdForAdding: any;
  smartcardno: string;
  customercontactno: string;
  name: string;
  timeofstartcall: any;
  timeofendcall: any;
  alternativecontactno: string;
  UserID: number;
  salescallbacktaskstatus: string;
  isshowTeamTasks: boolean = false;
  isDisableShowTeamTask: boolean = false;
  EventList: CalendarTask[];

  // Sales Call Back Task Status	
  allSalesCallBackTaskStatus: SalesCallBackTaskStatus[] = [];
  unassignedCallBackTaskStatus: SalesCallBackTaskStatus[] = [];
  assignedCallBackTaskStatus: SalesCallBackTaskStatus[] = [];
  callbackTaskStatusIdForAdding: any;
  callBackTaskStatusSubject = new BehaviorSubject<string[]>([]);

  // Sales Call Back Task AssignedTo	
  allAssignedTousers: SalesCallBackTaskUsers[] = [];
  unassignedusers: SalesCallBackTaskUsers[] = [];
  assignedusers: SalesCallBackTaskUsers[] = [];
  AssignedToIdForAdding: number;
  AssignedToSubject = new BehaviorSubject<number[]>([]);

  role_id: number;
  public pagesize: number = 15;
  public pagenumber: number;
  public totalRecords: number;
  public EventList$ = new BehaviorSubject<CalendarTask[]>(this.EventList);
  isSupervisor: boolean = false;
  usertype: string;
  cc_role_name: string;
  currentDateTime: any = new Date();

  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;

  displayedColumns: string[] = ['Id', 'CallStartDateTime', 'CallEndDateTime', 'AssignedTo', 'Supervisor', 'Status', 'Action'];
  dataSource = new MatTableDataSource<CalendarTask>([]);
  private subscriptions: Subscription[] = [];

  sortedData: CalendarTask[];

  constructor(private modal: NgbModal, public auth: AuthService,
    private layoutUtilsService: LayoutUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef, public dialog: MatDialog) {

    if (localStorage.hasOwnProperty("currentUser")) {
      this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
      this.role_id = JSON.parse(localStorage.getItem('currentUser')).role_id;
      this.cc_role_name = JSON.parse(localStorage.getItem('currentUser')).cc_role_name;
    }

  }


  ngOnInit() {

    //PageWisePermission	
    	
    if (localStorage.hasOwnProperty("Sales Callbacks")) {
      
      let value = localStorage.getItem('Sales Callbacks');
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
      }
    
    console.log('Sales Callbacks Menu Permission:::' + value);
    }

    if (this.cc_role_name == 'Operations Manager' || this.cc_role_name == 'Team Manager' || this.cc_role_name == 'Supervisor') {
      this.isDisableShowTeamTask = false;
    }
    else {
      this.isDisableShowTeamTask = true;
    }
    this.AssignedToIdForAdding = this.UserID;

    this.salescallbacktaskfilter = new SaleCallBackTaskFilter();
    if (this.pagenumber == undefined) {
      this.pagenumber = 1;
    }
    if (this.pagesize == undefined) {
      this.pagesize = 15;
    }

    this.auth.getAllSalesCallBackTaskStatus().subscribe((res: SalesCallBackTaskStatus[]) => {
      each(res, (_Status: SalesCallBackTaskStatus) => {
        this.allSalesCallBackTaskStatus.push(_Status);
        this.unassignedCallBackTaskStatus.push(_Status);
      });
    });
    this.auth.getAllSalesCallBackTaskUsers(this.role_id).subscribe((res: SalesCallBackTaskUsers[]) => {
      each(res, (_user: SalesCallBackTaskUsers) => {
        this.allAssignedTousers.push(_user);
        this.unassignedusers.push(_user);
      });
    });
    setText('#lblCurrentPage', this.pagenumber);
    this.callbackTaskStatusIdForAdding = ['5'];
    this.loadSalesCallBacks(this.pagenumber, this.pagesize);
  }
  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       // this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //     // this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];

  // Dynamic Sorting
  sortData(sort: Sort) {

    const data = this.EventList.slice();
    if (sort.direction === '')
      sort.direction = 'asc';
    // if (!sort.active || sort.direction === '') {
    //   this.sortedData = data;
    //   return;
    // }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'Id': return compare(a.Id, b.Id, isAsc);
        case 'CallStartDateTime': return compare(new Date(a.CallStartDateTime), new Date(b.CallStartDateTime), isAsc);
        // case 'CallEndDateTime': return compare(new Date(a.CallEndDateTime).getDate(), new Date(b.CallEndDateTime).getDate(), isAsc);
        // case 'starttime': return compare(new Date(a.CallStartDateTime).toTimeString(), new Date(b.CallStartDateTime).toTimeString(), isAsc);
        // case 'endtime': return compare(new Date(a.CallEndDateTime), new Date(b.CallEndDateTime), isAsc);
        case 'AssignedTo': return compare((a.AssignedAgentLastName + ' ' + a.AssignedAgentFirstName), (b.AssignedAgentLastName + ' ' + b.AssignedAgentFirstName), isAsc);
        case 'Supervisor': return compare((a.AgentSupervisorLastName + ' ' + a.AgentSupervisorFirstName), (b.AgentSupervisorLastName + ' ' + b.AgentSupervisorFirstName), isAsc);
        case 'Status': return compare(a.Status, b.Status, isAsc);
        default: return 0;
      }
    });
    this.EventList$.next(this.sortedData);
  }

  calculateTimeofEndcall(timeofstartcall) {
    let endcall: string;

    timeofstartcall = moment(new Date(timeofstartcall)).format('YYYY-MM-DD HH:mm');
    endcall = moment(new Date(timeofstartcall)).add(15, 'm').format('YYYY-MM-DD HH:mm');
    this.timeofendcall = new Date(endcall);
  }
  onShowTeamTasks(event) {
    if (event.checked) {
      this.isshowTeamTasks = true;
      this.AssignedToIdForAdding = 0;
    }
    else {
      this.isshowTeamTasks = false;
      this.AssignedToIdForAdding = this.UserID;
    }
    this.loadSalesCallBacks(1, 15);
  }
  isExpired(startDate, status) {
    return ((new Date(startDate) <= new Date()) && (status == 5));
  }

  // ColorColumn(status: string): string {
  //   if (status === 'Completed')
  //     return 'completed';
  //   else if (status === 'Cancelled')
  //     return 'cancelled';
  //   else if (status === 'Customer No Answer')
  //     return 'noanswer';
  //   else if (status === 'Call Failure')
  //     return 'failure';
  //   else if (status === 'Open')
  //     return 'open';

  // }

  // ColorColumn(statusColor : string){
  //   return '.status {color :' + statusColor +'}';
  // }
  clearFilter() {
    this.callbackTaskStatusIdForAdding = ['5'];
    this.salescallbacktaskfilter.StartDateTime = undefined;
    this.salescallbacktaskfilter.EndDateTime = undefined;
    this.isshowTeamTasks = false;
    this.AssignedToIdForAdding = this.UserID;
    this.loadSalesCallBacks(1, 15);
  }
  loadSalesCallBacks(pagenumber: number, pagesize: number) {

    this.salescallbacktaskfilter.PageNo = pagenumber;
    this.salescallbacktaskfilter.PageSize = pagesize
    this.salescallbacktaskfilter.RoleId = this.role_id;
    this.salescallbacktaskfilter.ShowTeamTasks = this.isshowTeamTasks;

    if (this.callbackTaskStatusIdForAdding)
      this.salescallbacktaskfilter.Status = this.callbackTaskStatusIdForAdding.toString();


    if (this.salescallbacktaskfilter.StartDateTime)
      this.salescallbacktaskfilter.StartDateTime = moment(new Date(this.salescallbacktaskfilter.StartDateTime)).format('YYYY-MM-DD HH:mm');

    if (this.salescallbacktaskfilter.EndDateTime)
      this.salescallbacktaskfilter.EndDateTime = moment(new Date(this.salescallbacktaskfilter.EndDateTime)).format('YYYY-MM-DD HH:mm');

    this.salescallbacktaskfilter.AgentId = this.UserID;
    this.salescallbacktaskfilter.AssignedTo = this.AssignedToIdForAdding;

    this.auth.getAllCalendarTask(this.salescallbacktaskfilter).subscribe((_res: any) => {

      this.EventList = _res;
      if (this.EventList.length > 0) {
        this.totalRecords = _res[0].TotalRecords;
        this.EventList$.next(this.EventList);
      }
      else {
        this.totalRecords = 0;
        this.EventList$.next(this.EventList);
      }
    });

  }
  addTask(eventDate): void {
    const newsalescallbacktasks = new CalendarTask();
    let _saveMessage;
    const _messageType = newsalescallbacktasks.Id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(SalescallbacktaskdialogueComponent, { data: { id: newsalescallbacktasks.Id, res: newsalescallbacktasks, flag: 'add', eventDate: new Date(eventDate) } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      if (res.result == 'SUCCESS') {
        _saveMessage = `Sales Call Back Task has been saved successfully.`;
        this.timeofstartcall = this.salescallbacktaskfilter.StartDateTime;
        this.timeofendcall = this.salescallbacktaskfilter.EndDateTime;
        this.loadSalesCallBacks(this.pagenumber, this.pagesize);
      }
      else if (res.result.toString().indexOf('conflicting') > -1)
        _saveMessage = res.result;
      else
        _saveMessage = `Something went wrong !.`;

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
    });
  }


  ViewEvent(salescallbacktask: CalendarTask): void {
    const dialogRef = this.dialog.open(SalescallbacktaskdialogueComponent, { data: { id: salescallbacktask.Id, res: salescallbacktask, flag: 'view' } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }

  EditEvent(salescallbacktask: CalendarTask): void {
    let _saveMessage: any;
    const _messageType = salescallbacktask.Id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(SalescallbacktaskdialogueComponent, { data: { id: salescallbacktask.Id, res: salescallbacktask, flag: 'edit', eventDate: new Date(salescallbacktask.CallStartDateTime) } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      if (res.result == 'SUCCESS') {
        _saveMessage = `Sales Call Back Task has been saved successfully.`;

        this.timeofstartcall = this.salescallbacktaskfilter.StartDateTime;
        this.timeofendcall = this.salescallbacktaskfilter.EndDateTime;
        this.loadSalesCallBacks(this.pagenumber, this.pagesize);

      }
      else if (res.result.toString().indexOf('conflicting') > -1)
        _saveMessage = res.result;
      else
        _saveMessage = `Something went wrong !.`;

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
    });
  }
  deleteEvent(event) {
    const _title: string = 'Event Delete';
    const _description: string = 'Are you sure to permanently delete this Event?';
    const _waitDesciption: string = 'Event is deleting...';
    const _deleteMessage = `Event has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteCalendarTask(event.Id).subscribe(data => {
          console.log('Event Deleted conformation received: ' + data)
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.ngOnInit();
        });

      }

    });
  }

  onBtFirst() {

    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber = 1;

    this.loadSalesCallBacks(this.pagenumber, this.pagesize);

    setText('#lblCurrentPage', this.pagenumber);

  }

  onChange() {
    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber = 1;
    this.loadSalesCallBacks(this.pagenumber, this.pagesize);

  }

  onBtLast() {

    console.log('here');

    this.pagenumber = round(this.totalRecords / this.pagesize) + 1;
    if (this.totalRecords != this.pagesize) {
      if (this.EventList.length >= this.pagesize) {

        this.loadSalesCallBacks(this.pagenumber, this.pagesize);
        setText('#lblCurrentPage', this.pagenumber);
      }
    }
  }

  onBtNext() {

    if (this.totalRecords != this.pagesize) {
      if (this.EventList.length >= this.pagesize) {
        this.pagenumber = this.pagenumber + 1;

        this.loadSalesCallBacks(this.pagenumber, this.pagesize);

        setText('#lblCurrentPage', this.pagenumber);
      }
    }
    // this.gridApi.paginationGoToNextPage();
  }

  onBtPrevious() {

    if (this.pagenumber > 1) {
      this.pagenumber = this.pagenumber - 1;
      this.loadSalesCallBacks(this.pagenumber, this.pagesize);
      setText('#lblCurrentPage', this.pagenumber);
    }
  }

}
function setText(selector, text) {
  document.querySelector(selector).innerHTML = text;
}
// For Dynamic Sorting
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}