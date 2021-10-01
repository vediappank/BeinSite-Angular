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

@Component({
  selector: 'kt-rt-ivr-dashboard',
  templateUrl: './rt-ivr-dashboard.component.html',
  styleUrls: ['./rt-ivr-dashboard.component.scss']
})
export class RtIvrDashboardComponent implements OnInit {


  subscription: Subscription;

  public title = 'IVR Dashboard';
  public userID: string;
  public CSQInfo: any;
  public AgentInfo: any;
  public SideBarInfo: any;
  public csqInfoData$ = new BehaviorSubject<any[]>(this.CSQInfo);
  public AgentInfoData$ = new BehaviorSubject<any[]>(this.AgentInfo);
  public SideBarInfoData$ = new BehaviorSubject<any[]>(this.SideBarInfo);


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


  private AgentgridApi;
  private AgentgridColumnApi;
  public AgentgridDefaultColDef = {
    sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: false, enableRowGroup: false, enablePivot: false,
  };
  private defaultColGroupDef;
  public AgentgridOptions: GridOptions;
  public AgentcolumnDefs: any;
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

  //  this.todayDate = new Date();
  //  this.dateToday = (this.todayDate.getFullYear() + '-' + ((this.todayDate.getMonth() + 1)) + '-' + this.todayDate.getDate() + ' ' +this.todayDate.getHours() + ':' + this.todayDate.getMinutes()+ ':' + this.todayDate.getSeconds());





  ngOnDestroy() {

  }
  constructor(private auth: AuthService, @Inject(DOCUMENT) private document: any, private activatedRoute: ActivatedRoute, private router: Router, private subheaderService: SubheaderService) {



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
  }

  ngOnInit() {
    // this.date_time();
    this.subheaderService.setTitle('IVR Real Time Dashbaord');
    this.elem = document.documentElement;
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }

    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.getsidewBarInfoData();
    this.getCSQData();
    this.getAgentData();

    // this.subscription = timer(0, 50000).pipe(
    //   switchMap(() => this.auth.GetCSQDashboardDetails())
    // ).subscribe(result =>this.CSQInfo=  result);

    if (this.router.url === '/rt-dashboard/rtivrdashboard') {
      setInterval(() => {
        this.date_time();
       },1000);
      setInterval(() => {
        this.date_time();
        this.getsidewBarInfoData();
        this.getCSQData();
        this.getAgentData();

        //console.log('fetching data:::' )
      }, 20000);
    }else{
      setInterval(() => {},1000000);
    }
  }



  refreshCols() {
    this.columnDefs = [
      { headerName: 'CSQ', width: 270, field: 'CSQName', cellStyle: { 'text-align': 'left', 'font-weight': 'bold', 'background-color': '#000', 'color': 'white', 'font-size': '18px' }, cellClass: 'noborder' },
      { headerName: 'Old In Queue', field: 'OldInQueue', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' }, cellClass: 'noborder' },
      { headerName: 'Calls Waiting', field: 'CallWaiting', cellStyle: params => this.getcallswaitingcolor(params.value) },
      { headerName: 'Logged In', field: 'LoggedIn', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Available', field: 'Avialable', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Not Ready', field: 'NotReady', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Talking', field: 'Talking', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Calls Offered', field: 'CallsOffered', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Calls Ans(#)', field: 'CallsAnswer', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Calls Ans(%)', field: 'CallsAnswerPer', cellStyle: params => this.getcallsansweredcolor(params.value) },
      { headerName: 'ASA', field: 'ASA', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } }
    ];

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
      //this.gridApi.sizeColumnsToFit();
      //this.gridApi.api.sizeColumnsToFit();
      //this.gridApi.
    }

    // this.rowClassRules = {
    //     return {color: 'red', backgroundColor: 'green'};

    // };
  }

  h: any;
  m: any;
  s: any;
  AMPM: any;
  result: any;
  date_time() {
    
    let date = new Date;
    let year = date.getFullYear();
    let month = date.getMonth();
    let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    let d = date.getDate();
    let day = date.getDay();
    let days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    this.h = (date.getHours() + 24) % 12 || 12;

    if (this.h < 10) {
      this.h = "0" + this.h;
    }
    this.m = date.getMinutes();
    if (this.m < 10) {
      this.m = "0" + this.m;
    }
    this.s = date.getSeconds();
    if (this.s < 10) {
      this.s = "0" + this.s;
    }
    this.AMPM = date.getHours() >= 12 ? ' PM' : ' AM';
    this.result = '' + days[day] + ' ' + months[month] + ' ' + d + ' ' + year + ' ' + this.h + ':' + this.m + ' ' + this.AMPM;    
    (document.getElementById('currentdatetime') as HTMLInputElement).innerHTML = this.result;
 
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
  refreshAgentCols() {
    this.AgentcolumnDefs = [
      { headerName: 'Agent', width: 390, field: 'AgentName', cellStyle: { 'text-align': 'left', 'font-weight': 'bold', 'background-color': '#000', 'color': 'white', 'font-size': '18px' } },
      { headerName: 'Extn', field: 'Extension', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'Status', field: 'Status', cellStyle: params => this.getreasoncodecolor(params.value) },
      { headerName: 'Time In Status', field: 'TimeInStatus', cellStyle: params => this.getreasoncodecolor1(params) },
      { headerName: 'Reason Code', field: 'ReasonCode', cellStyle: params => this.getreasoncodecolor(params.value) },
      { headerName: 'Call Ans (#)', field: 'CallAnswered', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } },
      { headerName: 'AHT', field: 'AHT', cellStyle: { 'font-weight': 'bold', 'font-size': '18px', 'background-color': '#000', 'color': '#fff' } }
    ];
    if (this.AgentgridApi) {
      this.AgentgridApi.setColumnDefs(this.AgentcolumnDefs);
      //this.AgentgridApi.sizeColumnsToFit();
      // this.AgentgridApi.api.sizeColumnsToFit();

    }
  }

  getreasoncodecolor(value: string) {
    if (value == 'Ready')
      return { 'font-weight': 'bold', 'font-size': '18px', 'color': "#00ff42", 'background-color': '#000' }
    else if (value == 'Talking')
      return { 'font-weight': 'bold', 'font-size': '18px', 'color': "#F5A623", 'background-color': '#000' }
    else
      return { 'font-weight': 'bold', 'font-size': '18px', 'color': "#f64e57", 'background-color': '#000' }
  }

  getreasoncodecolor1(value2: any) {
    let value: any;
    value = value2.data.Status;
    if (value == 'Ready')
      return { 'font-weight': 'bold', 'font-size': '18px', 'color': "#00ff42", 'background-color': '#000' }
    else if (value == 'Talking')
      return { 'font-weight': 'bold', 'font-size': '18px', 'color': "#F5A623", 'background-color': '#000' }
    else
      return { 'font-weight': 'bold', 'font-size': '18px', 'color': "#f64e57", 'background-color': '#000' }
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




  getCSQData() {
    console.log('IVR Dashboard Data Function Called');
    this.auth.GetCSQDashboardDetails().subscribe(_csqList => {
      this.CSQInfo = _csqList;
      console.log('IVR Dashboard GetCSQDashboardDetails Response Called::::' + JSON.stringify(_csqList));
      this.csqInfoData$.next(this.CSQInfo);
      console.log('this.CSQInfo.length:::' + this.CSQInfo.length);
      //this.CSQGridHeight =  this.CSQInfo.length * 32 + 'px';
      this.rowHeight = 25;
      console.log('this.rowHeight:::' + this.rowHeight);
      // window.addEventListener("resize", function () {
      //   setTimeout(function () {
      //     this.gridApi.api.sizeColumnsToFit();
      //   });
      // });
    });

  }
  //below 2 functions stoped due AWDB 
  getAgentData() {
    this.auth.GetAgentDashboardDetails().subscribe(_agentList => {
      this.AgentInfo = _agentList;
      //setTimeout(() => { this.AgentautoSizeAll(); }, 4000);
      console.log('IVR Dashboard GetAgentDashboardDetails Response Called::::' + JSON.stringify(_agentList));
      this.AgentInfoData$.next(this.AgentInfo);
    });
    //this.AgentgridApi.sizeColumnsToFit();
  }




  getsidewBarInfoData() {
    this.auth.GetDashboardSideBarDetails().subscribe(_sidebarListList => {
      this.SideBarInfo = _sidebarListList;
      //setTimeout(() => { this.AgentautoSizeAll(); }, 4000);
      console.log('IVR DashboardSideBarDetails Response Called::::' + JSON.stringify(_sidebarListList));
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

