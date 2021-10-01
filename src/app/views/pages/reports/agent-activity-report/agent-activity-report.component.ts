import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AgentActivityRequest } from '../_models/agentactivityrequest.model';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kt-agent-activity-report',
  templateUrl: './agent-activity-report.component.html',
  styleUrls: ['./agent-activity-report.component.scss']
})
export class AgentActivityReportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;
  public reportFields: any;
  public agentreportinputReq : AgentActivityRequest;
  public title = 'Agent Activity Report';
  private gridApi;
  private gridColumnApi;
  public gridDefaultColDef = { resizable: true, sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: true, enableRowGroup: true, enablePivot: true, };
  public gridOptions: GridOptions;
  public agentData : any;
  public columnDefs: any;
  public gridSummaryData: any;
  public getGridRowStyle: any;
  public chartTheme: string;
  public RoleID:number;
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
  constructor(private auth: AuthService,private activatedRoute: ActivatedRoute, private router: Router) {
    this.gridOptions = < GridOptions >{
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
   this .refreshCols();
   }

  ngOnInit() {
    am4core.options.commercialLicense = true;
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
     this .reportRange = {
      startDate: moment().subtract(1, 'months').startOf('month'),
      endDate: moment().subtract(1, 'months').endOf('month')
    };
    this.getReportData();
  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }
 
  refreshCols() {
    this .columnDefs = [     
        // {headerName: 'Activity ID', field: 'ActivityID' },
        {headerName: 'Activity', field: 'ActivityName', width:400 },
        {headerName: 'Agent Count', field: 'Count', width:400 }
    ];
    if( this .gridApi ) {
      this .gridApi.setColumnDefs(this .columnDefs);
    }
  }
  getReportData()
  {
    console.log('Agent Activity Rrports Data Function Called');
    if( this .reportRange.startDate && this .reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      this .agentreportinputReq = {
        repStartDate: this .reportRange.startDate, repEndDate: this .reportRange.endDate, RoleID:this.RoleID, callcenter:''      
      }
      let schDateTime = moment( this .reportRange.startDate );
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      this .agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment( this .reportRange.endDate );
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      this .agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

     
      this .agentData = this.auth.GetAgentActivityReport(this.agentreportinputReq);
      this .agentData.subscribe(_activitybarList => {
        this.ShowBarCharts(_activitybarList); 
        setTimeout(() => {this .autoSizeAll();}, 1000);
     console.log('Agent Activity Rrports Data Response Called::::' + JSON.stringify(_activitybarList));
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

  ShowBarCharts(BarChartsRatioList:any) {
    
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    am4core.options.commercialLicense = true;    
    chart.scrollbarX = new am4core.Scrollbar();
    // Add data
    chart.data = BarChartsRatioList.filter(item => item.ActivityName !== 'SUMMARY');
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "ActivityName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "Count";
    series.dataFields.categoryX = "ActivityName";   
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
    let bullet = series.bullets.push(new am4charts.Bullet());
    
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
var label = labelBullet.label;
label.text = "{valueY}";
label.dy = -20;
    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();
  }

}
