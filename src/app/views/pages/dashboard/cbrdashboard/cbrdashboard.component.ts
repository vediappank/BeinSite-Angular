import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth';
import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';
import { BehaviorSubject } from 'rxjs';
import { AgentActivityRequest } from '../../reports/_models/agentactivityrequest.model';
import { AgentActivityReportVO } from '../../reports/_models/agent-activity-report-vo.model';
import { FinanceRequest } from '../../reports/_models/financerequest.model';
import { CCDashboardRequest } from '../_models/ccdashboardrequest.model';
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { CCTimeMgtRequest } from '../_models/cctimemgtrequest.model';
import { BRDashboardService } from '../_services/brdashboard.service';

@Component({
  selector: 'kt-cbrdashboard',
  templateUrl: './cbrdashboard.component.html',
  styleUrls: ['./cbrdashboard.component.scss']
})
export class CBRDashboardComponent implements OnInit {

  public userRoleId: any;
  public agentRatioReq: CCDashboardRequest;
  public agentRatioData: any[];
  public testData: string;
  public testEmitter$ = new BehaviorSubject<string>(this.testData);

  public agentActReq: AgentActivityRequest;
  public agentActData: AgentActivityReportVO[];
  public agentActData$ = new BehaviorSubject<AgentActivityReportVO[]>(this.agentActData);

  public quaReptReq: FinanceRequest;
  public quaReptData: any[];
  public quaReptData$ = new BehaviorSubject<any[]>(this.quaReptData);

  public finReptReq: FinanceRequest;
  public finReptData: any[];
  public finReptData$ = new BehaviorSubject<any[]>(this.finReptData);

  public dahboardinputRequest: CCDashboardRequest;
  public timeMgtSummaryList: CCTimeMgtRequest[] = [];
  public timeMgtSummaryList$ = new BehaviorSubject<CCTimeMgtRequest[]>(this.timeMgtSummaryList);

  constructor(private subheaderService: SubheaderService, private layoutService: LayoutConfigService, private auth: AuthService,
              private brdService: BRDashboardService) { }

  ngOnInit() {
    // this.brdService.resetDashboardSubHeader();
    this.subheaderService.setTitle('Test Call Center Dashbaord');
    /*this.layoutService.setConfig( {
      value: {
        content: {
          width: 'fixed',
        }
      }, save: true
    });*/
    if (localStorage.hasOwnProperty('currentUser')) {
      this.userRoleId = JSON.parse(localStorage.getItem('currentUser')).role_id;
    }
    // this.finReptWidgetData = {summary: []};
    // this.finReptWidgetData$.next(this.finReptWidgetData);
  }

  getReportData() {
    this.testData = 'Test Data Request:' + new Date();
    this.testEmitter$.next(this.testData);
    console.log('Dashboard Data Request at  ::::' + this.testData);

    // Agent Acitivty Report
    this.agentRatioReq = {
      repStartDate: '2019-01-01',
      repEndDate: '2020-01-01',
      callcenter: '',
      RoleID: 0
    };
    this.auth.GetCCRatioDashboard(this.agentRatioReq).subscribe( ccRatioList => {
      // console.log('Agent Ratio Report Response ::::' + JSON.stringify(ccRatioList));
      if (ccRatioList) {
        this.agentRatioData = [];
        ccRatioList.forEach((valObj: CCRatioDashboardModel, index) => {
          this.agentRatioData.push({
            icon: 'flaticon-pie-chart-1 kt-font-info',
            title: valObj.RoleName + '\nExpected: ' + valObj.ExpectedCount
              + '   Deviation: ' + valObj.DeviationCount + '   Ratio: ' + valObj.ExpectedRatio,
            actValue: valObj.ActualCount,
            devValue: valObj.DeviationCount,
            extValue: valObj.ExpectedCount,
            extRatio: valObj.ExpectedRatio,
            valueColor: valObj.DeviationCount < 0 ?  'kt-font-danger' : 'kt-font-success'
          });
        });
        // console.log('Agent Ratio Reports Data ::::' + JSON.stringify(this.agentRatioData));
        this.testData = 'Dashboard Data at:' + new Date();
        this.testEmitter$.next(this.testData);
        // console.log('Test Data 2  ::::' + this.testData);
      }
    });

    // Agent Acitivty Report
    this.agentActReq = {
      repStartDate: '2019-01-01',
      repEndDate: '2020-01-01',
      RoleID: this.userRoleId,
      callcenter: ''
    };
    this.auth.GetAgentActivityReport(this.agentActReq).subscribe( activitybarList => {
      // console.log('Agent Activity Reports Data Response Came::::' + JSON.stringify(activitybarList));
      this.agentActData = activitybarList;
      this.agentActData$.next(this.agentActData);
      console.log('Agent Activity Reports Data Response::::' + JSON.stringify(this.agentActData));
    });

    // Quality Report
    this.quaReptReq = {
      repStartDate: '2019-11-01',
      repEndDate: '2020-01-01',
      RoleID: this.userRoleId,
      callcenter: '',
      dayorweek:'daily'
    };
    this.auth.GetQualityReport(this.quaReptReq).subscribe( qualityList => {
      this.quaReptData = qualityList;
      console.log('Quality Response Called::::' + JSON.stringify(this.quaReptData));
      if (this.quaReptData) {
        this.quaReptData$.next(this.quaReptData);
      }
    });

    // Finance Report
    this.finReptReq = {
      repStartDate: '2019-11-01',
      repEndDate: '2020-01-01',
      RoleID: this.userRoleId,
      callcenter: '',      
      dayorweek:'daily'
    };
    this.auth.GetFinanceReport(this.finReptReq).subscribe( revbarList => {
      this.finReptData = revbarList;
      //console.log('Finance Response Called::::' + JSON.stringify(this.finReptData));
      if (this.finReptData) {
        this.finReptData$.next(this.finReptData);
      }
    });

    // Time Management Summary
    this.dahboardinputRequest = {
      repStartDate: '2019-11-01',
      repEndDate: '2020-01-01',
      RoleID: this.userRoleId,
      callcenter: ''
    }
    this.auth.GetCallCenterTimeMgtSummary(this.dahboardinputRequest).subscribe(ccRatioList => {
      console.log('Agent Ratio Report Response ::::' + JSON.stringify(ccRatioList));
      if (ccRatioList) {
        this.timeMgtSummaryList = ccRatioList;
        this.timeMgtSummaryList$.next(this.timeMgtSummaryList);
        console.log('Time Management Reports Data ::::' + JSON.stringify(this.timeMgtSummaryList));
      }
    });

  }

  testCallEvent(activityBarSelected: string): void {
    console.log('Selected Chart Bar: ' , activityBarSelected);
  }

}

function currencyFormatter(param) {
  console.log('Curency formatter: ' + param);
  return '$' + formatNumber(param);
}
function formatNumber(val) {
  if ( val ) {
    return val.toLocaleString( undefined, { minimumFractionDigits: 0 } );
  }
  // return Math.floor(val).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
