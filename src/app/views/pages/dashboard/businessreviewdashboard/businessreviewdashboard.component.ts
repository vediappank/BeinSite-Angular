import { Component, OnInit, Inject, ChangeDetectionStrategy, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { CCRatioDashboardRequest } from '../../../../core/auth/_models/ccratiodashboardrequest.model';
import { AgentActivityRequest } from '../../reports/_models/agentactivityrequest.model';
import { QualityRequest } from '../../reports/_models/qualityrequest.model';
import { CCAbsentiesRequest } from '../_models/ccabsentiesrequest.model';

import { CCRatioDashboardModel } from '../../../../core/auth/_models/ccratiodashboard.model';
import { CallMetricsRequest } from '../../../../core/auth/_models/callmetricsreports.model';
import { ManualOutboundRequest } from '../../../../core/auth/_models/maualoutboundrequest.model';
import { WhatsUpRequest } from '../../../../core/auth/_models/whatsuprequest.model';
import { FinanceRequest } from '../../../../../app/views/pages/reports/_models/financerequest.model';
import { AuthService } from '../../../../core/auth';

import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';


import { DOCUMENT, JsonPipe } from '@angular/common';
import { keys } from '@amcharts/amcharts4/.internal/core/utils/Object';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';


import { RatioDetailComponent } from '../ratio-detail/ratio-detail.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { MatDialog, MatRadioButton } from '@angular/material';

import { AgentActivityReportVO } from '../../reports/_models/agent-activity-report-vo.model';
import { SupervisorInfoRequest } from '../../reports/_models/SupervisorInfo.model';
import { CCDashboardRequest } from '../_models/ccdashboardrequest.model';
import { InputRequest } from '../_models/inputrequest.model';
import { CCBillingRequest } from '../_models/billing.model';
import { AgentInfoRequest } from '../../reports/_models/agentinforequest.model';
import { ActivityWidgetRequest } from '../_models/activitywidgetrequest.model';
import { BRDashboardService } from '../_services/brdashboard.service';

import { BehaviorSubject } from 'rxjs';
import { CCTimeMgtRequest } from '../_models/cctimemgtrequest.model';
import { CCOutBoundRequest } from '../_models/ccoutboundrequest.model';
import { CCInboundRequest } from '../_models/ccinboundrequest.model';
import { CCWhatsAppRequest } from '../_models/ccwhatsapprequest.model';
import { CCQualityRequest } from '../_models/ccqualityrequest.model';
import { CCHiringRequest } from '../_models/cchiringrequest.model';

import { CCCUSTEXPRequest } from '../_models/cccustexprequest.model';
import { CCTimeMgtDetailRequest } from '../_models/cctimemgtdetail.model';
import { MatRadioChange } from '@angular/material';
import { DefinePlugin } from 'webpack';

import { BarLineChartWidgetModel } from '../../../partials/content/widgets/_model/bar-line-chart.model';
import { AgentRatioRequest } from '../../../../core/auth/_models/agentratiorequest.model';
import { CCCallMetricsRequest } from '../_models/cccallmetricsrequest.model';

// user activity reports
import {UserActivityRequest} from '../../reports/_models/useractivityrequest.model';
import {UserCCRoleRequest} from '../../reports/_models/userccrolerequest.model';
import {UserOrganizationRequest} from '../../reports/_models/userorganizationrequest.model';
import {UserRoleRequest} from '../../reports/_models/userrolerequest.model';
import {UserSupervisorRequest} from '../../reports/_models/usersupervisorrequest.model';

@Component({
  selector: 'kt-businessreviewdashboard',
  templateUrl: './businessreviewdashboard.component.html',
  styleUrls: ['./businessreviewdashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessreviewdashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  viewLoading: boolean = true;
  ischartSelection: boolean = true;
  // Summary Filter
  qualityselectedMedias: any[];
  qualityduration: string;
  qualitymedias: any[];

  financeselectedMedias: any[];
  financeduration: string;
  financemedias: any[];

  TimeMgtselectedMedias: any[];
  TimeMgtduration: string;
  TimeMgtmedias: any[];

  AbsentiesselectedMedias: any[];
  Absentiesduration: string;
  Absentiesmedias: any[];


  //TimeMgtChartData
  public agtTimeChartData: any;
  public Chart_agtTimemgt_Data: BarLineChartWidgetModel[] = [];


  //Reports Data
  public DateRange: string;
  public DateRangeEmitter$ = new BehaviorSubject<string>(this.DateRange);

  public elem;
  public Charttype: string;
  public agentratioinputReq: AgentRatioRequest;
  public inputReq: InputRequest;
  public inputBillingReq: CCBillingRequest;
  public ActivityinputReq: ActivityWidgetRequest
  public agentactivityinputReq: AgentActivityRequest;
  public agentquallityinputReq: CCQualityRequest;
  public AbsentiesinputReq: CCAbsentiesRequest;
  public dahboardinputRequest: CCDashboardRequest;
  public callmetricsinputRequest: CallMetricsRequest;
  public maualoutboundinputRequest: ManualOutboundRequest;
  public whatupinputRequest: WhatsUpRequest;
  public financeinputRequest: FinanceRequest;
  TimeMgtSummaryList: CCTimeMgtRequest[] = [];
  public ccoutboundrequest: CCOutBoundRequest;
  public ccinboundrequest: CCInboundRequest;
  public ccwhatsapprequest: CCWhatsAppRequest;
  public cccustexprequest: CCCUSTEXPRequest;
  public timeMgtDetailRequest: CCTimeMgtDetailRequest;
  public hiringinputRequest: CCHiringRequest;
  public callmetricinputRequest: CCCallMetricsRequest;

  // User activity reports
  public useractivityrequest: UserActivityRequest;
  public userccrolerequest: UserCCRoleRequest;
  public userorgnaizationrequest: UserOrganizationRequest;
  public userrolerequest: UserRoleRequest;
  public usresupervisorrequest: UserSupervisorRequest;


  public periodTitle = 'Weekly';
  public title = this.periodTitle + 'Business Review Dashboard';

  Dateduration: Array<any> = [];
  DurationCollection: Array<any> = [];
  WCollection: Array<any> = [];
  QCollection: Array<any> = [];
  YCollection: Array<any> = [];
  MCollection: Array<any> = [];
  selectedWeekly: string;
  selectedMonthly: string;
  selectedQueraterly: string;
  selectedYearly: string;

  selectedDurationCollection: Array<any> = [];
  public defaultYear = moment().startOf('year').format('YYYY');
  currentWeek = moment().isoWeek().toString();
  public aInfo: Array<any> = [];


  public agentRatioReq: CCRatioDashboardRequest;
  public agentRatioData: any[];
  public agenttimeMgtSummaryData: any[];
  public supervisorInfo: any[];
  public agentInfo: any;
  public qualityInfo: any;
  public hiringInfo: any;
  public AbsentiesInfo: any;
  public CallMetricsInfo: any;
  public ManualoutBoundInfo: any;
  public WhatsAppInfo: any;
  public financeInfo: any;
  public billingInfo: any;
  public outboundInfo: any;
  public inboundInfo: any;
  public whatsappInfo: any;
  public custexpInfo: any;

  // user activity reports
  public useractivityInfo: any;
  public userccroleInfo: any;
  public userorganizationInfo: any;
  public userroleInfo: any;
  public usersupervisorInfo: any;

  public agentActData: AgentActivityReportVO[];
  public agentActData$ = new BehaviorSubject<AgentActivityReportVO[]>(this.agentActData);
  public businessreviewActData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.agentRatioData);
  public TimeMgtSummaryData$ = new BehaviorSubject<CCTimeMgtRequest[]>(this.agenttimeMgtSummaryData);
  public supervisorInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.supervisorInfo);
  public agentInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.agentInfo);
  public QualityInfoData$ = new BehaviorSubject<any[]>(this.qualityInfo);
  public HiringInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.hiringInfo);
  public AbsentiesInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.AbsentiesInfo);
  public CallMetricsInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.CallMetricsInfo);
  public ManualoutBoundInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.ManualoutBoundInfo);
  public WhatsAppInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.WhatsAppInfo);
  public financeInfoData$ = new BehaviorSubject<CCRatioDashboardModel[]>(this.financeInfo);
  public outboundInfoData$ = new BehaviorSubject<any[]>(this.outboundInfo);
  public inboundInfoData$ = new BehaviorSubject<any[]>(this.inboundInfo);
  public whatsappInfoData$ = new BehaviorSubject<any[]>(this.whatsappInfo);
  public custexpInfoData$ = new BehaviorSubject<any[]>(this.custexpInfo);

// User activity Reports
  public useractivityInfoData$ = new BehaviorSubject<UserActivityRequest[]>(this.useractivityInfo);
  public userccroleInfoData$ = new BehaviorSubject<UserCCRoleRequest[]>(this.userccroleInfo);
  public userroleInfoData$ = new BehaviorSubject<UserRoleRequest[]>(this.userroleInfo);
  public userorganizationInfoData$ = new BehaviorSubject<UserOrganizationRequest[]>(this.userorganizationInfo);
  public usersupervisorInfoData$ = new BehaviorSubject<UserSupervisorRequest[]>(this.usersupervisorInfo);


  public BillingInfoData$ = new BehaviorSubject<any[]>(this.billingInfo);

  public quaReptReq: FinanceRequest;
  public quaReptData: any[];
  public quaReptData$ = new BehaviorSubject<any[]>(this.quaReptData);

  public userid:Number;
  public RoleID: number;
  public defaultDuration = 'MBR';
  public agentData: CCRatioDashboardModel[];
  public CCRatioDashboardList: Array<any>[];
  public chartTheme: string;

  public StartDate: string;
  public EndDate: string;
  public CallCenter: string;


  //financechart 
  public finReptReq: FinanceRequest;
  public finReptData: any[];
  public finReptData$ = new BehaviorSubject<any[]>(this.finReptData);

  //popupdata
  public qualitypopupData: any[];
  message: string;

  //
  dashbaordModuleCollection: Array<any> = [];
  dashbaordassignedModuleCollection: Array<any> = [];

  constructor(private auth: AuthService, @Inject(DOCUMENT) private document: any, private activatedRoute: ActivatedRoute,
    private router: Router, private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog, private brdService: BRDashboardService) {
    console.log('Cons Dash oninit');
  }
  public selctedCallCenter: string;

  public selctedBusinessListRange: string = 'WBR';
  public CallCenterList: any[] = [];
  public cCenterList: any[];
  public year: string = moment().format('YYYY');
  public BusinessListRange = [
    {
      id: 'WBR',
      name: 'WBR',
    }, {
      id: 'MBR',
      name: 'MBR',
    },
    {
      id: 'QBR',
      name: 'QBR',
    }
    ,
    {
      id: 'YBR',
      name: 'YBR',
    }
  ];

  ngOnInit() {
    try {
      console.log('Dash oninit');
      this.viewLoading = false;
      this.selectedWeekly = 'Week' + moment().week() + '-' + this.defaultYear;
      this.selectedMonthly = moment().format('MMMM') + '-' + this.defaultYear;;
      this.selectedYearly = this.defaultYear;
      this.selectedQueraterly = 'Quarter' + moment().quarter() + '-' + this.defaultYear;
      this.title = 'Business Review Dashboard';

      this.subheaderService.setTitle('Call Center Dashbaord');
      this.elem = document.documentElement;
      if (!this.chartTheme || this.chartTheme === '') {
        this.chartTheme = 'bein-theme';
      }

      this.getCallcenter();
      this.getYear();
      this.onChangeDuration();

      this.qualitymedias = ['Inbound', 'Outbound', 'WhatsApp'];
      this.financemedias = ['Inbound', 'Outbound', 'WhatsApp'];
      this.TimeMgtmedias = ['Inbound', 'Outbound', 'WhatsApp'];
      this.Absentiesmedias = ['Inbound', 'Outbound', 'WhatsApp'];
      this.qualityselectedMedias = ['Inbound', 'Outbound', 'WhatsApp'];
      // this.financeselectedMedias=['Inbound', 'Outbound', 'WhatsApp' ];
      this.TimeMgtselectedMedias = ['Inbound', 'Outbound', 'WhatsApp'];
      this.AbsentiesselectedMedias = ['Inbound', 'Outbound', 'WhatsApp'];
      this.qualityduration = 'Weekly';
      this.financeduration = 'Weekly';
      this.TimeMgtduration = 'Weekly';
      this.Absentiesduration = 'Weekly';
      this.Charttype = "Bar";
      this.onsubmit();
    }
    catch (ex) {
      console.log('Exception:::::' + ex);
    }
  }


  onChangeDuration() {
    this.DurationCollection = [];
    this.WCollection = [];
    this.QCollection = [];
    this.MCollection = [];
    this.YCollection = [];
    var m = moment(this.defaultYear);
    if (this.defaultDuration == 'WBR') {
      this.periodTitle = 'Weekly';
      for (var i = 1; i <= 53; i++) {
        let CurrentDate: any;
        CurrentDate = getDateRangeOfWeek(i, this.defaultYear);
        this.DurationCollection.push({ startDate: CurrentDate[0], endDate: CurrentDate[1], Duration: 'Week' + i + '-' + this.defaultYear });
        this.WCollection.push('Week' + i + '-' + this.defaultYear);
      }
      console.log('getweeks::::' + JSON.stringify(this.DurationCollection));
    }
    else if (this.defaultDuration == 'MBR') {
      this.viewLoading = false;
      this.periodTitle = 'Monthly';
      for (var i = 0; i < 12; i++) {
        let startDate = moment(m.months(i).toString()).format('YYYY-MM-DD');
        let endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        this.DurationCollection.push({ startDate: startDate, endDate: endDate, Duration: moment(m.months(i).toString()).format('MMMM-YYYY') });
        this.MCollection.push(moment(m.months(i).toString()).format('MMMM-YYYY'));
      }
      console.log('GetMonths::::' + JSON.stringify(this.DurationCollection));

    } else if (this.defaultDuration == 'QBR') {
      this.periodTitle = 'Quarterly';
      for (var i = 1; i <= 4; i++) {
        let startDate = moment(this.defaultYear).quarter(i).startOf('quarter').format('YYYY-MM-DD');
        let endDate = moment(this.defaultYear).quarter(i).endOf('quarter').format('YYYY-MM-DD');
        this.DurationCollection.push({ startDate: startDate, endDate: endDate, Duration: 'Quarter' + i + '-' + moment(m.months(i).toString()).format('YYYY') });
        this.QCollection.push('Quarter' + i + '-' + moment(m.months(i).toString()).format('YYYY'));
      }
      console.log('GetQuarter::::' + JSON.stringify(this.DurationCollection));

    }
    else if (this.defaultDuration == 'YBR') {
      this.periodTitle = 'Yearly';
      let arrayList: any[] = [2, 1, 0];
      for (var i = 0; i < arrayList.length; i++) {
        let startDate = moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY-MM-DD');
        let endDate = moment().subtract(arrayList[i], 'years').endOf('year').format('YYYY-MM-DD');
        this.DurationCollection.push({ startDate: startDate, endDate: endDate, Duration: moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY') });
        this.YCollection.push(moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY'));
      }
      //console.log('GetYears::::' + JSON.stringify(this.DurationCollection));

    }
    this.title = this.periodTitle + ' Business Review Dashboard'
    return this.DurationCollection;
  }

  getCallcenter() {
    debugger;
    if (localStorage.hasOwnProperty("CallCenterCollection")) {
      this.cCenterList = JSON.parse(localStorage.getItem('CallCenterCollection'));
    }
    if (localStorage.hasOwnProperty("currentUser")) {
      this.selctedCallCenter = JSON.parse(localStorage.getItem('currentUser')).callcenter;
      if (this.selctedCallCenter == 'Head Quarters' || this.selctedCallCenter == 'Mannai') {
        this.CallCenterList = this.cCenterList;
        this.CallCenterList.push({ cc_id: 'ALL', cc_name: 'ALL', description: 'ALL', cc_shortname: 'ALL' });
        this.selctedCallCenter = 'ALL';
      }
      else {
        debugger
        this.CallCenterList = this.cCenterList.filter(row => row.cc_name == this.selctedCallCenter);
        this.selctedCallCenter = this.CallCenterList[0].cc_shortname;
      }

    }
  }


  getYear() {
    let arrayList: any[] = [2, 1, 0];
    for (var i = 0; i < arrayList.length; i++) {
      let startDate = moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY-MM-DD');
      let endDate = moment().subtract(arrayList[i], 'years').endOf('year').format('YYYY-MM-DD');
      this.Dateduration.push({ startDate: startDate, endDate: endDate, Duration: moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY') });
    }
    console.log('GetYears::::' + JSON.stringify(this.Dateduration));
    return this.Dateduration;
  }



  ngAfterViewInit(): void {
    this.brdService.setDashboardSubHeader();
  }

  ngOnDestroy(): void {
    this.brdService.resetDashboardSubHeader();
  }

  onsubmit() {
    if (this.defaultDuration === 'WBR') {
      this.selectedDurationCollection = this.DurationCollection.find(x => x.Duration === this.selectedWeekly);
    } else if (this.defaultDuration === 'MBR') {
      this.selectedDurationCollection = this.DurationCollection.find(x => x.Duration === this.selectedMonthly);

      if (this.selectedDurationCollection == undefined) {
        alert('Please Select Month');
        return;
      }

    } else if (this.defaultDuration === 'QBR') {
      this.selectedDurationCollection = this.DurationCollection.find(x => x.Duration === this.selectedQueraterly);
    } else if (this.defaultDuration === 'YBR') {
      this.selectedDurationCollection = this.DurationCollection.find(x => x.Duration === this.selectedYearly);
    }

    console.log('inputReq to reorts: ' + JSON.stringify(this.inputReq));
    // var startDate = moment(this.selectedDurationCollection['startDate'], "YYYY-MM-DD").format("YYYY-MM-DD");
    // alert(JSON.stringify(this.selectedDurationCollection))
    // alert(startDate);
    // let schDateTime = moment(new Date(this.selectedDurationCollection['startDate']),'YYYY-MM-DD');
    // console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
    // this.StartDate = schDateTime.format('YYYY-MM-DD');
    // schDateTime = moment(this.selectedDurationCollection['endDate'],'YYYY-MM-DD');
    // console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));

    this.StartDate = this.selectedDurationCollection['startDate'];
    this.EndDate = this.selectedDurationCollection['endDate'];

    if (localStorage.hasOwnProperty('currentUser')) {
      this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      this.userid = JSON.parse(localStorage.getItem('currentUser')).userid;
    }
    console.log('Agent Ratio Dashboard Data Function Called');
    if (this.selctedCallCenter === 'ALL') {
      this.CallCenter = '';
    } else {
      this.CallCenter = this.selctedCallCenter;
    }
    this.DateRange = 'Dashboard Data Requested From: ' + this.StartDate + ' To ' + this.EndDate;
    this.brdService.setBrdStDT(this.StartDate);
    this.brdService.setBrdEndDT(this.EndDate);


    // this.subheaderService.setTitle('From: ' + this.StartDate + ' To ' + this.EndDate);
    this.DateRangeEmitter$.next(this.DateRange);
    this.getbillabalechart();
    this.GetCustExpPerformanceInfo();
    this.GetInboundPerformanceInfo();
    this.GetWhatsAppPerformanceInfo();
    this.getRatioInfo();
    this.getCCCTimeManagementInfo();
    this.GetActivityInfo();

    //this.getAgentInfo();
    this.getQualityInfo();
    this.getAbsentiesInfo();
    // this.getCallMetricsInfo();
    this.getManualOutboundInfo();
    // this.getWhatsAppInfo();
    this.getFinanceInfo();
    // this.getfinanceReportChart();    
    this.GetOutboundPerformanceInfo();
    this.getHiringInfo();
    this.getCallMetricsInfo();
    //    this.GetQualityPopupInfo();
    this.inputReq = {
      repStartDate: this.StartDate, repEndDate: this.EndDate,
      RoleID: this.RoleID, callcenter: this.CallCenter, dayorweek: this.qualityduration, medialist: this.qualityselectedMedias
    }

    this.agentratioinputReq = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter
    }

    this.ActivityinputReq = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, ActivityID: ''
    }
    this.AbsentiesinputReq = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent', dayorweek: this.Absentiesduration
    }

    this.timeMgtDetailRequest = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, aux_code: '', GroupBy: 'Agent'
    }
    this.ccinboundrequest = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
    }
    this.ccoutboundrequest = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
    }
    this.ccwhatsapprequest = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
    }
    this.cccustexprequest = {
      repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
    }

    // User Activity Reports
    this.useractivityrequest = {
      RoleID: this.RoleID, callcenter: this.CallCenter
    }

    this.userccrolerequest = {
      RoleID: this.RoleID, callcenter: this.CallCenter
    }
    this.userorgnaizationrequest = {
      RoleID: this.RoleID, callcenter: this.CallCenter
    }
    this.userrolerequest = {
      RoleID: this.RoleID, callcenter: this.CallCenter
    }
    this.usresupervisorrequest = {
      RoleID: this.RoleID, callcenter: this.CallCenter
    }


    this.financeinputRequest = {
      repStartDate: this.StartDate, repEndDate: this.EndDate,
      RoleID: this.RoleID, callcenter: this.CallCenter, dayorweek: this.financeduration
    }
    this.agentquallityinputReq = {
      repStartDate: this.StartDate, repEndDate: this.EndDate,
      RoleID: this.RoleID, callcenter: this.CallCenter, dayorweek: this.qualityduration, medialist: this.qualityselectedMedias, GroupBy: 'Agent'
    }
  }

  getAllDashboardModules(modulename: string): boolean {
    // if (this.dashbaordModuleCollection.length == 0) {
    let EnableStatus: any;
    if (localStorage.hasOwnProperty("modulePermission")) {
      this.dashbaordModuleCollection = JSON.parse(localStorage.getItem('modulePermission'));
    }
    if (modulename != '')
      EnableStatus = this.dashbaordModuleCollection.filter(x => x.ModuleName.toString() == modulename.toString()).map(x => x.Checked);
    if (EnableStatus[0] == true)
      return true;
    else
      return false;
    // }
  }

  getRatioInfo() {
    if (this.getAllDashboardModules('Man Power Ratio Summary')) {
      console.log('Agent Ratio Dashboard Data Function Called');

      this.dahboardinputRequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter
      }
      this.auth.GetCCRatioDashboard(this.dahboardinputRequest).subscribe(ccRatioList => {
        console.log('Agent Ratio Report Response ::::' + JSON.stringify(ccRatioList));

        if (ccRatioList) {
          this.agentRatioData = [];
          ccRatioList.forEach((valObj: CCRatioDashboardModel, index) => {
            let color: string;
            if (valObj.ActualCount < valObj.ExpectedCount)
              color = 'kt-font-danger';
            if (valObj.ActualCount > valObj.ExpectedCount)
              color = 'kt-font-success';
            if (valObj.ActualCount == valObj.ExpectedCount)
              color = 'kt-font-info';

            // Expected & Deviation Restricted for Agent 
            let title: any;
            if (index == 0)
              title = valObj.RoleName
            else
              title = valObj.RoleName + '\nExpected: ' + valObj.ExpectedCount + '  Deviation: ' + valObj.DeviationCount


            this.agentRatioData.push({
              icon: 'flaticon-pie-chart-1 kt-font-info',
              title: title,
              actValue: valObj.ActualCount,
              devValue: valObj.DeviationCount,
              extValue: valObj.ExpectedCount,
              extRatio: valObj.ExpectedRatio,
              RoleID: valObj.RoleID,
              RoleName: valObj.RoleName,
              valueColor: color
            });
          });
          this.businessreviewActData$.next(this.agentRatioData);
          console.log('Agent Ratio Reports Data ::::' + JSON.stringify(this.agentRatioData));
        }
        else {
          this.agentRatioData = [];
          this.agentRatioData.push({
            icon: 'flaticon-pie-chart-1 kt-font-info',
            title: 'No Record found',
            actValue: 0,
            devValue: 0,
            extValue: 0,
            extRatio: 0,
            RoleID: 0,
            RoleName: 0,
            valueColor: 'kt-font-danger'
          });
          this.businessreviewActData$.next(this.agentRatioData);
        }
      });
    }
  }

  GetActivityInfo() {
    if (this.getAllDashboardModules('Agent Activities Summary')) {
      this.agentactivityinputReq = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter
      }
      this.auth.GetAgentActivityReport(this.agentactivityinputReq).subscribe(activitybarList => {
        console.log('Agent Activity Reports Data Response Came::::' + JSON.stringify(activitybarList));
        this.agentActData = activitybarList;
        this.agentActData$.next(this.agentActData);
        console.log('Agent Activity Reports Data Response::::' + JSON.stringify(this.agentActData));
      });
    }
  }

  getQualityInfo() {   
    if (this.getAllDashboardModules('Quality Summary')) {
      this.agentquallityinputReq = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, dayorweek: this.qualityduration, medialist: this.qualityselectedMedias, GroupBy: 'Agent'
      }
      this.auth.GetQualityReport(this.agentquallityinputReq).subscribe(_qualitybarList => {
        console.log('getQualityInfo Reports Data Response Came::::' + JSON.stringify(_qualitybarList));
        this.qualityInfo = _qualitybarList;
        this.QualityInfoData$.next(this.qualityInfo);
        this.quaReptData = _qualitybarList;
        if (this.quaReptData) {
          this.quaReptData$.next(this.quaReptData);
        }
        console.log('getQualityInfo Data Response Called::::' + JSON.stringify(_qualitybarList));
      });

      // this.auth.GetQualityReport(this.agentquallityinputReq).subscribe( qualityList => {
      //   this.quaReptData = qualityList;
      //   console.log('Quality Response Called::::' + JSON.stringify(this.quaReptData));
      //   if (this.quaReptData) {
      //     this.quaReptData$.next(this.quaReptData);
      //   }
      // });
    }
  }

  getFinanceInfo() {
    if (this.getAllDashboardModules('Finance Summary')) {
      this.financeinputRequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, dayorweek: this.financeduration
      }

      this.auth.GetFinanceReport(this.financeinputRequest).subscribe(revbarList => {
        this.finReptData = revbarList;

        console.log('getfinanceReportChart Response Called::::' + JSON.stringify(this.finReptData));
        if (this.finReptData) {
          this.finReptData$.next(this.finReptData);
        }
      });
    }
  }



  displayedColumns = ['AuxCode', 'TotalDuration', 'AuxPer', 'AvgDuration'];
  getCCCTimeManagementInfo() {
    if (this.getAllDashboardModules('Agent Time Managment Summary')) {
      this.dahboardinputRequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter
      }
      this.auth.GetCallCenterTimeMgtSummary(this.dahboardinputRequest).subscribe(ccRatioList => {
        console.log('GetCallCenterTimeMgtSummary Report Response ::::' + JSON.stringify(ccRatioList));
        if (ccRatioList) {
          this.TimeMgtSummaryList = ccRatioList;
          this.TimeMgtSummaryData$.next(ccRatioList);
          console.log('CC Time Management Reports Data ::::' + JSON.stringify(ccRatioList));

          //This is For Chart Information
          this.agtTimeChartData = this.TimeMgtSummaryList.filter(x => x.AuxCode != 'Logged On');;
          this.Chart_agtTimemgt_Data = [];

          for (let i = 0; i < this.agtTimeChartData.length; i++) {
            this.Chart_agtTimemgt_Data.push({
              CategoryColumn: this.agtTimeChartData[i].AuxCode,
              ValueCoulmn: this.agtTimeChartData[i].AvgDuration,
              LineCoulmn: this.agtTimeChartData[i].AuxPer,
              FromDate: '',
              ToDate: '',
              Date: '',
              ParentModuleName: 'AgentTimeMgt',
              ToolTipHeader: '',
              BarOverValue1: '',
              BarOverValue2: ''
            })
          }
          console.log('Agt-time-mgt Widget Chart Data Changes in popup::::' + JSON.stringify(this.Chart_agtTimemgt_Data));
        }
      });
    }
  }

  getbillabalechart() {
    if (this.getAllDashboardModules('Billable Non Billable Summary')) {
      console.log('getbillabalechart Rrports Data Function Called');
      this.inputBillingReq = {
        repStartDate: this.StartDate, repEndDate: this.EndDate, RoleID: this.RoleID, callcenter: this.CallCenter
      }
      this.auth.GetBillingChartReport(this.inputBillingReq).subscribe(_ratiobarList => {
        console.log('getbillabalechart Reports Data Response Came::::' + JSON.stringify(_ratiobarList));
        this.billingInfo = _ratiobarList;
        this.BillingInfoData$.next(this.billingInfo);
        console.log('getbillabalechart Rrports Data Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
  }

  GetInboundPerformanceInfo() {
    if (this.getAllDashboardModules('Inbound Performance Summary')) {
      this.ccinboundrequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: "Agent"
      }
      this.auth.GetCCInboundSummaryReport(this.ccinboundrequest).subscribe(inboundList => {
        this.inboundInfo = inboundList;
        this.inboundInfoData$.next(this.inboundInfo);
        console.log('GetCCInboundSummaryReport Response info::::' + JSON.stringify(this.inboundInfo));
      });
    }
  }

  getManualOutboundInfo() {
    if (this.getAllDashboardModules('OutBound Performance Summary')) {
      this.maualoutboundinputRequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter
      }
      this.auth.GetManulOutboundReport(this.maualoutboundinputRequest).subscribe(_ouboundbarList => {
        this.ManualoutBoundInfo = _ouboundbarList;
        this.ManualoutBoundInfoData$.next(this.ManualoutBoundInfo);
        console.log('Manual Outbound Calls Response Called::::' + JSON.stringify(_ouboundbarList));
      });
    }
  }

  GetOutboundPerformanceInfo() {
    if (this.getAllDashboardModules('Inbound Performance Summary')) {
      this.ccoutboundrequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
      }
      this.auth.GetCCOutboundSummaryReport(this.ccoutboundrequest).subscribe(outboundList => {
        this.outboundInfo = outboundList;
        this.outboundInfoData$.next(this.outboundInfo);
        console.log('GetCCOutboundSummaryReport Response info::::' + JSON.stringify(this.outboundInfo));
      });
    }
  }

  GetWhatsAppPerformanceInfo() {
    if (this.getAllDashboardModules('WhatsApp Performance Summary')) {
      this.ccwhatsapprequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
      }
      this.auth.GetCCWhatsAppSummaryReport(this.ccwhatsapprequest).subscribe(whatsappList => {
        this.whatsappInfo = whatsappList;
        this.whatsappInfoData$.next(this.whatsappInfo);
        console.log('GetWhatsAppPerformanceInfo Response info::::' + JSON.stringify(this.whatsappInfo));
      });
    }
  }

  GetCustExpPerformanceInfo() {
    if (this.getAllDashboardModules('Customer Exprience Performance Summary')) {
      this.cccustexprequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, GroupBy: 'Agent'
      }
      this.auth.GetCCCustExpSummaryReport(this.cccustexprequest).subscribe(whatsappList => {
        this.custexpInfo = whatsappList;
        this.custexpInfoData$.next(this.custexpInfo);
        console.log('GetCustExpPerformanceInfo Response info::::' + JSON.stringify(this.custexpInfo));
      });
    }
  }

  getAbsentiesInfo() {
    if (this.getAllDashboardModules('Absenties Summary')) {
      console.log('Absenties Calls Data Function Called');
      this.AbsentiesinputReq = {
        repStartDate: this.StartDate, repEndDate: this.EndDate,
        RoleID: this.RoleID, callcenter: this.CallCenter, dayorweek: this.Absentiesduration, GroupBy: 'Agent'
      }
      this.auth.GetAbsentiesChartReport(this.AbsentiesinputReq).subscribe(_absentiesbarList => {
        console.log('Absenties Reports Data Response Came::::' + JSON.stringify(_absentiesbarList));
        this.AbsentiesInfo = _absentiesbarList;
        this.AbsentiesInfoData$.next(this.AbsentiesInfo);
        console.log('Absenties Calls Response Called::::' + JSON.stringify(_absentiesbarList));
      });
    }
  }

  getHiringInfo() {
    if (this.getAllDashboardModules('Agent Hiring Performance')) {
      this.hiringinputRequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate, callcenter: this.CallCenter
      }
      this.auth.GetCCHiringSummary(this.hiringinputRequest).subscribe(_hiringbarList => {
        console.log('getHiringInfo Reports Data Response Came::::' + JSON.stringify(_hiringbarList));
        this.hiringInfo = _hiringbarList;
        this.HiringInfoData$.next(this.hiringInfo);
        console.log('getHiringInfo Data Response Called::::' + JSON.stringify(_hiringbarList));
      });
    }
  }

  getCallMetricsInfo() {
    if (this.getAllDashboardModules('Call Metrics Summary')) {
      this.callmetricinputRequest = {
        repStartDate: this.StartDate, repEndDate: this.EndDate, callcenter: this.CallCenter
      }
      this.auth.GetCCCallMetricssummary(this.callmetricinputRequest).subscribe(_callmetricsList => {
        console.log('GetCCCallMetricssummary Reports Data Response Came::::' + JSON.stringify(_callmetricsList));
        this.CallMetricsInfo = _callmetricsList;
        this.CallMetricsInfoData$.next(this.CallMetricsInfo);
        console.log('GetCCCallMetricssummary Data Response Called::::' + JSON.stringify(_callmetricsList));
      });
    }
  }

  GetRoleDetails(event, roleid: any, RoleName: string) {
    const dialogRef = this.dialog.open(RatioDetailComponent, { data: { inputs: this.agentratioinputReq, RoleID: roleid, RoleName: RoleName } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  syncQuality() {
    this.getQualityInfo();
  }

  syncFinance() {
    this.getFinanceInfo();
  }

  syncAbsenties() {
    this.getAbsentiesInfo();
  }

  onChange(mrChange: MatRadioChange) {
    let mrButton: MatRadioButton = mrChange.source;
    if (mrButton.value == 'Bar')
      this.ischartSelection = true;
    if (mrButton.value == 'Pie')
      this.ischartSelection = false;
  }
}

function currencyFormatter(params) {
  console.log('Curency formatter: ' + params.value)
  return '$' + formatNumber(params.value);
}
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// Returns the ISO week of the date.
function getWeekNumber(dateVal) {
  var date = new Date(dateVal.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.

  // alert(1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7));
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function getDateRangeOfWeek(weekNo, y) {
  var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
  d1 = new Date('' + y + '');
  numOfdaysPastSinceLastMonday = d1.getDay() - 1;
  d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
  d1.setDate(d1.getDate() + (7 * (weekNo - getWeekNumber(d1))));
  // alert(d1.getWeek());
  rangeIsFrom = (d1.getMonth() + 1) + '-' + (d1.getDate() - 1) + '-' + d1.getFullYear();
  d1.setDate(d1.getDate() + 5);
  rangeIsTo = (d1.getMonth() + 1) + '-' + d1.getDate() + '-' + d1.getFullYear();
  console.log('getDateRangeOfWeek Custom:::' + rangeIsFrom + ' to ' + rangeIsTo);
  //return rangeIsFrom + ' to ' + rangeIsTo;
  return [rangeIsFrom, rangeIsTo];
};


