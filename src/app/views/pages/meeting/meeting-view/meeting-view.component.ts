// Angular
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// Services and Models
import {
  MeetingModel,
  Permission, selectMeetingById, User

} from '../../../../core/auth';
import { delay } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth';
import { each, remove, find } from 'lodash';

import * as moment from 'moment';

@Component({
  selector: 'kt-meeting-view',
  templateUrl: './meeting-view.component.html',
  styleUrls: ['./meeting-view.component.scss']
})
export class MeetingViewComponent implements OnInit {
  meeting: MeetingModel;
  filterMenus: any;
  filterMenustring: any;
  CallCenterList: MeetingModel[];
  meeting$: Observable<MeetingModel>;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  allPermissions$: Observable<Permission[]>;
  meetingPermissions: Permission[] = [];
  public SupervisorList: User[];
  public SupervisorList$: Observable<User[]>
  // Roles	
  allMeetings: MeetingModel[] = [];
  unassignedMeetings: MeetingModel[] = [];
  assignedMeetings: MeetingModel[] = [];
  meetingIdForAdding: number;
  meetingsSubject = new BehaviorSubject<number[]>([]);
  SupervisorSubject = new BehaviorSubject<number[]>([]);
  unassignedSupervisor: User[] = [];
  assignedSupervisor: User[] = [];
  supervisorIdForAdding: number;
  allSupervisor: User[] = [];
  sallSupervisor: User[] = [];
  SelectedStatus: String;
  SelectedMeetingtype: String;
  SeletecdSupervisor: string;
  MeetingDuration: string;
  public UserID: number;
  @Output() AgentSelectedList: EventEmitter<any> = new EventEmitter<any>();
  public StatusList = [
    {
      id: 'Pending-Approval',
      name: 'Pending-Approval',
    }, {
      id: 'Open',
      name: 'Open',
    }, {
      id: 'Closed',
      name: 'Closed',
    }
  ];
  public MeetingTypeList = [{
    id: 'One to One',
    name: 'One to One',
  }, {
    id: 'Group',
    name: 'Group',
  }
  ];
  // Private properties
  private componentSubscriptions: Subscription;
  public lastAction: string;
  public selectedMMArray: any[] = [];
  public selectedPRArray: any[] = [];
  public _supervisor: User[] = [];
  SelectedAgentList: string;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<MeetingEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
  constructor(public dialogRef: MatDialogRef<MeetingViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>, public auth: AuthService) {
  }

	/**
	 * On init
	 */
  ngOnInit() {
    if (this.data.id) {
      this.meeting$ = this.store.pipe(select(selectMeetingById(this.data.id)));
    } else {

      const newMeeting = new MeetingModel();
      newMeeting.clear();

      this.meeting$ = of(newMeeting);


    }
    this.getAllSupervisor();
    this.meeting$.subscribe(res => {
      if (!res) {
        return;
      }
      
      this.meeting = new MeetingModel();
      this.meeting.id = res.id;
      this.meeting.Subject = res.Subject;
      this.meeting.Description = res.Description;
      this.meeting.Meeting_Summary = res.Meeting_Summary;
      //this.meeting.Status = res.Status;
      //this.meeting.Supervisor_ID = res.Supervisor_ID;
      this.SupervisorSubject.next(res.Supervisor_ID);
      //this.meeting.Close_Datetime = res.Close_Datetime;

      this.meeting.Schedule_Start_Datetime = moment(res.Schedule_Start_Datetime).format('YYYY-MM-DD');
      this.meeting.Schedule_End_Datetime = moment(res.Schedule_End_Datetime).format('YYYY-MM-DD');
      this.meeting.SelectedAgentList = JSON.parse("["+ res.SelectedAgentList + "]");        
      this.meeting.SelectedAgentNameList =res.SelectedAgentNameList.split(','); 
      console.log('SelectedAgentNameList::::'  +  JSON.stringify(res.SelectedAgentNameList));
      //this.meeting.StartTime = res.StartTime.slice(0, -3);      
      this.meeting.StartTime = res.StartTime;
      //this.meeting.StartTime = '''';      
      //this.meeting.EndTime = res.EndTime.slice(0, -3);   
      this.meeting.EndTime = res.EndTime;
      //this.meeting.Duration = this.MeetingDuration;
      //this.meeting.Approved_By = res.Approved_By;
      // this.meeting.Approved_Datetime = res.Approved_Datetime;
      //this.meeting.Created_By = res.Created_By;


      if (res.Status.length == 0)
        this.SelectedStatus = 'Pending-Approval';
      else
        this.SelectedStatus = res.Status;

      if (res.Meeting_Type.length == 0)
        this.SelectedMeetingtype = 'One to One';
      else
        this.SelectedMeetingtype = res.Meeting_Type;

      this.meetingsSubject.next(res.meetingids);
      this.getduartion();
    });

    //Supervisor
    this.auth.GetAllSupervisosr().subscribe((_resSupervisor: User[]) => {
      each(_resSupervisor, (_usersup: User) => {
        this.allSupervisor.push(_usersup);
        this.unassignedSupervisor.push(_usersup);
       // console.log('unassignedSupervisor' + JSON.stringify(this.unassignedSupervisor));
      });
      if(this.SupervisorSubject.value)
      {
      each([Number(this.SupervisorSubject.value.toString())], (_supervisorId: number) => {
        const _supervisor = find(this.allSupervisor, (_supervisor: User) => {
          return _supervisor.id === _supervisorId;
        });
        if (_supervisor) {
          this.assignedSupervisor.push(_supervisor);
          remove(this.unassignedSupervisor, _supervisor);
        }
      });
    }
      // if (this.meeting.Supervisor_ID) {
      //   this._supervisor = this.allSupervisor.filter(x => x.id === Number(this.meeting.Supervisor_ID));
      //   this.unassignedSupervisor = this.allSupervisor.filter(x => x.id !== Number(this.meeting.Supervisor_ID));
      //   console.log('unassignedSupervisor'+ JSON.stringify(this.unassignedSupervisor));
      // }
    });
  }


	/**
	 * On destroy
	 */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  getAllSupervisor() {
    this.auth.GetAllSupervisosr().subscribe((_Super: User[]) => {
      this.SupervisorList = _Super;
      //console.log('SupervisorList::::' + JSON.stringify(this.SupervisorList))
    });
  }
  /**
	 * Assign Supervisor
	 */
  assignSupervisor() {
    if (this.supervisorIdForAdding === 0) {
      return;
    }

    const role = find(this.getAllSupervisor, (_Supervisor: User) => {
      return _Supervisor.id === (+this.supervisorIdForAdding);
    });

    if (role) {
      this.assignedSupervisor.push(role);
      remove(this.unassignedSupervisor, role);
      this.supervisorIdForAdding = 0;
    }
  }

	/**
	 * Unassign Supervisor
	 *
	 * @param Activity: User
	 */
  unassingnSupervisor(user: User) {
    this.supervisorIdForAdding = 0;
    this.unassignedSupervisor.push(user);
    remove(this.assignedSupervisor, user);
  }




	/**
	 * Returns meeting for save
	 */
  prepareMeeting(): MeetingModel {
    const _meeting = new MeetingModel();
    if (localStorage.hasOwnProperty("currentUser")) {
      this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
    if (this.supervisorIdForAdding != undefined)
      _meeting.usersupervisorid = this.supervisorIdForAdding;
    else
      _meeting.usersupervisorid = Number(this.SupervisorSubject.value);    
    _meeting.Subject = this.meeting.Subject;
    _meeting.Description = this.meeting.Description;
    _meeting.Meeting_Summary = this.meeting.Meeting_Summary;
    _meeting.Status = this.SelectedStatus.toString();
    _meeting.SelectedAgentList = this.SelectedAgentList.toString();    
    if (this.meeting.Schedule_Start_Datetime == '' && this.meeting.Schedule_End_Datetime == '') {
      _meeting.Schedule_Start_Datetime = moment(new Date()).format('MM/DD/YYYY');
      _meeting.Schedule_End_Datetime = moment(new Date()).format('YYYY-MM-DD');;
    }
    else {
      _meeting.Schedule_Start_Datetime = moment(this.meeting.Schedule_Start_Datetime).format('YYYY-MM-DD');
      _meeting.Schedule_End_Datetime = moment(this.meeting.Schedule_End_Datetime).format('YYYY-MM-DD');;
    }
    _meeting.StartTime = this.meeting.StartTime;
    _meeting.EndTime = this.meeting.EndTime;
    _meeting.Created_By = this.UserID;
    _meeting.Meeting_Type = this.SelectedMeetingtype.toString();
    _meeting.Duration = this.MeetingDuration;
    
    return _meeting;
  }

	/**
	 * Save data
	 */
  getAgentSelectedList($event) {    
    this.SelectedAgentList = $event;
    console.log('AgentSelectedList on Meeting Update Page ::'+  JSON.stringify(this.SelectedAgentList));    
  }
  onSubmit() {
    
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    if (!this.isTitleValid()) {
      this.hasFormErrors = true;
      return;
    }
    const editedMeeting = this.prepareMeeting();
    if (this.data.id > 0) {
      editedMeeting.id = this.data.id;
      this.updateMeeting(editedMeeting);
    } else {
      this.createMeeting(editedMeeting);
    }
  }
  updateMeeting(_meeting: MeetingModel) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.auth.updateMeeting(_meeting).subscribe(data => {
      console.log('UpdateMeetingModel Data received: ' + data)
      this.selectedMMArray = [];
      this.selectedPRArray = [];
      of(undefined).pipe(delay(500)).subscribe(() => { // Remove this line
        this.viewLoading = false;
        this.dialogRef.close({
          _meeting,
          isEdit: true
        });
      });
    });
  }

	/**
	 * Create meeting
	 *
	 * @param _meeting: Meeting
	 */
  createMeeting(_meeting: MeetingModel) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.auth.createMeeting(_meeting).subscribe(data => {
      console.log('Inserted Data received: ' + data)
      this.viewLoading = false;
      this.dialogRef.close({
        _meeting,
        isEdit: false
      });
    });
  }

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }



  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    if (this.meeting && this.meeting.id) {
      // tslint:disable-next-line:no-string-throw
      return `View Meeting For '${this.meeting.Subject}'`;
    }
  }

	/**
	 * Returns is title valid
	 */
  isTitleValid(): boolean {
    if (this.meeting && this.meeting.id) {
      return (this.meeting && this.meeting.Subject && this.meeting.Subject.length && this.meeting.Description && this.meeting.Description.length > 0
        && this.meeting.Schedule_Start_Datetime && this.meeting.Schedule_Start_Datetime != undefined
        && this.meeting.Schedule_End_Datetime && this.meeting.Schedule_End_Datetime != undefined
        && this.meeting.StartTime && this.meeting.StartTime.length > 0
        && this.meeting.EndTime && this.meeting.EndTime.length > 0
        && this.SelectedMeetingtype && this.SelectedMeetingtype.length > 0
      );
    }
    else {
      return (this.meeting && this.meeting.Subject && this.meeting.Subject.length && this.meeting.Description && this.meeting.Description.length > 0
        && this.meeting.Schedule_Start_Datetime && this.meeting.Schedule_Start_Datetime != undefined
        && this.meeting.Schedule_End_Datetime && this.meeting.Schedule_End_Datetime != undefined
        && this.meeting.StartTime && this.meeting.StartTime.length > 0
        && this.meeting.EndTime && this.meeting.EndTime.length > 0
        && this.SelectedMeetingtype && this.SelectedMeetingtype.length > 0
        && this.supervisorIdForAdding > 0
      );
    }
  }
  events: string[] = [];
  SDateaddEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log('Strat Date addEvent::'+ event);
    this.getduartion()
  }

  EDateaddEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // console.log('End Date addEvent::'+ event);
    this.getduartion()
  }


  getduartion() {
    let sDate = moment(this.meeting.Schedule_Start_Datetime).format('YYYY-MM-DD');
    let sTime = moment(this.meeting.StartTime, 'HH:mm a').format('HH:mm');
    let eDate = moment(this.meeting.Schedule_End_Datetime).format('YYYY-MM-DD');
    let eTime = moment(this.meeting.EndTime, 'HH:mm a').format('HH:mm');

    let ssDate = moment(sDate + ' ' + sTime);
    let eeDate = moment(eDate + ' ' + eTime);
    if (ssDate > eeDate) {
      console.log('Start Date should be greater then end date')
      this.MeetingDuration = 'Start Date should be greater then end date';
      return 'Start Date should be greater then end date';
    }
    var hours = moment.duration(eeDate.diff(ssDate));
    var min = moment.duration(eeDate.diff(ssDate));
    var hours1 = hours.asHours();
    var min1 = min.minutes();
    console.log(hours1.toString().split(".")[0] + ' Hours, ' + min1 + 'min');
    this.MeetingDuration = hours1.toString().split(".")[0] + ' Hours, ' + min1 + ' Min';
    return hours1.toString().split(".")[0] + ' Hours ' + min1 + ' Min';
  }



}
