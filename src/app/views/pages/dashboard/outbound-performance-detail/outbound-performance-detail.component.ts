import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';
import { CCOutBoundRequest } from '../_models/ccoutboundrequest.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-outbound-performance-detail',
  templateUrl: './outbound-performance-detail.component.html',
  styleUrls: ['./outbound-performance-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundPerformanceDetailComponent implements OnInit {


  public inputs: CCOutBoundRequest;
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
  public outboundInfo: any;
  public outboundInfoData$ = new BehaviorSubject<any[]>(this.outboundInfo);
  popupHeader: any;



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
    if (this.data) {
      this.inputs = this.data.inputs;
      console.log('Outbound Performance Detail Input Information::::' + this.inputs);
      this.getOutboundPerformanceInfo();
    }
  }

  refreshCols() {
    this.popupHeader =  this.data.repInput.replace("# ", "");
      if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {

        this.columnDefs = [
          { headerName: 'Supervisor ID', field: 'SupervisorID', width: 120 },
          { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 200 },
          { headerName: 'Supervisor LastName', field: 'SupervisorLastName SupervisortLastName', width: 200 },
          { headerName: '# Manual Calls', field: 'NoofManualCalls', width: 120 },
          { headerName: '# Dialler Calls', field: 'NoofDiallerCalls', width: 250 },
          { headerName: 'AHT Dialler', field: 'AHTDialer', width: 230 },
          { headerName: 'AHT Manual OutBound', field: 'AHTManualOutBound', width: 230 },
          { headerName: 'Manual Outbound (%)', field: 'ManualOutboundPer', width: 230 }

        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }
      }
    else {
      this.columnDefs = [
        { headerName: 'Agent ID', field: 'AgentID', width: 120 },
        { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 200 },
        { headerName: 'Agent LastName', field: 'AgentLastName', width: 200 },
        { headerName: '# Manual Calls', field: 'NoofManualCalls', width: 120 },
        { headerName: '# Dialler Calls', field: 'NoofDiallerCalls', width: 250 },
        { headerName: 'AHT Dialler', field: 'AHTDialer', width: 230 },
        { headerName: 'AHT Manual OutBound', field: 'AHTManualOutBound', width: 230 },
        { headerName: 'Manual Outbound (%)', field: 'ManualOutboundPer', width: 230 }

      ];
      if (this.gridApi) {
        this.gridApi.setColumnDefs(this.columnDefs);
      }
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

  getOutboundPerformanceInfo() {
    this.title = this.data.repInput + ' List';
    this.auth.GetCCOutboundSummaryReport(this.inputs).subscribe(_totagtqualitybarList => {
      console.log('outbound Performance Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
      this.outboundInfo = _totagtqualitybarList;
      this.outboundInfoData$.next(this.outboundInfo);
    });
  }
}
