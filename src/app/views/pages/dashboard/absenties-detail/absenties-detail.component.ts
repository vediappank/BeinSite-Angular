import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Widget1Data } from '../../../partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { CCAbsentiesRequest } from '../_models/ccabsentiesrequest.model';


import { MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'kt-absenties-detail',
  templateUrl: './absenties-detail.component.html',
  styleUrls: ['./absenties-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbsentiesDetailComponent implements OnInit {


  public inputs: CCAbsentiesRequest;
  public Reportsinputs: CCAbsentiesRequest;
  //Qulaityinfo
  private gridApi;
  public gridDefaultColDef = {
    resizable: true, sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: true, enableRowGroup: true, enablePivot: true,
  };
  public gridOptions: GridOptions;
  public columnDefs: any;
  public gridSummaryData: any;
  public getGridRowStyle: any;

  public title: string;

  public AbsentiesInfo: any[] = [];
  public AbsentiesInfoData$ = new BehaviorSubject<any[]>(this.AbsentiesInfo);

  constructor(private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      enableColResize: true,
      defaultColDef: this.gridDefaultColDef,
      suppressColumnVirtualisation: true
    };
    this.getGridRowStyle = function (params) {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
    };
    // if(this.data.repInput =='% Absence')    
    this.refreshCols();
    // else if(this.data.repInput =='# Absence')    
    // this.refreshCols();
    // else if(this.data.repInput =='# Late')    
    // this.refreshCols();
    // else if(this.data.repInput =='# Left Early')    
    // this.refreshCols();
    // else if(this.data.repInput =='# FullDay Abs')    
    // this.refreshCols();
  }


  ngOnInit() {

    this.getAbsentiesInfo();
  }
  ngOnChanges() {
    this.getAbsentiesInfo();
  }

 


  refreshCols() {
    let commonfield: any[] = [];
    if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {
      commonfield = [{ headerName: 'Supervisor ID', field: 'SupervisorId', width: 120 },
      { headerName: 'Supervisor First Name', field: 'SupervisorFirstName', width: 220 },
      { headerName: 'Supervisor Last Name', field: 'SupervisorLastName', width: 240 }]

    }
    else {
      commonfield = [{ headerName: 'Agent ID', field: 'AgentId', width: 120 },
      { headerName: 'Agent First Name', field: 'AgentFirstName', width: 220 },
      { headerName: 'Agent Last Name', field: 'AgentLastName', width: 240 }]
    }
    

    if (this.data.repInput.startsWith('% Absence')) {
      commonfield.push({ headerName: 'Absence (%)', field: 'AbsencePercentage', width: 200 });
    }
    else if (this.data.repInput.startsWith('# Absence')) {
      commonfield.push({ headerName: 'Absence Count', field: 'AbsenceCount', width: 200 });
    }
    else if (this.data.repInput.startsWith('# Late')) {
      commonfield.push({ headerName: 'Late Count', field: 'LateCount', width: 200 });
    }
    else if (this.data.repInput.startsWith('# Left Early')) {
      commonfield.push({ headerName: 'LeftEarly Count', field: 'LeftEarlyCount', width: 200 });
    }
    else if (this.data.repInput.startsWith('# FullDay Abs')) {
      commonfield.push({ headerName: 'FullDayAbs Count', field: 'FullDayAbsCount', width: 200 });
    }

    this.columnDefs = commonfield;
      if (this.gridApi) {
        this.gridApi.setColumnDefs(this.columnDefs);
      }

  }

  public sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      }
    ],
    defaultToolPanel: null
  }

  getAbsentiesInfo() {
    this.Reportsinputs = {
      repStartDate: this.data.inputs.repStartDate, repEndDate: this.data.inputs.repEndDate, RoleID: this.data.inputs.RoleID,
      callcenter: this.data.inputs.callcenter, GroupBy: this.data.inputs.GroupBy, dayorweek: this.data.inputs.dayorweek
    }
    this.title = this.data.repInput + ' List';
    console.log('GetAbsentiesDetail Reports title::::' + JSON.stringify(this.data.repInput));
    this.auth.GetAbsentiesReport(this.Reportsinputs).subscribe(_absencebarList => {
      console.log('GetAbsentiesDetail Reports Data Response Came::::' + JSON.stringify(this.Reportsinputs));
      if (this.data.repInput.startsWith('% Absence'))
        this.AbsentiesInfo = _absencebarList;
      else if (this.data.repInput.startsWith('# Absence'))
        this.AbsentiesInfo = _absencebarList.filter(x => x.AbsenceCount > 0);
      else if (this.data.repInput.startsWith('# Late'))
        this.AbsentiesInfo = _absencebarList.filter(x => x.LateCount > 0);
      else if (this.data.repInput.startsWith('# Left Early'))
        this.AbsentiesInfo = _absencebarList.filter(x => x.LeftEarlyCount > 0);
      else if (this.data.repInput.startsWith('# FullDay Abs'))
        this.AbsentiesInfo = _absencebarList.filter(x => x.FullDayAbsCount > 0);

      this.AbsentiesInfoData$.next(this.AbsentiesInfo);
    });


  }

}