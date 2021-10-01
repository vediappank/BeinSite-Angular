// Angular
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import {
  MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatCheckboxModule, MatPaginator,
  MatSort, MatTableDataSource, MatDialog
} from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import flatpickr from "flatpickr";


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
import { Subject, of, BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { CalendarTask, AuthService, SaleCallBackTaskFilter, SalesCallBackTaskEvent } from '../../../../../core/auth';
import * as moment from 'moment';
import { Time } from "@angular/common";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { SalescallbacktaskdialogueComponent } from '../salescallbacktaskdialogue/salescallbacktaskdialogue.component';
import { debug } from 'webpack';


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
  }
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kt-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  selectedDate: any;
  events: SalesCallBackTaskEvent[] = [];
  salescallbacktaskfilter: SaleCallBackTaskFilter;
  public events$ = new BehaviorSubject<SalesCallBackTaskEvent[]>(this.events);
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalContentView', { static: true }) modalContentView: TemplateRef<any>;
  @ViewChild('modalNewTaskContent', { static: true }) modalNewTaskContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: SalesCallBackTaskEvent;
  };
  SupervisorSubject = new BehaviorSubject<number[]>([]);
  EventList: CalendarTask[];
  // Event Properties
  calendartasks: CalendarTask[];
  salescallbacktasks: CalendarTask;
  calendartaskIdForAdding: any;
  assignedToIdForAdding: any;
  smartcardno: string;
  customercontactno: string;
  name: string;
  timeofstartcall: Date;
  timeofendcall: Date;
  alternativecontactno: string;
  UserID: number;
  role_id: number;
  public ErrorMessage: string;
  dateError: string;
  hasFormErrors: boolean = false;
  dayStarthour: number;
  dayEndhour: number;
  weekStartDate: any;
  weekEndDate: any;
  actions: CalendarEventAction[] = [
    // {
    //   label: '&nbsp;<i class="fas fa-pencil-alt" placeholder="Edit" style="display: none;"></i>&nbsp; &nbsp;',
    //   a11yLabel: "Edit",
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     // this.handleEvent('Edited', event);
    //   },
    // },
    // {
    //   label: '<i class="fas fa-trash-alt" placeholder="Edit" style="display: none;"></i>',
    //   a11yLabel: "Delete",
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     // this.deleteEvent('Deleted', event);
    //   },
    // },
  ];
  isshowTeamTasks: boolean = true;
  isDisableShowTeamTask: boolean = false;
  cc_role_name: string;

  refresh: Subject<any> = new Subject();
  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;


  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, public auth: AuthService,
    private layoutUtilsService: LayoutUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef, public dialog: MatDialog) {
    if (localStorage.hasOwnProperty("currentUser")) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
        this.role_id = JSON.parse(localStorage.getItem('currentUser')).role_id;
        this.cc_role_name = JSON.parse(localStorage.getItem('currentUser')).cc_role_name;
      }
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
    this.isshowTeamTasks = false;

    let startofweek: any = moment(this.viewDate).startOf('week');
    let endofweek: any = moment(this.viewDate).endOf('week');
    this.weekStartDate = startofweek._d;
    this.weekEndDate = endofweek._d;

    this.dayStarthour = 11;
    this.dayEndhour = 20;
    this.loadSalesCallBacks(0, 0);

  }

  loadSalesCallBacks(pagenumber: number, pagesize: number) {
    this.salescallbacktaskfilter = new SaleCallBackTaskFilter()
    this.salescallbacktaskfilter.PageNo = pagenumber;
    this.salescallbacktaskfilter.PageSize = pagesize;
    this.salescallbacktaskfilter.RoleId = this.role_id;
    this.salescallbacktaskfilter.ShowTeamTasks = this.isshowTeamTasks;
    this.salescallbacktaskfilter.AgentId = this.UserID;
    this.salescallbacktaskfilter.AssignedTo = this.UserID;
    if (this.weekStartDate)
      this.salescallbacktaskfilter.StartDateTime = moment(new Date(this.weekStartDate)).format('YYYY-MM-DD hh:mm a');

    if (this.weekEndDate)
      this.salescallbacktaskfilter.EndDateTime = moment(new Date(this.weekEndDate)).format('YYYY-MM-DD hh:mm a');

    this.auth.getAllCalendarTask(this.salescallbacktaskfilter).subscribe((_res: CalendarTask[]) => {
      this.EventList = _res;
      this.addEvent();
    });
  }
  viewChange(event) {

    if (event.value == 1) {
      this.dayStarthour = 11;
      this.dayEndhour = 20;
    }
    else {
      this.dayStarthour = 0;
      this.dayEndhour = 24;
    }
  }
  setView(view: CalendarView) {

    this.view = view;
    this.refreshCallBacksTasks();
  }
  dateChanged(date) {
    this.viewDate = date;
    let startofweek: any = moment(date).startOf('week');
    let endofweek: any = moment(date).endOf('week');
    this.weekStartDate = startofweek._d;
    this.weekEndDate = endofweek._d;
    this.loadSalesCallBacks(0, 0);
  }
  dayClicked({ date, events }: { date: Date; events: SalesCallBackTaskEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
    if (!this.addFlag)
      this.addTask(this.viewDate);
  }

  calculateTimeofEndcall(timeofstartcall) {
    let endcall: string;
    // let time : any;
    // time = moment(new Date(timeofstartcall)).format('hh:mm a');
    // let time2 : any;
    // let str: any;
    // time2=  '03:00 am';
    // if(time > time2)
    // str = time;
    // else
    // str = time2;

    timeofstartcall = moment(new Date(timeofstartcall)).format('YYYY-MM-DD hh:mm a');
    endcall = moment(new Date(timeofstartcall)).add(10, 'm').format('YYYY-MM-DD hh:mm a');
    this.timeofendcall = new Date(endcall);
    this.TimeValidation();


  }

  // ColorColumn(status: string): string {
  //   if (status === 'Completed')
  //     return 'green';
  //   else if (status === 'Cancelled')
  //     return 'red';
  //   else if (status === 'Customer No Answer')
  //     return '#d115c8';
  //   else if (status === 'Call Failure')
  //     return '#ff7400';
  //   else if (status === 'Open')
  //     return 'blue';

  // }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }
  ViewEvent(event: SalesCallBackTaskEvent): void {

    const newsalescallbacktask = new CalendarTask();
    newsalescallbacktask.clear();
    this.salescallbacktasks = newsalescallbacktask;

    this.salescallbacktasks.Id = event.id;
    this.salescallbacktasks.Name = event.Name;
    this.salescallbacktasks.SmartCardNo = event.SmartCardNo;
    this.salescallbacktasks.SourceTicketId = event.SourceTicketId;
    this.salescallbacktasks.Status = event.Status;
    this.salescallbacktasks.AltContactNo = event.AltContactNo;
    this.salescallbacktasks.AssignedTo = event.AssignedTo;
    this.salescallbacktasks.CallEndDateTime = event.end;
    this.salescallbacktasks.CallStartDateTime = event.start;
    this.salescallbacktasks.Comments = event.Comments;
    this.salescallbacktasks.CompletionDateTime = event.CompletionDateTime;
    this.salescallbacktasks.CompletionTicketId = event.CompletionTicketId;
    this.salescallbacktasks.ContactNo = event.ContactNo;

    const dialogRef = this.dialog.open(SalescallbacktaskdialogueComponent, { data: { id: this.salescallbacktasks.Id, res: this.salescallbacktasks, flag: 'view' } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
  EditorViewEvent(event: SalesCallBackTaskEvent): void {

    if (event.Status == 5)
      this.EditEvent(event);
    else
      this.ViewEvent(event);
  }
  EditEvent(event: SalesCallBackTaskEvent): void {

    const newsalescallbacktask = new CalendarTask();
    newsalescallbacktask.clear();
    this.salescallbacktasks = newsalescallbacktask;

    this.salescallbacktasks.Id = event.id;
    this.salescallbacktasks.Name = event.Name;
    this.salescallbacktasks.SmartCardNo = event.SmartCardNo;
    this.salescallbacktasks.SourceTicketId = event.SourceTicketId;
    this.salescallbacktasks.Status = event.Status;
    this.salescallbacktasks.AltContactNo = event.AltContactNo;
    this.salescallbacktasks.AssignedTo = event.AssignedTo;
    this.salescallbacktasks.CallEndDateTime = event.end;
    this.salescallbacktasks.CallStartDateTime = event.start;
    this.salescallbacktasks.Comments = event.Comments;
    this.salescallbacktasks.CompletionDateTime = event.CompletionDateTime;
    this.salescallbacktasks.CompletionTicketId = event.CompletionTicketId;
    this.salescallbacktasks.ContactNo = event.ContactNo;


    let _saveMessage: any;
    const _messageType = event.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(SalescallbacktaskdialogueComponent, { data: { id: event.id, res: this.salescallbacktasks, flag: 'edit', eventDate: new Date(this.salescallbacktasks.CallStartDateTime) } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      if (res.result == 'SUCCESS') {
        _saveMessage = `Sales Call Back Task has been saved successfully.`;

        this.timeofstartcall = this.salescallbacktaskfilter.StartDateTime;
        this.timeofendcall = this.salescallbacktaskfilter.EndDateTime;
        this.loadSalesCallBacks(0, 0);

      }
      else if (res.result.toString().indexOf('conflicting') > -1)
        _saveMessage = res.result;
      else
        _saveMessage = `Something went wrong !.`;

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);


    });
  }


  onSegmentClick(event) {
    if (!this.addFlag)
      this.addTask(event);
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
        // this.salescallbacktaskfilter.PageNo = 0;
        // this.salescallbacktaskfilter.PageSize = 0
        // this.salescallbacktaskfilter.RoleId = this.role_id;
        // this.salescallbacktaskfilter.ShowTeamTasks = this.isshowTeamTasks;
        // this.salescallbacktaskfilter.AgentId= this.UserID
        //   this.auth.getAllCalendarTask(this.salescallbacktaskfilter).subscribe((_res: CalendarTask[]) => {
        //   this.EventList = _res;
        //   this.addEvent();

        // });
        this.loadSalesCallBacks(0, 0);
      }
      else if (res.result.toString().indexOf('conflicting') > -1)
        _saveMessage = res.result;
      else
        _saveMessage = res.result;

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);

    });
  }

  addEvent(): void {
    this.events = [];
    if (this.EventList.length > 0) {
      for (let i = 0; i < this.EventList.length; i++) {
        this.events.push({
          id: this.EventList[i].Id,
          title: this.EventList[i].Comments,
          Name: this.EventList[i].Name,
          SmartCardNo: this.EventList[i].SmartCardNo,
          SourceTicketId: this.EventList[i].SourceTicketId,
          Status: this.EventList[i].Status,
          AltContactNo: this.EventList[i].AltContactNo,
          AssignedTo: this.EventList[i].AssignedTo,
          end: new Date(this.EventList[i].CallEndDateTime),
          start: new Date(this.EventList[i].CallStartDateTime),
          CompletionDateTime: this.EventList[i].CompletionDateTime,
          CompletionTicketId: this.EventList[i].CompletionTicketId,
          ContactNo: this.EventList[i].ContactNo,
          Comments: this.EventList[i].Comments,

          actions: this.actions,
          draggable: true, resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          color: {
            primary: this.EventList[i].StatusColor,
            secondary: this.EventList[i].StatusColor,
          },
        })
      }
    }
    this.events$.next(this.events);
  }

  deleteEvent(action: string, event: SalesCallBackTaskEvent) {
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

        this.auth.deleteCalendarTask(Number(event.id)).subscribe(data => {
          console.log('Event Deleted conformation received: ' + data)
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          // this.salescallbacktaskfilter.PageNo = 0;
          // this.salescallbacktaskfilter.PageSize = 0
          // this.salescallbacktaskfilter.RoleId = this.role_id;
          // this.salescallbacktaskfilter.ShowTeamTasks = this.isshowTeamTasks;
          // this.salescallbacktaskfilter.AgentId= this.UserID
          // this.auth.getAllCalendarTask(this.salescallbacktaskfilter).subscribe((_res: CalendarTask[]) => {
          //   this.EventList = _res;
          //   this.addEvent();
          // });
          this.loadSalesCallBacks(0, 0);
        });

      }

    });
  }


  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.refreshCallBacksTasks();
  }

  refreshCallBacksTasks() {
    let startof: any;
    let endof: any;

    if (this.view == CalendarView.Week) {
      startof = moment(this.viewDate).startOf('week');
      endof = moment(this.viewDate).endOf('week');
    }
    else if (this.view == CalendarView.Month) {
      startof = moment(this.viewDate).startOf('month');
      endof = moment(this.viewDate).endOf('month');
    }
    else {
      startof = moment(this.viewDate).startOf('day');
      endof = moment(this.viewDate).endOf('day');
    }
    this.weekStartDate = startof._d;
    this.weekEndDate = endof._d;
    this.loadSalesCallBacks(0, 0);

  }
  SDateaddEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log('Strat Date addEvent::'+ event);
    this.DateValidation()
  }

  EDateaddEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // console.log('End Date addEvent::'+ event);
    this.DateValidation()
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  TimeValidation() {

    let sDate = moment(this.timeofstartcall).format('YYYY-MM-DD');
    let eDate = moment(this.timeofendcall).format('YYYY-MM-DD');

    let sTime: any = moment(this.timeofstartcall).format('HH:mm a')
    let eTime: any = moment(this.timeofendcall).format('HH:mm');

    let starttime: any = '03:00';
    let endtime: any = '01:00';
    if (sTime < starttime) {
      this.dateError = 'Time of start call should be greater then 3 AM ';
      this.hasFormErrors = true;
      this.ErrorMessage = this.dateError;
      this.timeofstartcall = new Date(sDate + ' ' + starttime);
    }


  }
  DateValidation() {
    let sDate = moment(this.timeofstartcall).format('YYYY-MM-DD');
    let eDate = moment(this.timeofendcall).format('YYYY-MM-DD');
    let currentdate = moment().format('YYYY-MM-DD');

    if (moment(currentdate) > moment(sDate)) {
      console.log('Time of start call should be greater then current date and time')
      this.dateError = 'Time of start call should be greater then current date and time';
      this.hasFormErrors = true;
      this.ErrorMessage = this.dateError;
      return this.dateError;
    }
    else if (moment(eDate) < moment(sDate)) {
      console.log('Time of end call should be greater than start call')
      this.dateError = 'Time of end call should be greater than start call';
      this.hasFormErrors = true;
      this.ErrorMessage = this.dateError;
      return this.dateError;
    }

    else {
      this.hasFormErrors = false;
      this.ErrorMessage = '';
    }
    return this.dateError;
  }

}

