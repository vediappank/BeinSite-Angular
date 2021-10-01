import { Component, OnInit,Inject } from '@angular/core';
import * as moment from 'moment';
import { AgentAbsentiesSummaryRequest } from '../_models/agentabsentiessummaryrequest.model';
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
  selector: 'kt-absentiessummaryreport',
  templateUrl: './absentiessummaryreport.component.html',
  styleUrls: ['./absentiessummaryreport.component.scss']
})
export class AbsentiessummaryreportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;
  public reportFields: any;
  public agentreportinputReq: AgentAbsentiesSummaryRequest;
  public title = 'Agent Absence Summary Report';
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
  //Barchart Variables assign
  public chartTheme: string;
  public chart: any;

  elem;

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
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.reportRange = {
      startDate: moment().subtract(1, 'months').startOf('month'),
      endDate: moment().subtract(1, 'months').endOf('month')
    };
    this.getReportData() ;
    //this.getReportData();
    //this.ShowBarCharts();

  }
  openFullscreen() {
    alert('openFullscreen');
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


  refreshCols() {
    this.columnDefs = [
      { headerName: 'ID', field: 'ID', width: 100 },
      { headerName: 'Last Name', field: 'LastName', width: 150 },
      { headerName: 'Shift Duration', field: 'ShiftDuration', width: 150 },
      { headerName: 'Login Counts', field: 'LoginCounts', width: 150 },
      { headerName: 'Actual Login Duration', field: 'ActualLoginDuration', width: 150 } ,
      { headerName: 'Actual Login Percentage', field: 'ActualLoginPercentage', width: 150 }  ,
      { headerName: 'Absence Duration', field: 'AbsenceDuration', width: 150 },
      { headerName: 'Absence Percentage', field: 'AbsencePercentage', width: 150 },
      { headerName: 'Late Duration', field: 'LateDuration', width: 150 },
      { headerName: 'Late Percentage', field: 'LatePercentage', width: 150 },
      { headerName: 'Left Early Duration', field: 'LeftEarlyDuration', width: 150 } ,
      { headerName: 'Left Early Percentage', field: 'LeftEarlyPercentage', width: 150 }  
    ];
	
	
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
 

  getReportData() {

    console.log('Agent Ratio Rrports Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      this.agentreportinputReq = {
        start_date_time: this.reportRange.startDate, end_date_time: this.reportRange.endDate
      }
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.start_date_time = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.end_date_time = schDateTime.format('YYYY-MM-DD');

      //
      this.agentData = this.auth.GetAgentAbsentiesSummaryReport(this.agentreportinputReq);
      
      this.agentData.subscribe(_ratiobarList => { 
               
       //this.ShowBarCharts(_ratiobarList);  
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Agent Ratio Rrports Data Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }

  ShowBarCharts(ratiolist:any) {

    this.chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data

this.chart.data = [ { 
  "RoleName":"Agent",
  "CCName":"Egypt",
  "AgentActualCount":75,
  "AgentExpectedRatio":10,
  "AgentExpectedCount":20,
  "AgentDeviationCount":30,
"TMActualCount":80,
  "TMExpectedRatio":10,
  "TMExpectedCount":20,
  "TMDeviationCount":10,
"SUPActualCount":100,
  "SUPExpectedRatio":10,
  "SUPExpectedCount":10,
  "SUPDeviationCount":20
},
{ 
  "RoleName":"Agent",
  "CCName":"Head Quarters",
  "AgentActualCount":85,
  "AgentExpectedRatio":20,
  "AgentExpectedCount":30,
  "AgentDeviationCount":10,
"TMActualCount":95,
  "TMExpectedRatio":10,
  "TMExpectedCount":20,
  "TMDeviationCount":30
},
{ 
  "RoleName":"Agent",
  "CCName":"Rabat",
  "AgentActualCount":80,
  "AgentExpectedRatio":110,
  "AgentExpectedCount":120,
  "AgentDeviationCount":130,
"TMActualCount":58,
  "TMExpectedRatio":140,
  "TMExpectedCount":150,
  "TMDeviationCount":160,
"SUPActualCount":109,
  "SUPExpectedRatio":170,
  "SUPExpectedCount":180,
  "SUPDeviationCount":190
} ];
//this.chart.data =ratiolist;
// Create axes
var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "CCName";
categoryAxis.title.text = "Call Center";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 20;
categoryAxis.renderer.cellStartLocation = 0.1;
categoryAxis.renderer.cellEndLocation = 0.9;

var  valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.title.text = "Expenditure (M)";
for(let i=0;i<this.chart.data.length; i++)
{
  for (var key in this.chart.data[i]) { 
    if(i >1)
    {
       //console.log(key +':'+ this.chart.data[i][key] + "<br>"); 
       if(key != 'RoleName' && key != 'CCName')
       this.createSeries(key, key, false);
    }
  } 
  //this.chart.data[0].
}
 

//this.createSeries("AgentActualCount", "AgentActualCount", false);
//this.createSeries("ExpectedCount", "ExpectedCount", false);
//this.createSeries("DeviationCount", "DeviationCount", false);
// this.createSeries("meast", "Middle East", true);
// this.createSeries("africa", "Africa", true);

// Add legend
this.chart.legend = new am4charts.Legend();
// Create series
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

  createSeries(field, name, stacked) {
    var series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "CCName";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series.stacked = stacked;
    series.columns.template.width = am4core.percent(95);
    //let bullet = series.bullets.push(new am4charts.Bullet());

    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueY}";
    valueLabel.label.fontSize = 12;
    valueLabel.label.verticalCenter = "bottom";
    //valueLabel.dy = -8;
    //valueLabel.locationY = 0.5;
    }
}
