import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from '../../../../core/auth';
import { CCCUSTEXPRequest } from '../_models/cccustexprequest.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-customer-exprience-detail',
  templateUrl: './customer-exprience-detail.component.html',
  styleUrls: ['./customer-exprience-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerExprienceDetailComponent implements OnInit {


  public inputs: CCCUSTEXPRequest;
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
  public CustExpInfo: any;
  public CustExpInfoData$ = new BehaviorSubject<any[]>(this.CustExpInfo);
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
      console.log('CustExp Performance Detail Input Information::::' + this.inputs);
      this.getCustExpPerformanceInfo();
    }
  }

  refreshCols() {       
    let commonfield: any[] = [];
    if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {
      commonfield = [{ headerName: 'Supervisor ID', field: 'SupervisorID', width: 120 },
      { headerName: 'Supervisor First Name', field: 'SupervisorFirstName', width: 220 },
      { headerName: 'Supervisor Last Name', field: 'SupervisorLastName', width: 160 }]

    }
    else {
      commonfield = [{ headerName: 'Agent ID', field: 'AgentID', width: 100 },
      { headerName: 'Agent First Name', field: 'AgentFirstName', width: 220 },
      { headerName: 'Agent Last Name', field: 'AgentLastName', width: 140 }]
    }

    if (this.data.repInput.startsWith('# Transferred Calls To Survey')) {
      commonfield.push({ headerName: 'Transferred Survey Calls', field: 'Trans_to_Survey_Calls', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }
    else if (this.data.repInput.startsWith('% FCR')) {
      commonfield.push({ headerName: 'FCR (%)', field: 'FCR', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }
    else if (this.data.repInput == '% CSAT') {
      commonfield.push(   { headerName: 'CSAT (%)', field: 'CSAT', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }
    else if (this.data.repInput.startsWith('# Once & Done')) {
      commonfield.push( { headerName: 'Once & Done Calls', field: 'Once_and_Done_Calls', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }
    else if (this.data.repInput.startsWith('% Once & Done')) {
      commonfield.push( { headerName: 'Once & Done (%)', field: 'Once_and_Done_Calls_Per', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }
    else if (this.data.repInput.startsWith('% Transferred Calls to Survey')) {
      commonfield.push({ headerName: 'Transferred Calls to Survey (%)', field: 'Trans_to_Survey_Calls_Per', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }
    else if (this.data.repInput == '% CSAT Completed') {
      commonfield.push({ headerName: 'CSAT Completed (%)', field: 'CSAT_Ans_Per', width: 180 },
      { headerName: 'Handled Calls', field: 'Handled_Calls', width: 130 });
    }

    //let Column:any[];
    //if(this.popupHeader =="")
    //Column = 
    // if (this.data.inputs.GroupBy.toLowerCase() === 'supervisor') {
    //   this.columnDefs = [
    //     { headerName: 'Supervisor ID', field: 'SupervisorID', width: 120 },
    //     { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 250 },
    //     { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 250 },
       
        
        
     
        
        
        
    //     //{ headerName: 'Non Once & Done Calls', field: 'None_Once_and_Done_Calls', width: 230 }
    //   ];     
    // }
    // else
    // {
    //   this.columnDefs = [
    //     { headerName: 'Agent ID', field: 'AgentID', width: 120 },
    //     { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 250 },
    //     { headerName: 'Agent LastName', field: 'AgentLastName', width: 250 },        
    //     { headerName: 'Handled Calls', field: 'Handled_Calls', width: 230 },
    //     { headerName: 'Transferred Survey Calls', field: 'Trans_to_Survey_Calls', width: 230 },
    //     { headerName: 'Transferred Calls (%)', field: 'Trans_to_Survey_Calls_Per', width: 230 },
    //     { headerName: 'CSAT', field: 'CSAT', width: 230 },
    //     { headerName: 'CSAT Completed (%)', field: 'CSAT_Ans_Per', width: 230 },
    //     { headerName: 'Once & Done Calls', field: 'Once_and_Done_Calls', width: 230 },
    //     { headerName: 'Once & Done (%)', field: 'Once_and_Done_Calls_Per', width: 230 }
    //     //{ headerName: 'Non Once & Done Calls', field: 'None_Once_and_Done_Calls', width: 230 }
    //   ];     
    // }
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

  getCustExpPerformanceInfo() {
    this.title = this.data.repInput + ' List';
    this.auth.GetCCCustExpSummaryReport(this.inputs).subscribe(_totagtqualitybarList => {
      console.log('GetCCCustExp Performance Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
      this.CustExpInfo = _totagtqualitybarList;
      this.CustExpInfoData$.next(this.CustExpInfo);
    });
  }
}
