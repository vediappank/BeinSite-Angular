import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CallMetricsRequest } from '../_models/callmetricsreports.model';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'kt-callmetricsreport',
  templateUrl: './callmetricsreport.component.html',
  styleUrls: ['./callmetricsreport.component.scss']
})
export class CallmetricsreportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;
  public reportFields: any;
  public agentreportinputReq: CallMetricsRequest;
  public title = 'Call Metrics Report';
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

  //Barchart Variables assign
  public chartTheme: string;
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
  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router ) {
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
    //this.ShowBarCharts();
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.reportRange = {
      startDate: moment().subtract(2, 'day'),
      endDate: moment().subtract(1, 'day')
    };
    this.getReportData();

  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }

  refreshCols() {
    this.columnDefs = [
      // { headerName: 'Role ID', field: 'RoleID', width: 150 },
      { headerName: 'Language', field: 'Language', width: 220 },
      { headerName: 'Date', field: 'Date', width: 220 },      
      { headerName: 'IVR Incoming', field: 'IVRReceived', width: 200 },
      { headerName: 'Calls Handled', field: 'CallsHandled', width: 200 },
      { headerName: 'Calls Abandoned', field: 'CallsAbandoned', width: 220 },
      { headerName: 'PCA%', field: 'PCA', width: 200 },
      { headerName: 'AHT', field: 'AHT', width: 200 },
      { headerName: 'ASA', field: 'ASA', width: 200 }
      
    ];
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
  getReportData() {

    console.log('Agent Ratio Rrports Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {

      this.agentreportinputReq = {
        repStartDate: this.reportRange.startDate, repEndDate: this.reportRange.endDate,callcenter:''
      }
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      
      this.agentData = this.auth.GetCallMtricsReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {        
       // this.ShowBarCharts(_ratiobarList);  
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Agent Ratio Rrports Data Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
  }

  // ShowBarCharts() {
  //   let chart = am4core.create("chartdiv", am4charts.XYChart);
  //   chart.data = [{
  //     "year": 2005,
  //     "income": 23.5,
  //     "expenses": 18.1
  //   },{
  //     "year": 2006,
  //     "income": 26.2,
  //     "expenses": 22.8
  //   },{
  //     "year": 2007,
  //     "income": 30.1,
  //     "expenses": 23.9
  //   },{
  //     "year": 2008,
  //     "income": 29.5,
  //     "expenses": 25.1
  //   },{
  //     "year": 2009,
  //     "income": 24.6,
  //     "expenses": 25
  //   }];
    
  //   // Create axes
  //   let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  //   categoryAxis.dataFields.category = "year";
  //   categoryAxis.numberFormatter.numberFormat = "#";
  //   categoryAxis.renderer.inversed = true;
  //   categoryAxis.renderer.grid.template.location = 0;
  //   categoryAxis.renderer.cellStartLocation = 0.1;
  //   categoryAxis.renderer.cellEndLocation = 0.9;
    
  //   let  valueAxis = chart.xAxes.push(new am4charts.ValueAxis()); 
  //   valueAxis.renderer.opposite = true;
    
  //   // Create series
  //   function createSeries(field, name) {
  //     let series = chart.series.push(new am4charts.ColumnSeries());
  //     series.dataFields.valueX = field;
  //     series.dataFields.categoryY = "year";
  //     series.name = name;
  //     series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
  //     series.columns.template.height = am4core.percent(100);
  //     series.sequencedInterpolation = true;
    
  //     let valueLabel = series.bullets.push(new am4charts.LabelBullet());
  //     valueLabel.label.text = "{valueX}";
  //     valueLabel.label.verticalCenter = "top";
  //     valueLabel.label.dx = 10;
  //     valueLabel.label.hideOversized = false;
  //     valueLabel.label.truncate = false;
    
  //     let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
  //     categoryLabel.label.text = "{name}";
  //     categoryLabel.label.verticalCenter = "bottom";
  //     categoryLabel.label.dx = -10;
  //     categoryLabel.label.fill = am4core.color("#fff");
  //     categoryLabel.label.hideOversized = false;
  //     categoryLabel.label.truncate = false;
  //   }
    
  //   createSeries("income", "Income");
  //   createSeries("expenses", "Expenses");
    
  // }

  // generateChartData(BarChartsRatioList:any) {
  //   var chartData = [],
  //     categories = {};
  //   for ( var i = 0; i < BarChartsRatioList.length; i++ ) {
  //     var newdate = BarChartsRatioList.data[ i ].Date;
  //     var visits = BarChartsRatioList.data[ i ].visits;
  //     var country = BarChartsRatioList.data[ i ].country;
  
  //     // add new data point
  //     if ( categories[ newdate ] === undefined ) {
  //       categories[ newdate ] = {
  //         date: newdate
  //       };
  //       chartData.push( categories[ newdate ] );
  //     }
  
  //     // add value to existing data point
  //     categories[ newdate ][ country ] = visits;
  //   }
  //   return chartData;
  // }

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

}
