import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {  AuthService } from '../../../../../core/auth';
import 'ag-grid-enterprise';
import { InputRequest } from '../../../../pages/dashboard/_models/inputrequest.model';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'kt-bar-detail-widget',
  templateUrl: './bar-detail-widget.component.html',
  styleUrls: ['./bar-detail-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarDetailwidgetComponent implements OnInit {
 

  public inputs: InputRequest;
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
  public barDetailInfo: any;
  public barDetailInfoData$ = new BehaviorSubject<any[]>(this.barDetailInfo);
  SummaryName: any;
  RoleID: any;
  agentreportinputReq: { repStartDate: any; repEndDate: any; agentlastname: any; RoleID: any; callcenter: string; };



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
      this.SummaryName = this.data.SummaryName;
      console.log('Bar Detail Input Information::::' + JSON.stringify(this.inputs)); 
      if (this.SummaryName == 'Absence (%)') {
        this.getAbsentiesDetailInfo();
      }     
    }
  }

  refreshCols() {
    if (this.SummaryName == 'Absence (%)') {
      this.columnDefs = [
        { headerName: 'AgentId', field: 'AgentId', width: 120 },
        { headerName: 'First Name', field: 'FirstName', width: 280 },
        { headerName: 'Last Name', field: 'LastName', width: 200 }  
      ];
      if (this.gridApi) {
        this.gridApi.setColumnDefs(this.columnDefs);
      }

    }
    // else if (SummaryName == 'Agents - Evaluated' || this.data.repInput == 'Avg Evaluation Score') {
    //   this.columnDefs = [
    //     { headerName: 'Agent ID', field: 'AgentID', width: 120 },
    //     { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 180 },
    //     { headerName: 'Agent LastName', field: 'AgentLastName', width: 150 },
    //     { headerName: 'Supervisor ID', field: 'SupervisorID', width: 180 },
    //     { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 180 },
    //     { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 190 },
    //     { headerName: 'No of Evalutions', field: 'NoofEvalutions', width: 150 },
    //     { headerName: 'Avg Score', field: 'AvgScore', width: 190 }
    //   ];
    //   if (this.gridApi) {
    //     this.gridApi.setColumnDefs(this.columnDefs);
    //   }
    // }
    // else if (this.data.repInput == 'Total Evaluations') {
    //   this.columnDefs = [      
    //     { headerName: 'Supervisor ID', field: 'SupervisorID', width: 180 },
    //     { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 180 },
    //     { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 190 },
    //     { headerName: 'Role', field: 'Role', width: 150 },
    //     { headerName: 'Avg Score Of Team', field: 'AvgScoreOfTeam', width: 190 },
    //     { headerName: 'Agent Eval Count', field: 'AgentEvalCount', width: 190 },
    //     { headerName: 'Agent Not Eval Count', field: 'AgentNotEvalCount', width: 190 },
    //     { headerName: 'Eval Done', field: 'EvalDone', width: 190 }
    //   ];
    //   if (this.gridApi) {
    //     this.gridApi.setColumnDefs(this.columnDefs);
    //   }
    // }    
  }

  getAbsentiesDetailInfo() {
    console.log('Absenties Calls Data Function Called');
    var splitted = this.data.inputs.split("~"); 
    if (splitted) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
    
      // this.agentreportinputReq = {
      //   repStartDate: splitted[1], repEndDate: splitted[2], agentlastname : this.lastname, RoleID:this.RoleID,callcenter:''
      // }
    //   let schDateTime = moment(this.reportRange.startDate);
    //   console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
    //   this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
    //   schDateTime = moment(this.reportRange.endDate);
    //   console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
    //   this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      
    //   this.agentData = this.auth.GetAbsentiesReport(this.agentreportinputReq);
    //   this.agentData.subscribe(_ratiobarList => {                 
    //     setTimeout(() => { this.autoSizeAll(); }, 1000);
    //     console.log('Absenties Calls Response Called::::' + JSON.stringify(_ratiobarList));
    //   });
    }
  }

}
