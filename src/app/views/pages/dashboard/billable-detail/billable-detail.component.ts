import { Component, OnInit, Inject, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA } from '@angular/material';

import {  AuthService } from '../../../../core/auth';

import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';
import { CCBillingRequest } from '../_models/billing.model'
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-billable-detail',
  templateUrl: './billable-detail.component.html',
  styleUrls: ['./billable-detail.component.scss'] , 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillableDetailComponent implements OnInit {

  public inputs: CCBillingRequest;
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
 
 public title:string;


 public billableInfo: any;  
 public billableInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.billableInfo);

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
  this.refreshCols();
}

 

 ngOnInit() {   
   if (this.data) {  
    this.title = 'Billable / Non Billable List By Hours';    
     ///this.inputs = this.data.inputs;
     this.billableInfo = this.data.inputs;
     this.billableInfoData$.next(this.billableInfo);      
     console.log('Billable Detail Input Information::::'+   this.billableInfo);
    // this.getBillableDetailInfo();
   }
 }

 refreshCols() {
   this.columnDefs = [    
      { headerName: 'MONTH', field: 'M', width:120},        
      { headerName: 'Total Duration', field: 'TotalDuration', width:120},
      { headerName: 'Billable', field: 'Billable', width:120},
      { headerName: 'Unbillable', field: 'Unbillable', width:120},
      { headerName: 'Potential Billable Duration', field: 'PotentialBillableDuration', width:200},
      { headerName: 'Follow UP Duration', field: 'followup_duration', width:170},
      { headerName: 'SOP Duration', field: 'sop_duration', width:120},
      { headerName: 'Training Duration', field: 'training_duration', width:160},
      { headerName: 'WhatsApp Duration', field: 'whatsapp_duration', width:160},
     { headerName: 'Talk Time', field: 'talk_time', width:120},
      { headerName: 'Hold Time', field: 'hold_time', width:120},
      { headerName: 'Wrap Time', field: 'wrap_time', width:120},
      { headerName: 'Outbound Calls Time', field: 'outbound_calls_time', width:160},
     // { headerName: 'Dialer Calls Time', field: 'dialer_calls_time', width:160},
     { headerName: 'Reserved Time', field: 'reserved_time', width:160},
      { headerName: 'Aux Zero Duration', field: 'aux_zero_duration', width:160},
    //   { headerName: 'Lunch Duration', field: 'lunch_duration', width:160},
    //   { headerName: 'Coffee Duration', field: 'coffee_duration', width:160},
      { headerName: 'Break Duration', field: 'break_duration', width:160},
      { headerName: 'End of Shift Duration', field: 'end_of_shift_duration', width:200},
      { headerName: 'OIC Duration', field: 'oic_duration', width:160},
      { headerName: 'SME duration', field: 'sme_duration', width:160},
      { headerName: 'Coaching Duration', field: 'coaching_duration', width:200},
      { headerName: 'Supervisor Only Duration', field: 'supervisor_only_duration', width:200},
      { headerName: 'One to One Duration', field: 'one_to_one_duration', width:200},
      { headerName: 'B-One to One Duration', field: 'b_one_to_one_duration', width:200},
      { headerName: 'UB-One to One Duration', field: 'ub_one_to_one_duration', width:200},
      { headerName: 'Team Meeting Duration', field: 'team_meeting_duration', width:200},    
      { headerName: 'B-Team Meeting Duration', field: 'b_team_meeting_duration', width:200},    
      { headerName: 'UB-Team Meeting Duration', field: 'ub_team_meeting_duration', width:200},    
      { headerName: 'Avail Duration', field: 'avail_duration', width:180}, 
      { headerName: 'B-Avail Duration', field: 'b_avail_duration', width:180},  
      { headerName: 'UB-Avail Duration', field: 'ub_avail_duration', width:180},
      { headerName: 'LoggedOn Time', field: 'logged_on_time', width:180},
      { headerName: 'Total NotReady Duration', field: 'total_Not_ready_duration', width:200},
      { headerName: 'Connection Failure Time', field: 'connection_failure_time', width:200}
    
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

//  getBillableDetailInfo() {  
  
//    this.title = 'Billable / Unbilabllle List';    
//      this.auth.GetBillingChartReport(this.inputs).subscribe(_totagtqualitybarList => {
//        console.log('GetBillingChartReport Reports Data Response Came::::' + JSON.stringify(this.data.inputs));
//        this.billableInfo = _totagtqualitybarList;
//        this.billableInfoData$.next(this.billableInfo);              
//      });    
//  }
}
