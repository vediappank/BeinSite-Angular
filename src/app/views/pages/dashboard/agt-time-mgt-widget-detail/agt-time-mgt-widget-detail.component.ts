import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {  AuthService } from '../../../../core/auth';
import { CCTimeMgtDetailRequest } from '../_models/cctimemgtdetail.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-agt-time-mgt-widget-detail',
  templateUrl: './agt-time-mgt-widget-detail.component.html',
  styleUrls: ['./agt-time-mgt-widget-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgtTimeMgtWidgetDetailComponent implements  OnInit {

  public Reportsinputs: CCTimeMgtDetailRequest;
  public inputs: CCTimeMgtDetailRequest;
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
  public timwmgtInfo: any;
  public agtTimemgtInfoData$ = new BehaviorSubject<any[]>(this.timwmgtInfo);



  constructor(private auth: AuthService, public dialog: MatDialog,
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
    if (this.data.inputs) {
      this.inputs = this.data.inputs;
      console.log('Time Management Details Detail Input Information::::' + this.inputs);
      this.gettimeMgtDetailInfo();
    }
  }

  refreshCols() {    
      this.columnDefs = [
        { headerName: 'Agent ID', field: 'AgentID', width: 120 },
        { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 180 },
        { headerName: 'Agent LastName', field: 'AgentLastName', width: 150 },
        { headerName: 'Duration', field: 'Duration', width: 120 },
        { headerName: 'Aux(%)', field: 'AuxPer', width: 100 },
        { headerName: 'Avg Duration', field: 'AvgDuration', width: 120 }        
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

  gettimeMgtDetailInfo() {
    this.title = this.data.repInput + ' List'; 
    this.Reportsinputs= {
      repStartDate: this.data.inputs.repStartDate, repEndDate: this.data.inputs.repEndDate, RoleID: this.data.inputs.RoleID, 
      callcenter: this.data.inputs.callcenter, aux_code:this.data.repInput, GroupBy:this.data.inputs.GroupBy
    }
      this.auth.GetCCTimeMgtDetail(this.Reportsinputs).subscribe(_List => {
        console.log('gettimeMgtDetailInfo Reports Data Response Came::::' + JSON.stringify(this.Reportsinputs));
        this.timwmgtInfo = _List;
        this.agtTimemgtInfoData$.next(this.timwmgtInfo);
      });
    } 
}
