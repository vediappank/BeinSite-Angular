import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';
import { CCWhatsAppRequest } from '../_models/ccwhatsapprequest.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-whatsapp-performance-detail',
  templateUrl: './whatsapp-performance-detail.component.html',
  styleUrls: ['./whatsapp-performance-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappPerformanceDetailComponent implements OnInit {


  public inputs: CCWhatsAppRequest;
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
  public whataAppPerInfo: any;
  public whataAppInfoData$ = new BehaviorSubject<any[]>(this.whataAppPerInfo);



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
      console.log('WhatsApp Performance Detail Input Information::::' + this.inputs);
      this.getWhatsAppPerformanceInfo();
    }
  }

  refreshCols() {
    let Gridcolumn: any;  
    if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {
      this.columnDefs = [
        { headerName: 'Supervisor ID', field: 'SupervisorID', width: 120 },
        { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 200 },
        { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 150 },
        { headerName: 'WhatsApp Assinged', field: 'WhatsAppAssingedCount', width: 150 },
        { headerName: 'WhatsApp Resolved', field: 'WhatsAppResolvedCount', width: 150 },
        { headerName: 'WhatsApp Message Sent', field: 'WhatsAppMessageSent', width: 220 },
        { headerName: 'WhatsApp Resolution Time', field: 'WhatsAppResolutionTime', width: 220 },
        { headerName: 'WhatsApp Response Time', field: 'WhatsAppResponseTime', width: 220 },
        { headerName: 'WhatsApp First Response Time', field: 'WhatsAppFirstResponseTime', width: 230 },
        { headerName: 'WhatsApp Avg Resolution Time', field: 'WhatsAppAvgResolutionTime', width: 230 },
        { headerName: 'WhatsApp Transactions', field: 'WhatsAppTransactions', width: 220 },
        { headerName: 'WhatsApp Revenue', field: 'WhatsAppRevenue', width: 150 },
        { headerName: 'WhatsApp ARPT', field: 'WhatsAppARPT', width: 180 }
      ];
      if (this.gridApi) {
        this.gridApi.setColumnDefs(this.columnDefs);
      }
    }
    else
    {
      this.columnDefs = [
        { headerName: 'Agent ID', field: 'AgentID', width: 120 },
        { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 200 },
        { headerName: 'Agent LastName', field: 'AgentLastName', width: 150 },
        { headerName: 'WhatsApp Assinged', field: 'WhatsAppAssingedCount', width: 150 },
        { headerName: 'WhatsApp Resolved', field: 'WhatsAppResolvedCount', width: 150 },
        { headerName: 'WhatsApp Message Sent', field: 'WhatsAppMessageSent', width: 220 },
        { headerName: 'WhatsApp Resolution Time', field: 'WhatsAppResolutionTime', width: 220 },
        { headerName: 'WhatsApp Response Time', field: 'WhatsAppResponseTime', width: 220 },
        { headerName: 'WhatsApp First Response Time', field: 'WhatsAppFirstResponseTime', width: 230 },
        { headerName: 'WhatsApp Avg Resolution Time', field: 'WhatsAppAvgResolutionTime', width: 230 },
        { headerName: 'WhatsApp Transactions', field: 'WhatsAppTransactions', width: 220 },
        { headerName: 'WhatsApp Revenue', field: 'WhatsAppRevenue', width: 150 },
        { headerName: 'WhatsApp ARPT', field: 'WhatsAppARPT', width: 180 }
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

  getWhatsAppPerformanceInfo() {
    this.title = this.data.repInput + ' List';
    this.auth.GetCCWhatsAppSummaryReport(this.inputs).subscribe(_totwhatsappbarList => {
      console.log('WhatsApp Performance Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
      this.whataAppPerInfo = _totwhatsappbarList;
      this.whataAppInfoData$.next(this.whataAppPerInfo);
    });
  }
}
