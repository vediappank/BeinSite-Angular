import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';
import { CCInboundRequest } from '../_models/ccinboundrequest.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { DebugHelper } from 'protractor/built/debugger';

@Component({
  selector: 'kt-inbound-performance-detail',
  templateUrl: './inbound-performance-detail.component.html',
  styleUrls: ['./inbound-performance-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboundPerformanceDetailComponent implements OnInit {


  public inputs: CCInboundRequest;
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
  public inboundPerInfo: any;
  public inboundPerInfoData$ = new BehaviorSubject<any[]>(this.inboundPerInfo);
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
      console.log('Inbound Performance Detail Input Information::::' + this.inputs);
      this.getInboundPerformanceInfo();
    }
  }

  refreshCols() {    
    let commonfield: any[] = [];
    commonfield = [{ headerName: 'Agent ID', field: 'AgentID', width: 100 },
    { headerName: 'Agent First Name', field: 'AgentFirstName', width: 240 },
    { headerName: 'Agent Last Name', field: 'AgentLastName', width: 240 }]

    if (this.data.repInput.startsWith('# Handled Calls'))
      commonfield.push({ headerName: 'Handled Calls', field: 'Handled_Calls', width: 200 });
    else if (this.data.repInput.startsWith('# Answered Calls'))
      commonfield.push({ headerName: 'Answered Calls', field: 'Answred_Calls', width: 200 })
    else if (this.data.repInput.startsWith('Average Handled Time (AHT)')) {
      commonfield.push({ headerName: 'Handled Calls', field: 'Handled_Calls', width: 200 },
        { headerName: 'AHT', field: 'AHT', width: 200 });
    }

    else if (this.data.repInput.startsWith('Average Speed of Answer (ASA)'))
     commonfield.push({ headerName: 'ASA', field: 'ASA', width: 200 });
    else if (this.data.repInput.startsWith('# Disconnected Calls'))
     commonfield.push({ headerName: 'Disconnected Calls', field: 'Disconnected_Calls', width: 200 });
    else if (this.data.repInput.startsWith('# Assist Reqs'))
     commonfield.push({ headerName: 'Assist Reqs', field: 'Assist_Requests', width: 200 });
    else if (this.data.repInput.startsWith('% Of Assist Reqs'))
     commonfield.push({ headerName: '% Of Assist Reqs', field: 'Assist_Per', width: 200 });
    else if (this.data.repInput.startsWith('% Of Hold Accuracy'))
     commonfield.push({ headerName: '% Of Hold Accuracy', field: 'Hold_Calls_Per', width: 200 });
    else if (this.data.repInput.startsWith('# Internal Calls'))
     commonfield.push({ hheaderName: 'Internal Calls Count', field: 'Internal_Calls', width: 200 });
    else if (this.data.repInput.startsWith('Duration of Internal Calls'))
     commonfield.push({ headerName: 'Duration of Internal Calls', field: 'Internal_Call_Duration', width: 200 });
    else if (this.data.repInput.startsWith('# Inbound Transactions'))
     commonfield.push({ headerName: 'Inbound Transactions', field: 'Transactions_Count', width: 200 });
    else if (this.data.repInput.startsWith('Inbound Revenue'))
     commonfield.push({ headerName: 'Inbound Revenue', field: 'Revenue_In_Dollar', width: 200 });
    else if (this.data.repInput.startsWith('# Inbound ARPT'))
     commonfield.push({ headerName: 'Inbound ARPT', field: 'ARPT', width: 200 });


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

  getInboundPerformanceInfo() {
    this.title = this.data.repInput + ' List';
    this.auth.GetCCInboundSummaryReport(this.inputs).subscribe(_totagtqualitybarList => {
      console.log('Inbound Performance Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
      this.inboundPerInfo = _totagtqualitybarList;
      this.inboundPerInfoData$.next(this.inboundPerInfo);
    });
  }
}
