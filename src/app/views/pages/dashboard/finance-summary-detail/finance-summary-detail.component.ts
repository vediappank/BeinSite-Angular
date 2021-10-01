import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import { CCFinanceRequest } from '../_models/ccfinancerequest.model'
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-finance-summary-detail',
  templateUrl: './finance-summary-detail.component.html',
  styleUrls: ['./finance-summary-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceSummaryDetailComponent implements OnInit {


  public inputs: CCFinanceRequest;
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
  public FinanceInfo: any;
  public FinanceInfoData$ = new BehaviorSubject<any[]>(this.FinanceInfo);
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
      console.log('Finance Performance Detail Input Information::::' + JSON.stringify(this.inputs));
      this.getFinancePerformanceInfo();
    }
  }

  refreshCols() {
    this.popupHeader =  this.data.repInput.replace("# ", "");
    if ( this.popupHeader.startsWith("Total Transactions")) {
      if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {
        this.columnDefs = [
          { headerName: 'Supervisor ID', field: 'SupervisorID', width: 120 },
          { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 230 },
          { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 230 },          
          { headerName: 'Transactions', field: 'Transactions', width: 200 },

        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }
      }
      else {
        this.columnDefs = [
          { headerName: 'Agent ID', field: 'AgentID', width: 120 },
          { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 230 },
          { headerName: 'Agent LastName', field: 'AgentLastName', width: 230 },          
          { headerName: 'Transactions', field: 'Transactions', width: 200 },

        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }
      }
    }
    else if ( this.popupHeader.startsWith("Total Revenue")) {
      if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {
        this.columnDefs = [
          { headerName: 'Supervisor ID', field: 'SupervisorID', width: 120 },
          { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 230 },
          { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 230 },
          { headerName: 'Revenue ($)', field: 'Revenue', width: 200 }
        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        } 
      }
      else {
        this.columnDefs = [
          { headerName: 'Agent ID', field: 'AgentID', width: 120 },
          { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 230 },
          { headerName: 'Agent LastName', field: 'AgentLastName', width: 230 },
          { headerName: 'Revenue ($)', field: 'Revenue', width: 200 }
        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }
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

  getFinancePerformanceInfo() {
    this.title =  this.data.repInput + ' List';
    this.auth.GetFinance_Detail(this.inputs).subscribe(_List => {
      this.FinanceInfo = _List;
     console.log('Finance Performance Reports input::::' + JSON.stringify(this.data.inputs));
     // console.log('Finance Performance Reports Data Response Came::::' + JSON.stringify(this.FinanceInfo));
      this.FinanceInfoData$.next(this.FinanceInfo);
    });
  }
}
