import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AgentInfoRequest } from '../../../../core/auth/_models/agentinforequest.model'
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import { DOCUMENT } from '@angular/common';
import { keys } from '@amcharts/amcharts4/.internal/core/utils/Object';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { interval, Subscription, BehaviorSubject, timer, Subject, Observable, of } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { resultMemoize } from '@ngrx/store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'kt-outbound-dashboard',
  templateUrl: './outbound-dashboard.component.html',
  styleUrls: ['./outbound-dashboard.component.scss']
})
export class OutboundDashboardComponent implements OnInit {

 
  subscription: Subscription;

  public title = 'Outbound Dashboard';
  public userID: string;
  public OutboundInfo: any[]=[];
  public AgentInfo: any[]=[];
  public SkillGroupInfo: any[]=[];
  public SideBarInfo: any[]=[];
  public DailerInfo: any[]=[];
  public CountryContactInfo: any[]=[];
  public OutboundInfoData$ = new BehaviorSubject<any[]>(this.OutboundInfo);
  public AgentInfoData$ = new BehaviorSubject<any[]>(this.AgentInfo);
  public SkillGroupInfoData$ = new BehaviorSubject<any[]>(this.SkillGroupInfo);
  public SideBarInfoData$ = new BehaviorSubject<any[]>(this.SideBarInfo);
  public DailerInfoData$ = new BehaviorSubject<any[]>(this.DailerInfo);
  public CountryContactInfoData$ = new BehaviorSubject<any[]>(this.CountryContactInfo);


  private gridApi;
  private gridColumnApi;
  public gridDefaultColDef = {
    sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: false, enableRowGroup: false, enablePivot: false,
  };

  public gridOptions: GridOptions;
  public columnDefs: any;
  public gridSummaryData: any;
  public getGridRowStyle: any;

  OutboundInfoColumns: string[] = ['SITE', 'ReserveCalls', 'SuccessCalls', 'SuccessPercentage', 'OtherCalls', 'OtherPercentage', 'ManualOutboundCalls'];
  AgentInfoColumns: string[] = ['agent_name','currentSkillGroupName', 'extension', 'status_name', 'time_in_status', 'reason_code', 'callsHandled', 'callsAbandoned','AHT'];
  SkillGroupColumns: string[] = ['SkillGroup', 'ReserveCalls', 'SuccessCalls', 'SuccessPercentage', 'OtherCalls', 'OtherPercentage', 'ManualOutboundCalls'];
  DailerSummaryColumns: string[] = ['Total','Success','SucessPer','NonSuccess','NonSuccessPer','ErrorCondition2','ErrorConditionPer','InvalidByNetwork7','InvalidByNetworkPer'];
  
  private CountrygridApi;
  public CountrygridDefaultColDef = {
    sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: false, enableRowGroup: false, enablePivot: false,
  };
  CountryContactInfoColumns: string[] = ['CountryName', 'Total', 'Success', 'SuccessPercentage', 'Failure', 'FailurePercentage'];  							

  private AgentgridApi;
  private AgentgridColumnApi;
  public AgentgridDefaultColDef = {
    sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: false, enableRowGroup: false, enablePivot: false,
  };
  private defaultColGroupDef;
  public AgentgridOptions: GridOptions;
  
  public AgentgridSummaryData: any;
  public AgentgetGridRowStyle: any;
  CSQGridHeight: any;


  public CSQData: any;
  public agentData: any;

  public elem;
  //Barchart Variables assign
  public chartTheme: string;
  public chart: any;
  rowHeight: any;
  colResizeDefault: string;
  rowClassRules: { "sick-days-warning": (params: any) => boolean; "sick-days-breach": string; };
  todayDate: Date;
  dateToday: string;
  icons = {filter: ' '  }

  ngOnDestroy() {

  }
  constructor(private auth: AuthService, @Inject(DOCUMENT) private document: any, private activatedRoute: ActivatedRoute,
   private router: Router, private subheaderService: SubheaderService,public datepipe : DatePipe) {



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
        return { "font-weight": "bold", "border-bottom": "1px solid black" };
      }
    };
    this.refreshCols();

    this.AgentgridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      enableColResize: true,
      defaultColDef: this.AgentgridDefaultColDef,
      suppressColumnVirtualisation: true,
      getRowStyle: this.lastRowBorder
    };

    this.refreshAgentCols();
    this.refreshCountryCols();
  }

  ngOnInit() {
    // this.date_time();
    this.subheaderService.setTitle('Outbound Dashbaord');
    this.elem = document.documentElement;
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }

    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.getDailerDetailSummary();
    this.getOutboundData();
    this.getSkillGroupData();
    this.getOutboundAgentData();
    this.getsidewBarInfoData();
    this.getOutboundCountryContactsData();
    if (this.router.url === '/dashboard/outbounddashboard') {
      setInterval(() => {
        this.getDailerDetailSummary();
        this.getsidewBarInfoData();
        this.getOutboundData();
        this.getSkillGroupData();
        this.getOutboundAgentData();
        this.getOutboundCountryContactsData();
      }, 15000);
    }else{
      setInterval(() => {},1000000);
    }
  }



  refreshCols() {
    // this.columnDefs = [
    //   { headerName: 'SITE', width: 100, field: 'SITE', cellStyle: { 'text-align': 'left', 'font-weight': 'bold', 'background-color': '#000', 'color': 'white', 'font-size': '18px' }, cellClass: 'noborder' },
    //   { headerName: 'Reserve Calls', field: 'ReserveCalls', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' }, cellClass: 'noborder' },
    //   { headerName: 'Success Calls', field: 'SuccessCalls', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' }, cellClass: 'noborder' },//cellStyle: params => this.getcallswaitingcolor(params.value) },
    //   { headerName: 'Success %', field: 'SuccessPercentage', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
    //   { headerName: 'Other Calls', field: 'OtherCalls', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
    //   { headerName: 'Other %', field: 'OtherPercentage', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
    //   { headerName: 'Manual Outbound Calls', field: 'ManualOutboundCalls', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
    // ];
    
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.OutboundInfoColumns);
      }

  }

  refreshAgentCols() {
    if (this.AgentgridApi) {
      this.AgentgridApi.setColumnDefs(this.AgentInfoColumns);
    }
  }

  refreshCountryCols(){
    if (this.CountrygridApi) {
      this.CountrygridApi.setColumnDefs(this.CountryContactInfoColumns);
    }
  }

  

  getcallswaitingcolor(value: any) {
    if (value < 6)
      return { 'font-weight': 'bold', 'color': "#00ff42", 'font-size': '18px', 'background-color': '#000' };
    else if (value >= 6 && value < 11)
      return { 'font-weight': 'bold', 'color': "#eab71e", 'font-size': '18px', 'background-color': '#000' };
    else
      return { 'font-weight': 'bold', 'color': "#f64e57", 'font-size': '18px', 'background-color': '#000' };
  }

  getcallsansweredcolor(value: string) {
    if (Number(value.split('%')[0]) >= 95)
      return { 'font-weight': 'bold', 'color': "#00ff42", 'font-size': '18px', 'background-color': '#000' };
    else if (Number(value.split('%')[0]) >= 90 && Number(value.split('%')[0]) < 95)
      return { 'font-weight': 'bold', 'color': "#eab71e", 'font-size': '18px', 'background-color': '#000' };
    else
      return { 'font-weight': 'bold', 'color': "#f64e57", 'font-size': '18px', 'background-color': '#000' };
  }

  getreasoncodecolor(value: string) {
    if (value == 'Ready')
      return { 'font-weight': 'bold', 'color': "#00ff42"}//, 'background-color': 'rgb(43, 41, 41)' }
    else if (value == 'Talking')
      return { 'font-weight': 'bold', 'color': "#F5A623"}//, 'background-color': 'rgb(43, 41, 41)' }
    else
      return { 'font-weight': 'bold', 'color': "#f64e57"}//, 'background-color': 'rgb(43, 41, 41)' }
  }

  getreasoncodecolor1(value2: any) {
    let value: any;
    value = value2.status_name;
    if (value == 'Ready')
      return { 'font-weight': 'bold', 'color': "#00ff42"}//, 'background-color': 'rgb(43, 41, 41)' }
    else if (value == 'Talking')
      return { 'font-weight': 'bold', 'color': "#F5A623"}//, 'background-color': 'rgb(43, 41, 41)' }
    else
      return { 'font-weight': 'bold', 'color': "#f64e57"}//, 'background-color': 'rgb(43, 41, 41)' }
  }

  onGridReady(params) {
    
    params.api.sizeColumnsToFit();
    window.addEventListener("resize", function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  }

  onGridReady1(params) {   
    params.api.sizeColumnsToFit();
    window.addEventListener("resize", function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  }

  lastRowBorder(params) {
    return { 'border-bottom': 'thick green' }

  }




  getOutboundData() {
    console.log('Outbound Dashboard Data Function Called');
    this.auth.GetOutboundDashboardDetails().subscribe(_csqList => {
      this.OutboundInfo = _csqList;
      console.log('Outbound Dashboard GetCSQDashboardDetails Response Called::::' + JSON.stringify(_csqList));
      this.OutboundInfoData$.next(this.OutboundInfo);
      console.log('this.OutboundInfo.length:::' + this.OutboundInfo.length);
      this.rowHeight = 25;
      console.log('this.rowHeight:::' + this.rowHeight);
    });

  }
  //below 2 functions stoped due AWDB 
  getSkillGroupData() {
    this.auth.GetOutboundSkillGroupDetails().subscribe(_skillgroupList => {
      this.SkillGroupInfo = _skillgroupList;
      //setTimeout(() => { this.AgentautoSizeAll(); }, 4000);
      console.log('Outbound Dashboard GetAgentDashboardDetails Response Called::::' + JSON.stringify(_skillgroupList));
      this.SkillGroupInfoData$.next(this.SkillGroupInfo);
    });
    //this.AgentgridApi.sizeColumnsToFit();
  }

  getOutboundCountryContactsData() {
    this.auth.GetOutboundCountryContactsInfo().subscribe(_CountryContactList => {
      this.CountryContactInfo = _CountryContactList;
      console.log('Outbound Dashboard GetAgentDashboardDetails Response Called::::' + JSON.stringify(_CountryContactList));
      this.CountryContactInfoData$.next(this.CountryContactInfo);
    });
    this.CountrygridApi.sizeColumnsToFit();
  }

  getOutboundAgentData() {
    this.auth.GetOutboundAgentDetails().subscribe(_AgentList => {
      this.AgentInfo = _AgentList;
      console.log('Outbound Dashboard GetAgentDashboardDetails Response Called::::' + JSON.stringify(_AgentList));
      this.AgentInfoData$.next(this.AgentInfo);
    });
    //this.AgentgridApi.sizeColumnsToFit();
  }
  getDailerDetailSummary(){

    this.auth.GetOutboundDailerDetailSummary().subscribe(_dailerList => {
      debugger
      this.DailerInfo = _dailerList;
      //setTimeout(() => { this.AgentautoSizeAll(); }, 4000);
      console.log('Outbound DashboardSideBarDetails Response Called::::' + JSON.stringify(_dailerList));
      this.DailerInfoData$.next(this.DailerInfo);
    });

  }

  getsidewBarInfoData() {
    this.auth.GetOutboundSummaryRTDetails().subscribe(_sidebarListList => {
      this.SideBarInfo = _sidebarListList;
      //setTimeout(() => { this.AgentautoSizeAll(); }, 4000);
      console.log('Outbound DashboardSideBarDetails Response Called::::' + JSON.stringify(_sidebarListList));
      this.SideBarInfoData$.next(this.SideBarInfo);
    });


  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }
  Typeselected(event) {

    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim()
    };
    console.log(selectedData);
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

  AgentautoSizeAll() {
    if (this.AgentgridColumnApi) {
      var allColumnIds = [];
      this.AgentgridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
        // console.log('Column Id: '+column.colId);
      });
      this.AgentgridColumnApi.autoSizeColumns(allColumnIds);
    }
  }

  //Full Screen
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


