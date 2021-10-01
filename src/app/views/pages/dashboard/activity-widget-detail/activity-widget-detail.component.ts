import { Component, OnInit, Inject, ChangeDetectionStrategy,OnChanges,ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import { ActivityWidgetRequest } from '../_models/activitywidgetrequest.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'kt-activity-widget-detail',
  templateUrl: './activity-widget-detail.component.html',
  styleUrls: ['./activity-widget-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityWidgetDetailComponent implements OnInit, OnChanges {

  public inputs: ActivityWidgetRequest;
  public Reportsinputs: ActivityWidgetRequest;
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

  public ActivityInfo: any;
  public ActivityInfoData$ = new BehaviorSubject<any[]>(this.ActivityInfo);

  constructor(private auth: AuthService,private cdRef:ChangeDetectorRef,
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
    this.refreshCols();
  }

  
  ngOnInit() {    
  
    this.getActivityInfo();
  }
  ngOnChanges()
  {
    this.getActivityInfo();
  }


  refreshCols() {
    this.columnDefs = [      
      { headerName: 'Agent ID', field: 'AgentID', width: 170 },
      { headerName: 'First Name', field: 'FirstName', width: 310 },
      { headerName: 'Last Name', field: 'LastName', width: 310 }
    ];
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

  getActivityInfo() {

    // 
    // let ActivityinputReq:any;
    // if (localStorage.hasOwnProperty('ActivityinputReq')) {
    //   ActivityinputReq = JSON.parse(localStorage.getItem('ActivityinputReq')).token;
    // };    
    // this.Reportsinputs = {
    //   repStartDate: ActivityinputReq.repStartDate, repEndDate: ActivityinputReq.repEndDate, RoleID: ActivityinputReq.RoleID,
    //   callcenter: ActivityinputReq.callcenter,
    //   ActivityID: localStorage.getItem["ActivityID"]
    // }
    // this.title = localStorage.getItem["ActivityName"] + ' List';
   
    this.Reportsinputs = {
      repStartDate: this.data.detail_inputs.repStartDate, repEndDate: this.data.detail_inputs.repEndDate, RoleID: this.data.detail_inputs.RoleID,
       callcenter: this.data.detail_inputs.callcenter,
      ActivityID: this.data.ActivityID
    }    
    this.title = this.data.ActivityName + ' List';
    this.auth.GetActivityDetail(this.Reportsinputs).subscribe(_qualitybarList => {
      console.log('GetActivityDetail Reports Data Response Came::::' + JSON.stringify(this.Reportsinputs));
      this.ActivityInfo = _qualitybarList;
      this.ActivityInfoData$.next(this.ActivityInfo);
    });
  }
  
}