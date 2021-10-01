// Angular
import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { AppState } from '../../../../core/reducers';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';

// Services and Models
import { AuthService, User,UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles } from '../../../../core/auth';
import { AgentCallInfoFilter } from '../_models/agentcallinfofilter.model';

import * as moment from 'moment';

import { filter } from 'minimatch';
import { debug } from 'webpack';


@Component({
  selector: 'kt-agentcallinfo',
  templateUrl: './agentcallinfo.component.html',
  styleUrls: ['./agentcallinfo.component.scss']
})
export class AgentcallinfoComponent implements OnInit {

  agentcallinfofilter: AgentCallInfoFilter;
  public AgentcolumnDefs :any;
  public AgentCallInfo: any[]=[];
  public agentList: User[];
  public callTypeList: any[];
  public AgentCallInfoData$ = new BehaviorSubject<any[]>(this.AgentCallInfo);
  dataSource: UsersDataSource;
  public gridDefaultColDef = {
    sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: false, enableRowGroup: false, enablePivot: false,
  };
  public AgentgetGridRowStyle: any;

  private agentGridApi;
  public agentGridDefaultColDef = {
    sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: false, enableRowGroup: false, enablePivot: false,
  };
  // public AgentcolumnDefs: string[] = ['ANI', 'Date', 'Time', 'Talk Time', 'Hold Time', 'Answer Wait Time','Wrap Time'];  							


  	// Subscriptions
	private subscriptions: Subscription[] = [];
  constructor(public auth: AuthService,private store: Store<AppState>) {
    this.refreshAgentCols();

  }

  ngOnInit() {
    this.AgentCallInfo = undefined;
    this.AgentCallInfoData$.next(this.AgentCallInfo);
    this.agentcallinfofilter = new AgentCallInfoFilter();
    const filter: any = {};
    filter.ID = undefined;
    filter.UserName = '';
    filter.CallCenter = '';
    filter.LastName = '';
    filter.FirstName = '';
    filter.UserRole = '';
    filter.CCRole = '';
    filter.Status = '';
    filter.PageNumber = 0;
    filter.PageSize = 0;
    this.auth.getAllUsers(filter).subscribe(_agents => {
      this.agentList = _agents;
    });
    
    this.auth.getAllCallTypes().subscribe(_callTypes => {
      this.callTypeList = _callTypes;
    });

  }

  refreshAgentCols() {
    this.AgentcolumnDefs = [
      { headerName: 'ANI', width: 300, field: 'ANI' },
      { headerName: 'Date', width: 300, field: 'Date' },
      { headerName: 'Time', width: 300, field: 'Time' },
      { headerName: 'Talk Time', width: 200, field: 'Talk Time' },
      { headerName: 'Hold Time', width: 200, field: 'Hold Time' },
      { headerName: 'Ans Wait Time', width: 185, field: 'Answer Wait Time' },
      { headerName: 'Wrap Time', width: 300, field: 'Wrap Time' }
    ];
    // if (this.agentGridApi) {
    //   this.agentGridApi.setColumnDefs(this.AgentcolumnDefs);
    // }
    
  }
  //below 2 functions stoped due AWDB 
  getAgentData() {
    debugger
    let startDateTime = moment(this.agentcallinfofilter.startDate).format("YYYY-MM-DD");
    let endDateTime = moment(this.agentcallinfofilter.endDate).format("YYYY-MM-DD");
    this.agentcallinfofilter.startDate = new Date(startDateTime);
    this.agentcallinfofilter.endDate = new Date(endDateTime);
    this.auth.GetAgentCallInfo(this.agentcallinfofilter).subscribe(_agentCallList => {
      this.AgentCallInfo = _agentCallList;
      console.log('GetAgentCallInfo Response Called::::' + JSON.stringify(_agentCallList));
      this.AgentCallInfoData$.next(this.AgentCallInfo);
    });
    // this.agentGridApi.sizeColumnsToFit();
  }
  clearFilter() {
    this.agentcallinfofilter.agentId = undefined;
    this.agentcallinfofilter.callType = '';
    this.agentcallinfofilter.startDate = undefined;
    this.agentcallinfofilter.endDate = undefined;
    this.AgentCallInfo = undefined;
    this.AgentCallInfoData$.next(this.AgentCallInfo);
  }
  isTitleValid(): boolean {
    console.log('Validating Agent Call Info Filter: ' + JSON.stringify(this.agentcallinfofilter, null, 8));
    return (this.agentcallinfofilter
      && this.agentcallinfofilter.agentId && this.agentcallinfofilter.agentId > 0
      && this.agentcallinfofilter.callType && this.agentcallinfofilter.callType.length > 0
      && this.agentcallinfofilter.startDate && this.agentcallinfofilter.startDate.toString().length > 0
      && this.agentcallinfofilter.endDate && this.agentcallinfofilter.endDate.toString().length > 0
    );
  }

}
