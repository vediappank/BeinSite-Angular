import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {  AuthService } from '../../../../core/auth';
import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';

import { CCQualityRequest } from '../_models/ccqualityrequest.model';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-quality-detail',
  templateUrl: './quality-detail.component.html',
  styleUrls: ['./quality-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityDetailComponent implements OnInit {
 popupHeader:string;
  public inputs: CCQualityRequest;
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
  public qualityTOTAVGInfo: any;
  public QualityTOTAVGInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.qualityTOTAVGInfo);



  constructor(private auth: AuthService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any ) {
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
    this.refreshTOTAVGCols();
  }



  ngOnInit() {
    if (this.data) {
      //this.popupHeader =  this.data.repInput.replace("# ", "");
      this.inputs = this.data.inputs;
      console.log('Quality Detail Input Information::::' + this.inputs);
      this.getQualityInfo();
    }
  }

  refreshTOTAVGCols() {
    this.popupHeader =  this.data.repInput.replace("# ", "");
    if ( this.popupHeader.startsWith('Agents - Not Evaluated')) {
      if(this.data.inputs.GroupBy.toLowerCase() === 'supervisor')
      {
        this.columnDefs = [         
          { headerName: 'Supervisor ID', field: 'SupervisorID', width: 180 },
          { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 230 },
          { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 190 },
          { headerName: 'Agent NotEval Count', field: 'AgentNotEvalCount', width: 190 }        
        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }  
      }
      else{
      this.columnDefs = [
        { headerName: 'Agent ID', field: 'AgentID', width: 100 },
        { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 180 },
        { headerName: 'Agent LastName', field: 'AgentLastName', width: 150 },
        { headerName: 'Supervisor ID', field: 'SupervisorID', width: 180 },
        { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 180 },
        { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 190 }        
      ];
      if (this.gridApi) {
        this.gridApi.setColumnDefs(this.columnDefs);
      }
    }
    }
    else if (this.popupHeader.startsWith('Agents - Evaluated') ||  this.popupHeader.startsWith('Avg Evaluation Score') ||  this.popupHeader.startsWith('Total Evaluations')){     
      if(this.data.inputs.GroupBy.toLowerCase() === 'supervisor')
      {
        this.columnDefs = [         
          { headerName: 'Supervisor ID', field: 'SupervisorID', width: 150 },
          { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 180 },
          { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 190 },        
         // { headerName: 'Role', field: 'Role', width: 150 },
        { headerName: 'Avg Score Of Team', field: 'AvgScoreOfTeam', width: 190 },
        { headerName: 'Agent Eval Count', field: 'AgentEvalCount', width: 190 },
        { headerName: 'Agent Not Eval Count', field: 'AgentNotEvalCount', width: 190 },
        { headerName: 'Eval Done', field: 'EvalDone', width: 190 }
        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }
      }
      else
      {
        this.columnDefs = [
          { headerName: 'Agent ID', field: 'AgentID', width: 100 },
          { headerName: 'Agent FirstName', field: 'AgentFirstName', width: 180 },
          { headerName: 'Agent LastName', field: 'AgentLastName', width: 150 },
          { headerName: 'Supervisor ID', field: 'SupervisorID', width: 180 },
          { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 180 },
          { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 170 },
          { headerName: 'No of Evalutions', field: 'NoofEvalutions', width: 120 },
          { headerName: 'Avg Score', field: 'AvgScore', width: 120 }
        ];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
        }
      }
      
    }
    // else if ( this.popupHeader.startsWith('Total Evaluations')) {
    //   this.columnDefs = [      
    //     // { headerName: 'Supervisor ID', field: 'SupervisorID', width: 180 },
    //     // { headerName: 'Supervisor FirstName', field: 'SupervisorFirstName', width: 180 },
    //     // { headerName: 'Supervisor LastName', field: 'SupervisorLastName', width: 190 },
    //     // { headerName: 'Role', field: 'Role', width: 150 },
    //     // { headerName: 'Avg Score Of Team', field: 'AvgScoreOfTeam', width: 190 },
    //     // { headerName: 'Agent Eval Count', field: 'AgentEvalCount', width: 190 },
    //     // { headerName: 'Agent Not Eval Count', field: 'AgentNotEvalCount', width: 190 },
    //     // { headerName: 'Eval Done', field: 'EvalDone', width: 190 }
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

  getQualityInfo() {    
    this.title =  this.data.repInput + ' List';
    if ( this.popupHeader.startsWith('Agents - Not Evaluated')) {
      this.auth.GetQualityNOTEVALDetail(this.inputs).subscribe(_totagtqualitybarList => {
        console.log('GetQualityNOTEVALDetail Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
        this.qualityTOTAVGInfo = _totagtqualitybarList;
        this.QualityTOTAVGInfoData$.next(this.qualityTOTAVGInfo);
      });
    }
    else if ( this.popupHeader.startsWith('Agents - Evaluated') ||  this.popupHeader.startsWith('Avg Evaluation Score')) {
      this.auth.GetQualityAGTEVALDetail(this.inputs).subscribe(_totagtqualitybarList => {
        console.log('GetQualityTOTAVGDetail Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
        this.qualityTOTAVGInfo = _totagtqualitybarList;
        this.QualityTOTAVGInfoData$.next(this.qualityTOTAVGInfo);
      });
    }
    else if ( this.popupHeader.startsWith('Total Evaluations')) {
      this.auth.GetQualityAGTEVALDetail(this.inputs).subscribe(_totagtqualitybarList => {
        console.log('GetQualityAGTEVALDetail Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
        console.log('GetQualityAGTEVALDetail response::::' + JSON.stringify(_totagtqualitybarList));
        this.qualityTOTAVGInfo = _totagtqualitybarList;
        this.QualityTOTAVGInfoData$.next(this.qualityTOTAVGInfo);
      });
    }    
  }
}
