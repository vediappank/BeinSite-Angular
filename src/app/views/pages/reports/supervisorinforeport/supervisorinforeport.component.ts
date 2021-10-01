import { Component, OnInit,Inject } from '@angular/core';
import * as moment from 'moment';
import { SupervisorInfoRequest } from '../_models/SupervisorInfo.model';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import { DOCUMENT } from '@angular/common';
import { keys } from '@amcharts/amcharts4/.internal/core/utils/Object';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'kt-supervisorinforeport',
  templateUrl: './supervisorinforeport.component.html',
  styleUrls: ['./supervisorinforeport.component.scss']
})
export class SupervisorinforeportComponent implements OnInit {
  
  public reportRange: any;  
  public reportFields: any;
  public agentreportinputReq: SupervisorInfoRequest;
  public title = 'Supervisor Performance Report';
  public userID : string;
  
  private gridApi;
  private gridColumnApi;
  public gridDefaultColDef = {
    resizable: true, sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: true, enableRowGroup: true, enablePivot: true,
  };
  public gridOptions: GridOptions;
  public agentData: any;
  public columnDefs: any;
  public gridSummaryData: any;
  public getGridRowStyle: any;
  public RoleID:number;
  public elem;
  //Barchart Variables assign
  public chartTheme: string;
  public chart: any;
  public reportType: string ='ALL';
  public reportOrderBy: string ='handled_calls';
  public TypeListRange = [{
    id: 'ALL',
    name: 'ALL',
  },{
    id: 'TOP20',
    name: 'TOP20',
  },{
    id: 'WORST20',
    name: 'WORST20',
  },
];
public OrderByListRange = [{
  id: 'answered_calls',
  name: 'Answered Calls',
},{
  id: 'handled_calls',
  name: 'Handled Calls',
}
];

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
  };

  public reportDateRanges: any = {
    'Today': [moment().startOf('day'), moment().add(1, 'days').startOf('day')],
    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().startOf('day')],
    'This Week': [moment().startOf('week'), moment().endOf('week')],
    'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'This Year': [moment().startOf('year'), moment().endOf('year')],
    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]

  }
  constructor(private auth: AuthService,@Inject(DOCUMENT) private document: any, private activatedRoute: ActivatedRoute, private router: Router ) {
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
    this.elem = document.documentElement;
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userID = JSON.parse(localStorage.getItem('currentUser')).agentid;
  }
   
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.reportRange = {
      startDate: moment().subtract(1, 'months').startOf('month'),
      endDate: moment().subtract(1, 'months').endOf('month')
    };
    this.getReportData();
  }
 


  refreshCols() {
    this.columnDefs = [      
      { headerName: 'AgentID', field: 'AgentID', width: 100 },
      { headerName: 'First Name', field: 'FirstName', width: 190 },
      { headerName: 'Last Name', field: 'LastName', width: 190 },
      { headerName: 'isSupervisor', field: 'isSupervisor', width: 140 },
      // { headerName: 'Supervisor ID', field: 'SupervisorID', width: 140 }, 
      // { headerName: 'Supervisor First Name', field: 'SupervisorFirstName', width: 190 },
      // { headerName: 'Supervisor Last Name', field: 'SupervisorLastName', width: 190 },
      { headerName: 'Answered Calls', field: 'AnsweredCalls', width: 150 },
      { headerName: 'Handled Calls', field: 'HandledCalls', width: 150 },
      { headerName: 'Handled Calls Time (HH:MM:SS)', field: 'HandledCallsTime', width:230 },
      { headerName: 'AHT', field: 'AHT', width: 190 },
      { headerName: 'Talk Time (HH:MM:SS)', field: 'TalkTime', width: 190 },
      { headerName: 'Hold Time (HH:MM:SS)', field: 'HoldTime', width: 190 },
      { headerName: 'Wrap Time (HH:MM:SS)', field: 'WrapTime', width: 190 },
      { headerName: 'Answer Wait Time', field: 'AnswerWaitTime', width: 190 },
      { headerName: 'ASA', field: 'ASA', width: 190 },
      { headerName: 'Disconnect Calls', field: 'DisconnectCalls', width: 190 },
      { headerName: 'Hold Calls', field: 'HoldCalls', width: 190 },
      { headerName: 'LoggedOn Time (HH:MM:SS)', field: 'LoggedOnTime', width: 230 },
      { headerName: 'Avail Time (HH:MM:SS)', field: 'AvailTime', width: 190 },
      { headerName: 'Avail Time (%)', field: 'AvailTimePer', width: 190 },
      { headerName: 'NotReady Time (HH:MM:SS)', field: 'NotReadyTime', width: 220 },
      { headerName: 'Dialler Calls', field: 'DiallerCalls', width: 190 },
      { headerName: 'Dialler Calls Time (HH:MM:SS)', field: 'DiallerCallsTime', width: 220 },
      { headerName: 'Dialler AHT', field: 'DiallerAHT', width: 190 },
      { headerName: 'Outbound Calls', field: 'OutBoundCalls', width: 190 },
      { headerName: 'Outbound Calls Time (HH:MM:SS)', field: 'OutBoundCallsTime', width: 250 },
      { headerName: 'Outbound AHT', field: 'OutBoundAHT', width: 190 },
      { headerName: 'Assist Requests', field: 'AssistRequests', width: 190 },
      { headerName: 'Assist Requests (%)', field: 'AssistRequestsPer', width: 190 },
      { headerName: 'Transferred Calls to SurveyCalls', field: 'TransferredCallstoSurveyCalls', width: 250 },
      { headerName: 'FCR', field: 'FCR', width: 190 },
      { headerName: 'CSAT', field: 'CSAT', width: 190 },
      { headerName: 'Evaluations Count', field: 'EvaluationsCount', width: 190 },
      { headerName: 'Evaluations Score', field: 'EvaluationsScore', width: 190 },
      { headerName: 'Evaluations Score (%)', field: 'EvaluationsScorePer', width: 190 },
      { headerName: 'Quizs Count', field: 'QuizsCount', width: 190 },
      { headerName: 'Quizs Score', field: 'QuizsScore', width: 190 },
      { headerName: 'Quizs Score (%)', field: 'QuizsScorePer', width: 190 },
      { headerName: 'Transactions Count', field: 'TransactionsCount', width: 190 },
      { headerName: 'Revenue ($)', field: 'RevenueinDollar', width: 190 },
      { headerName: 'isAbsent', field: 'isAbsent', width: 190 },
      { headerName: 'Absent (%)', field: 'AbsentPer', width: 190 },
      { headerName: 'isLate', field: 'isLate', width: 190 },
      { headerName: 'isLeftEarly', field: 'isLeftEarly', width: 190 },
      { headerName: 'Chat Assigned Count', field: 'CAssignedCount', width: 190 },
      { headerName: 'Chat Resolved Count', field: 'CResolvedCount', width: 190 },
      { headerName: 'Chat Message Sent', field: 'CMessageSent', width: 190 },
      { headerName: 'Chat Resolution Time(HH:MM:SS)', field: 'CResolutionTime', width: 230 },
      { headerName: 'Chat AvgResolution Time(HH:MM:SS)', field: 'AvgResolutionTime', width: 270 },
      { headerName: 'Chat Response Time(HH:MM:SS)', field: 'CResponseTime', width: 230 },
      { headerName: 'Chat AvgResponse Time(HH:MM:SS)', field: 'AvgResponseTime', width: 230 },
      { headerName: 'Chat First Reponse Time(HH:MM:SS)', field: 'CFirstReponseTime', width: 280 },
      { headerName: 'Chat AvgFirstReponse Time(HH:MM:SS)', field: 'AvgFirstReponseTime', width: 330 },
      // { headerName: 'Twitter Ticket Assigned', field: 'TTicketAssigned', width: 190 },
      // { headerName: 'Twitter Ticket Resolved', field: 'TTicketResolved', width: 190 },
      // { headerName: 'Twitter Ticket Reopened', field: 'TTicketReopened', width: 190 },
      // { headerName: 'Twitter Ticket Reassigned', field: 'TTicketReassigned', width: 190 },
      // { headerName: 'Twitter Private Notes', field: 'TPrivateNotes', width: 190 },
      // { headerName: 'Twitter Response', field: 'TResponse', width: 190 },
      { headerName: 'Outbound Call (%)', field: 'OutBoundCallPer', width: 190 },
      { headerName: 'OnceandDone Calls', field: 'OnceandDoneCalls', width: 220 },
      { headerName: 'Potential OnceandDone Calls', field: 'PotentialOnceandDoneCalls', width: 280 },
      { headerName: 'OnceandDone Calls (%)', field: 'OnceandDoneCallsPer', width: 220 },
      { headerName: 'Total Interactions', field: 'TotalInteractions', width: 220 },
      { headerName: 'FDTicket Counts', field: 'FDTicketCounts', width: 190 },
      { headerName: 'MISCTicket Counts', field: 'MISCTicketCounts', width: 220 },
      { headerName: 'Contacts Log', field: 'ContactsLog', width: 190 },
      { headerName: 'Contacts (%)', field: 'ContactsPer', width: 190 },
       
    ];
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
 
  getReportData() {
    
    console.log('Supervisor Info Rrports Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      this.agentreportinputReq = {
        repStartDate: this.reportRange.startDate, repEndDate: this.reportRange.endDate, RoleID:this.RoleID, type:this.reportType, orderBy:this.reportOrderBy,callcenter:''
      }
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      //
      this.agentData = this.auth.GetSupervisorInfoReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {               
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Supervisor Info Rrports Data Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }
 
 


  autoSizeAll() {
    if (this.gridColumnApi) {
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
        // console.log('Column Id: '+column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds);
    }
  }

  //Full Scree
  openFullscreen() {
    //alert('openFullscreen');
    this.elem = document.getElementById("angularchart");
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

}

