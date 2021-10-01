import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { ManualOutboundRequest } from '../_models/maualoutboundrequest.model';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'kt-manualoutboundreport',
  templateUrl: './manualoutboundreport.component.html',
  styleUrls: ['./manualoutboundreport.component.scss']
})
export class ManualoutboundreportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;
  public reportFields: any;
  public agentreportinputReq: ManualOutboundRequest;
  public title = 'Manual Outbound Calls Report';
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
  public elem;


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
  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router,@Inject(DOCUMENT) private document: any ) {
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
      { headerName: 'Date', field: 'Date', width: 200 },
      { headerName: 'Manual OutBound Calls', field: 'MOutCalls', width: 240 },
      { headerName: 'Total Calls', field: 'TotalCalls', width: 200 },
      { headerName: 'Manual OutBound(%)', field: 'MOutboundPer', width: 260 },
      { headerName: 'Duration (Sec)', field: 'Duration', width: 200 },
      { headerName: 'Duration Time (HH:MM:SS)', field: 'DurationTime', width: 300 },
      { headerName: 'Costof Manual Calls ($)', field: 'CostofManualCalls', width: 250 }
    ];

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
  getReportData() {

    console.log('Manual Outbound Calls Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      this.agentreportinputReq = {
        repStartDate: this.reportRange.startDate, repEndDate: this.reportRange.endDate, RoleID:this.RoleID,callcenter:''
      }
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      //
      this.agentData = this.auth.GetManulOutboundReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {

        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Manual Outbound Calls Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
  }

  ShowBarCharts() {

    // Create chart instance
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    this.chart.numberFormatter.numberFormat = "#.0";

    // Add data
    this.chart.data = [{
      "year": "2003",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
      "lamerica": 1.2,
      "meast": 0.2,
      "africa": 0.1
    }, {
      "year": "2004",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
      "lamerica": 1.3,
      "meast": 0.3,
      "africa": 0.1
    }, {
      "year": "2005",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 1.4,
      "meast": 0.3,
      "africa": 0.1
    }];

    // Create axes
    var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.valign = "top";
    categoryAxis.renderer.labels.template.fontSize = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Expenditure (M)";


    this.chart.paddingBottom = 150;
    this.chart.maskBullets = false;

    this.createSeries("europe", "Europe");
    this.createSeries("namerica", "North America");
    this.createSeries("asia", "Asia");
    this.createSeries("lamerica", "Latin America");
    this.createSeries("meast", "Middle East");
    this.createSeries("africa", "Africa");
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

    //Full Screen
    openFullscreen() {
      //alert('openFullscreen');
      this.elem = document.getElementById("fulldiv");
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
