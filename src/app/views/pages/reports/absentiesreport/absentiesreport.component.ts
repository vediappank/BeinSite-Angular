import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AbsentiesRequest } from '../_models/absentiesreuest.model';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'kt-absentiesreport',
  templateUrl: './absentiesreport.component.html',
  styleUrls: ['./absentiesreport.component.scss']
})
export class AbsentiesreportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;

  public reportFields: any;
  public agentreportinputReq: AbsentiesRequest;
  public title = 'Absenties Report';
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
  public elem;
  //Barchart Variables assign
  public chartTheme: string;
  public chart: any;
  public  lastname: string ='ALL';
  public RoleID: number;

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

  public lastnameListRange = [{
    id: 'ALL',
    name: 'ALL',
  },{
    id: 'HQ',
    name: 'HQ',
  },{
    id: 'RAB',
    name: 'RAB',
  },{
    id: 'TUN',
    name: 'TUN',
  }
];

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
  constructor(private auth: AuthService,private activatedRoute: ActivatedRoute, private router: Router ) {
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
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.reportRange = {
      startDate: moment().subtract(1, 'months').startOf('month'),
      endDate: moment().subtract(1, 'months').endOf('month')
    };
    this.getReportData();
    //this.ShowBarCharts();
  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }

  refreshCols() {
    this.columnDefs = [
      { headerName: 'AgentId', field: 'AgentId', width: 120 },
      { headerName: 'First Name', field: 'AgentFirstName', width: 280 },
      { headerName: 'Last Name', field: 'AgentLastName', width: 200 },
      { headerName: 'Absence (%)', field: 'AbsencePercentage', width: 200 },
      { headerName: 'Absence Count', field: 'AbsenceCount', width: 220 },
      { headerName: 'Late Count', field: 'LateCount', width: 200 },
      { headerName: 'Left Early Count', field: 'LeftEarlyCount', width: 220 },
      { headerName: 'Full Day Abs Count', field: 'FullDayAbsCount', width: 200 }
    ];

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  

  getReportData() {    
    console.log('Absenties Calls Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      if(this.lastname=='ALL')
      this.lastname='';
      this.agentreportinputReq = {
        repStartDate: this.reportRange.startDate, repEndDate: this.reportRange.endDate,  RoleID:this.RoleID,callcenter:this.lastname,GroupBy:'Agent'
        ,dayorweek:'Daily'
      }
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      
      this.agentData = this.auth.GetAbsentiesReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {                 
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Absenties Calls Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
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

  // Create series
  createSeries(field, name) {
    var series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "year";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series.columns.template.width = am4core.percent(95);

    var bullet = series.bullets.push(new am4charts.LabelBullet);
    bullet.label.text = "{name}";
    bullet.label.rotation = 90;
    bullet.label.truncate = false;
    bullet.label.hideOversized = false;
    bullet.label.horizontalCenter = "left";
    bullet.locationY = 1;
    bullet.dy = 10;
  }
  //Full Scree
  openFullscreen() {
   // alert('openFullscreen');
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

}

export interface State {
  flag: string;
  name: string;
  population: string;
}