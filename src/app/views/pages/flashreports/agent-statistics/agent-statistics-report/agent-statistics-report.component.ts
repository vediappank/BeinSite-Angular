import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { AgentService } from '../../_services/agent.service';
import { AgentStatisticsRequest } from '../../model/agent-statistics-request.model';
import { SecondsToTimeComponent } from '../../helper-classes/ag-grid/cell-renderers/seconds-to-time.component';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { TrueFalseComponent } from '../../helper-classes/ag-grid/cell-renderers/true-false.component';
import { PercentageComponent } from '../../helper-classes/ag-grid/cell-renderers/percentage.component';
import { DollarComponent } from '../../helper-classes/ag-grid/cell-renderers/dollar.component';
import { AgentReportActivity } from '../../model/agent-report-activity.model';
import { AdminService } from '../../_services/admin.service';

@ Component({
  selector: 'app-agent-statistics-report',
  templateUrl: './agent-statistics-report.component.html',
  styleUrls: ['./agent-statistics-report.component.scss']
})
export class AgentStatisticsReportComponent implements OnInit, OnDestroy {

  public reportType: string = 'agent';
  public reportRange: any;
  public reportFields: any;
  public reportDataFieldGroups: any = [
    {index: 1, id: 'inbound', name: 'Inbound', icon_url: 'fa-icon fa fa-phone'},
    {index: 2, id: 'dailer', name: 'Dailer', icon_url: 'fa-icon fa fa-book'},
    {index: 3, id: 'outbound', name: 'Manual Outbound', icon_url: 'fa-icon fa fa-phone-alt'},
    {index: 4, id: 'assist', name: 'Assistance', icon_url: 'fa-icon fa fa-phone-alt'},
    {index: 5, id: 'pcs', name: 'Survey', icon_url: 'fa-icon fa fa-poll'},
    {index: 6, id: 'evaluation', name: 'Evaluation', icon_url: 'fa-icon fa fa-binoculars'},
    {index: 7, id: 'quiz', name: 'Quiz', icon_url: 'fa-icon fa fa-file-invoice'},
    {index: 8, id: 'revenue', name: 'Revenue', icon_url: 'fa-icon fa fa-money-bill'},
    {index: 9, id: 'absence', name: 'Schedule Adherence', icon_url: 'fa-icon fa fa-file-signature'},
    {index: 10, id: 'chat', name: 'WhatsApp', icon_url: 'fa-icon fab fa-whatsapp'},
    {index: 11, id: 'twitter', name: 'Twitter', icon_url: 'fa-icon fab fa-twitter'},
    {index: 12, id: 'onceanddone', name: 'OnceAndDone', icon_url: 'fa-icon fa fa-phone'},
    {index: 13, id: 'ticket', name: 'Ticket', icon_url: 'fa-icon fas fa-ticket-alt'}
  ]
  public hideInbound = false; public hideDailer = false; public hideOutbound = false; public hideAssist = false;
  public hideSurvey = false; public hideEvaluation = false; public hideQuiz = false; public hideRevenue = false;
  public hideAdherence = false; public hideWhatsApp = false; public hideTwitter = false; public hideOnceanddone = false;public hideTicket = false;

  private gridApi;
  private gridColumnApi;
  public gridDefaultColDef = { resizable: true, sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: true, enableRowGroup: true, enablePivot: true, };
  public gridOptions: GridOptions;
  public agentData : any;
  public gridSummaryData: any;
  public getGridRowStyle: any;
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

  public agentStatisticsReq : AgentStatisticsRequest;
  public title = 'Agent Statistics';
  public columnDefs: any;
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
  public currentReportType: string; public prevReportType: string;
  public currentReportDTRange: string; public prevReportDTRange: string;
  public currentReportDT: moment.Moment; public prevReportDT: moment.Moment;

  constructor(private agentService: AgentService) {
    this .gridOptions = < GridOptions >{
      context: {
          componentParent: this
      },
      enableColResize: true,
      defaultColDef: this .gridDefaultColDef,
      suppressColumnVirtualisation: true
    };
    this .getGridRowStyle = function (params) {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
    };
    this .selectAllRepFields();
  }

  ngOnInit(): void {
    this .selectAllRepFields();
    this .currentReportDT = this .prevReportDT = moment();
  }

  ngOnDestroy(): void {
    this .logReportActivityToServer('ReportDestroy', 'ReportDestroy');
  }

  onGridReady(params) {
    this .gridApi = params.api;
    this .gridColumnApi = params.columnApi;
  }

  refreshCols() {
    this .columnDefs = [
      {headerName: 'Agent Information', children: [
        {headerName: 'ID', field: 'agentId', pinned: true, valueFormatter: function (params) {
          if(params.value === 0){ return 'Summary' }else{ return params.value} } },
        {headerName: 'First Name', field: 'agentFirstName', pinned: true },
        {headerName: 'Last Name', field: 'agentLastName', pinned: true },
        {headerName: 'Is Sup.', field: 'supervisor', cellRendererFramework: TrueFalseComponent },
        {headerName: 'Supervisor', valueGetter: function (params) {
            if ( params.data && params.data.supervisorId ) {
              return params.data.supervisorLastName + ' ' + params.data.supervisorFirstName;
            } else {
              return 'Operation Manager';
            }
          }
        },
        {headerName: 'Total Interactions', field: 'totalInteractions', cellRendererFramework: TrueFalseComponent }
      ]},
      {headerName: 'Inbound', children: [
        {headerName: 'Answered', field: 'inboundCallsAnswered', hide: this .hideInbound },
        {headerName: 'Handled', field: 'inboundCallsHandled', hide: this .hideInbound },
        {headerName: 'Handled Calls Time', field: 'inboundHandledCallsTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg. Handle Time', field: 'inboundAvgHandleTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Talk Time', field: 'inboundTalkTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Hold Time', field: 'inboundHoldTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Wrap Time', field: 'inboundWrapTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Answer Wait Time', field: 'inboundAnswerWaitTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg Speed Of Answer', field: 'inboundAvgSpeedOfAnswer', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Disconnected Calls', field: 'inboundDisconnectedCalls', hide: this .hideInbound },
        {headerName: 'Hold Calls', field: 'inboundHoldCalls', hide: this .hideInbound },
        {headerName: 'Logged On Time', field: 'inboundLoggedOnTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Available Time', field: 'inboundAvailableTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Available Time %', field: 'inboundAvailableTimePer', hide: this .hideInbound, cellRendererFramework: PercentageComponent },
        {headerName: 'Not Ready Time', field: 'inboundNotReadyTime', hide: this .hideInbound, cellRendererFramework: SecondsToTimeComponent }
      ]},
      {headerName: 'Dailer', children: [
        {headerName: 'Calls', field: 'dailerCalls', hide: this .hideDailer },
        {headerName: 'Handle Time', field: 'dailerHandledCallsTime', hide: this .hideDailer, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg. Handle Time', field: 'dailerAvgHandleTime', hide: this .hideDailer, cellRendererFramework: SecondsToTimeComponent }
      ]},
      {headerName: 'Manual Outbound', children: [
        {headerName: 'Calls', field: 'manualOutCalls', hide: this .hideOutbound },
        {headerName: 'Handle Time', field: 'manualOutHandledCallsTime', hide: this .hideOutbound, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg. Handle Time', field: 'manualOutAvgHandleTime', hide: this .hideOutbound, cellRendererFramework: SecondsToTimeComponent }
      ]},
      {headerName: 'Assistance', children: [
        {headerName: 'Requests', field: 'assistanceRequests', hide: this .hideAssist },
        {headerName: 'Requests %', field: 'assistanceRequestsPer', hide: this .hideAssist, cellRendererFramework: PercentageComponent }
      ]},
      {headerName: 'Survey', children: [
        {headerName: 'Calls', field: 'surveyCalls', hide: this .hideSurvey },
        {headerName: 'FCR', field: 'surveyFCR', hide: this .hideSurvey },
        {headerName: 'CSAT', field: 'surveyCSAT', hide: this .hideSurvey }
      ]},
      {headerName: 'Evaluation', children: [
        {headerName: 'Calls', field: 'evaluationCalls', hide: this .hideEvaluation },
        {headerName: 'Score', field: 'evaluationScore', hide: this .hideEvaluation },
        {headerName: 'Score %', field: 'evaluationScorePer', hide: this .hideEvaluation, cellRendererFramework: PercentageComponent },
        {headerName: 'HQ Calls', field: 'hqevaluationcount', hide: this .hideEvaluation },
        {headerName: 'HQ Score', field: 'hqevaluationscore', hide: this .hideEvaluation },
        {headerName: 'HQ Score %', field: 'hqevaluationscore_per', hide: this .hideEvaluation, cellRendererFramework: PercentageComponent },
        {headerName: 'Local Calls', field: 'localevaluationcount', hide: this .hideEvaluation },
        {headerName: 'Local Score', field: 'localevaluationscore', hide: this .hideEvaluation },
        {headerName: 'Local Score %', field: 'localevaluationscore_per', hide: this .hideEvaluation, cellRendererFramework: PercentageComponent }
      ]},
      {headerName: 'Quiz', children: [
        {headerName: 'Taken', field: 'quizTaken', hide: this .hideQuiz },
        {headerName: 'Score', field: 'quizScore', hide: this .hideQuiz },
        {headerName: 'Score %', field: 'quizScorePer', hide: this .hideQuiz, cellRendererFramework: PercentageComponent }
      ]},
      {headerName: 'Revenue', children: [
        {headerName: 'Transactions', field: 'revenueTransactions', hide: this .hideRevenue },
        {headerName: 'Amount', field: 'revenueAmount', hide: this .hideRevenue, cellRendererFramework: DollarComponent  }
      ]},
      {headerName: 'Schedule Adherence', children: [
        {headerName: 'Absence Days', field: 'adherenceAbsenceDays', hide: this .hideAdherence },
        {headerName: 'Absence %', field: 'adherenceAbsencePer', hide: this .hideAdherence, cellRendererFramework: PercentageComponent },
        {headerName: 'Late Days', field: 'adherenceLateDays', hide: this .hideAdherence },
        {headerName: 'Left Early Days', field: 'adherenceLeftEarlyDays', hide: this .hideAdherence }
      ]},
      {headerName: 'WhatsApp', children: [
        {headerName: 'Assigned', field: 'whatsappAssigned', hide: this .hideWhatsApp },
        {headerName: 'Resolved', field: 'whatsappResolved', hide: this .hideWhatsApp },
        {headerName: 'Messages Sent', field: 'whatsappMessagesSent', hide: this .hideWhatsApp },
        {headerName: 'Resolution Time', field: 'whatsappResolutionTime', hide: this .hideWhatsApp, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg. Resolution Time', field: 'whatsappAvgResolutionTime', hide: this .hideWhatsApp, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Response Time', field: 'whatsappResponseTime', hide: this .hideWhatsApp, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg. Response Time', field: 'whatsappAvgResponseTime', hide: this .hideWhatsApp, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'First Response Time', field: 'whatsappFirstResponseTime', hide: this .hideWhatsApp, cellRendererFramework: SecondsToTimeComponent },
        {headerName: 'Avg. First Response Time', field: 'whatsappAvgFirstResponseTime', hide: this .hideWhatsApp,
          cellRendererFramework: SecondsToTimeComponent }
      ]},
      {headerName: 'Twitter', children: [
        {headerName: 'Assigned', field: 'twitterAssigned', hide: this .hideTwitter },
        {headerName: 'Resolved', field: 'twitterResolved', hide: this .hideTwitter },
        {headerName: 'Reopened', field: 'twitterReopened', hide: this .hideTwitter },
        {headerName: 'Reassigned', field: 'twitterReassigned', hide: this .hideTwitter },
        {headerName: 'Private Notes', field: 'twitterPrivateNotes', hide: this .hideTwitter },
        {headerName: 'Responses', field: 'twitterResponses', hide: this .hideTwitter }
      ]},
      {headerName: 'Once & Done', children: [
        {headerName: 'Once & Done Calls', field: 'onceADoneCalls', hide: this .hideOnceanddone },
        {headerName: 'Once & Done Calls %', field: 'onceADoneCallsPer', hide: this .hideOnceanddone }
      ]},
      {headerName: 'Ticket', children: [
        {headerName: 'Fresh Desk', field: 'ticketFDCount', hide: this .hideTicket },
        {headerName: 'Miscellaneous', field: 'ticketMiscCount', hide: this .hideTicket },
        {headerName: 'Total', field: 'ticketTotalCount', hide: this .hideTicket },
        {headerName: 'Log %', field: 'ticketLogPer', hide: this .hideTicket }
      ]}
    ];
    if( this .gridApi ) {
      this .gridApi.setColumnDefs(this .columnDefs);
    }
  }

  selectAllRepFields() {
    this .reportFields = this .reportDataFieldGroups.map(item => item.id);
    this .onReportFieldSetChange(this .reportDataFieldGroups);
  }

  clearAllRepFields() {
    this .reportFields = [];
    this .onReportFieldSetChange([]);
  }

  onReportFieldSetChange(model) {
    // console.log('onReportFieldSetChange ::'+ model +'::'+typeof model );
    // console.log('onReportFieldSetChange ::'+ JSON.stringify(model, null, 4));
    if (model && Array.isArray(model) ) {
      this .hideInbound = this .hideDailer = this .hideOutbound = this .hideAssist = this .hideSurvey = this .hideEvaluation = true;
      this .hideQuiz = this .hideRevenue = this .hideAdherence = this .hideWhatsApp = this .hideTwitter = this .hideTicket =true;
      model.forEach(element => {
        // console.log('onReportFieldSetChange Ele::'+element);
        switch(element.id) {
          case 'inbound': this .hideInbound = false; break;
          case 'dailer': this .hideDailer = false; break;
          case 'outbound': this .hideOutbound = false; break;
          case 'assist': this .hideAssist = false; break;
          case 'pcs': this .hideSurvey = false; break;
          case 'evaluation': this .hideEvaluation = false; break;
          case 'quiz': this .hideQuiz = false; break;
          case 'revenue': this .hideRevenue = false; break;
          case 'absence': this .hideAdherence = false; break;
          case 'chat': this .hideWhatsApp = false; break;
          case 'twitter': this .hideTwitter = false; break;
          case 'onceanddone': this .hideOnceanddone = false; break;
          case 'ticket': this .hideTicket = false; break;
        }
      });
      this .refreshCols();
      this .autoSizeAll()
    }
  }

  getReportData() {
    console.log('Report Data Function Called');
    if( this .reportRange.startDate && this .reportRange.endDate) {

      this .agentStatisticsReq = {
        reportType: this .reportType, repStartDate: this .reportRange.startDate, repEndDate: this .reportRange.endDate,
        agentId: AdminService.userId+''
      }
      let schDateTime = moment( this .reportRange.startDate );
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      this .agentStatisticsReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment( this .reportRange.endDate );
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      this .agentStatisticsReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      this .logReportActivityToServer(this .reportType, this .agentStatisticsReq.repStartDate + '_'
                                      + this .agentStatisticsReq.repEndDate);
      this .gridSummaryData = this .agentService.getAllAgentSummaryStatistics(this .agentStatisticsReq);
      this .agentData = this .agentService.getAllAgentStatistics(this .agentStatisticsReq);
      console.log('gridSummaryData:::'+ JSON.stringify(this.gridSummaryData))
      console.log('agentData:::'+ JSON.stringify(this.agentData))
      this .agentData.subscribe(beinUser => {
        setTimeout(() => {this .autoSizeAll();}, 1000);
        console.log('Report Data Response Called');
      });
    }
  }

  autoSizeAll() {
    if( this .gridColumnApi ) {
      var allColumnIds = [];
      this .gridColumnApi.getAllColumns().forEach( function (column) {
        allColumnIds.push(column.colId);
        // console.log('Column Id: '+column.colId);
      });
      this .gridColumnApi.autoSizeColumns(allColumnIds);
    }
  }

  exportToCSV() {
    var params = {
      fileName: this .reportType + '_' + moment( this .reportRange.startDate ).format('YYYY-MM-DD')
        + '_' + moment( this .reportRange.endDate ).format('YYYY-MM-DD') + '.csv',
      columnSeparator: ',',
      allColumns: false,
      columnKeys: ['agentId', 'agentFirstName', 'agentLastName', 'supervisor', '1', 'totalInteractions']
    };
    if ( ! this .hideInbound ) {
      params.columnKeys = params.columnKeys.concat(['inboundCallsAnswered', 'inboundCallsHandled', 'inboundHandledCallsTime', 'inboundAvgHandleTime', 'inboundTalkTime'
        , 'inboundHoldTime', 'inboundWrapTime', 'inboundAnswerWaitTime', 'inboundAvgSpeedOfAnswer', 'inboundDisconnectedCalls', 'inboundHoldCalls', 'inboundLoggedOnTime', 'inboundAvailableTime', 'inboundAvailableTimePer', 'inboundNotReadyTime']);
    }
    if ( ! this .hideDailer ) {
      params.columnKeys = params.columnKeys.concat(['dailerCalls', 'dailerHandledCallsTime', 'dailerAvgHandleTime']);
    }
    if ( ! this .hideOutbound ) {
      params.columnKeys = params.columnKeys.concat(['manualOutCalls', 'manualOutHandledCallsTime', 'manualOutAvgHandleTime']);
    }
    if ( ! this .hideAssist ) {
      params.columnKeys = params.columnKeys.concat(['assistanceRequests', 'assistanceRequestsPer']);
    }
    if ( ! this .hideSurvey ) {
      params.columnKeys = params.columnKeys.concat(['surveyCalls', 'surveyFCR', 'surveyCSAT']);
    }
    if ( ! this .hideEvaluation ) {
      params.columnKeys = params.columnKeys.concat(['evaluationCalls', 'evaluationScore', 'evaluationScorePer']);
    }
    if ( ! this .hideQuiz ) {
      params.columnKeys = params.columnKeys.concat(['quizTaken', 'quizScore', 'quizScorePer']);
    }
    if ( ! this .hideRevenue ) {
      params.columnKeys = params.columnKeys.concat(['revenueTransactions', 'revenueAmount']);
    }
    if ( ! this .hideAdherence ) {
      params.columnKeys = params.columnKeys.concat(['adherenceAbsenceDays', 'adherenceAbsencePer', 'adherenceLateDays', 'adherenceLeftEarlyDays']);
    }
    if ( ! this .hideWhatsApp ) {
      params.columnKeys = params.columnKeys.concat(['whatsappAssigned', 'whatsappResolved', 'whatsappMessagesSent', 'whatsappResolutionTime', 'whatsappAvgResolutionTime'
        , 'whatsappResponseTime', 'whatsappAvgResponseTime', 'whatsappFirstResponseTime', 'whatsappAvgFirstResponseTime']);
    }
    if ( ! this .hideTwitter ) {
      params.columnKeys = params.columnKeys.concat(['twitterAssigned', 'twitterResolved', 'twitterReopened', 'twitterReassigned', 'twitterPrivateNotes', 'twitterResponses']);
    }
    if ( ! this .hideOnceanddone ) {
      params.columnKeys = params.columnKeys.concat(['onceADoneCalls', 'onceADoneCallsPer']);
    }
    if ( ! this .hideTicket ) {
      params.columnKeys = params.columnKeys.concat(['ticketFDCount', 'ticketMiscCount', 'ticketTotalCount', 'ticketLogPer']);
    }
    this .gridApi.exportDataAsCsv(params);
  }

  logReportActivityToServer(newRepType: string, newRepDTRange: string){
    this .prevReportType = this .currentReportType;
    this .currentReportType = newRepType;
    this .prevReportDTRange = this .currentReportDTRange;
    this .currentReportDTRange = newRepDTRange;
    this .prevReportDT = this .currentReportDT;
    this .currentReportDT = moment();
    console.log('User '+AdminService.userId +' Stayed in ' + this .prevReportType + ' with Date Range ' +
      this .prevReportDTRange + ' for Milliseconds: ' + (this .currentReportDT.diff(this .prevReportDT) ) );

    if(this .prevReportType){
      const req: AgentReportActivity = {
        agentId: AdminService.userId + '', repName: 'Agent Statistics',
        repDateRange: this .prevReportDTRange, repCat: this .prevReportType, repSCat: null,
        repActStDt: this .prevReportDT.format('YYYY-MM-DDTHH:mm:ss')+'Z',
        repActEdDt: this .currentReportDT.format('YYYY-MM-DDTHH:mm:ss')+'Z'
      }
      this .agentService.addAgentReportActivity(req).subscribe(data => console.log('Add Report Activity Response:'+data));
    }
  }
}
