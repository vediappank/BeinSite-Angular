import { Component, OnInit,Inject } from '@angular/core';
import * as moment from 'moment';
import { TicketLogAccuracyRequest } from '../_models/ticketlogaccuracyreport.model';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'kt-ticketlogaccuracyreport',
  templateUrl: './ticketlogaccuracyreport.component.html',
  styleUrls: ['./ticketlogaccuracyreport.component.scss']
})
export class TicketlogaccuracyreportComponent implements OnInit {

  
  public reportType: string = 'agent';
  public reportRange: any;
  public reportFields: any;
  public agentreportinputReq: TicketLogAccuracyRequest;
  public title = 'Ticket Log Accuracy Report';
  private gridApi;
  public elem;
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

  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }

  refreshCols() {
    this.columnDefs = [      
      { headerName: 'Date', field: 'Date', width: 150 },
      { headerName: 'Inbound Tickets', field: 'InboundTickets', width: 200 },
      { headerName: 'Handled Calls', field: 'HandledCalls', width: 190 },
      { headerName: 'Inbound Ticket(%)', field: 'InboundTicketPercentage', width: 140 },
      { headerName: 'Outbound Tickets', field: 'OutboundTickets', width: 200 },
      { headerName: 'Outbound Calls', field: 'OutboundCalls', width: 150 },
      { headerName: 'Outbound Tickets(%)', field: 'OutboundTicketsPercentage', width: 200 },
      { headerName: 'WhtsApp Tikets', field: 'WhatsAppTikets', width: 150 },
      { headerName: 'WhtsApp Assigned Count', field: 'WhatsAppAssignedCount', width: 200 },
      { headerName: 'WhtsApp Ticket(%)', field: 'WhatsAppTicketPercentage', width: 200 }  
    ];

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
  getReportData() {

    console.log('TicketLogAccuracy Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      this.agentreportinputReq = {
        repStartDate: this.reportRange.startDate, repEndDate: this.reportRange.endDate,RoleID:this.RoleID,callcenter:''
      }
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      //
      this.agentData = this.auth.GetTicketLogAccuracyReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {        
       // this.ShowBarCharts(_ratiobarList);  
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('TicketLogAccuracy Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
  }

  ShowBarCharts(BarChartsRatioList:any) {
    
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();
    // Add data
    chart.data = BarChartsRatioList;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "RoleName";
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
    series.dataFields.categoryX = "RoleName";   
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

  //Full Scree
  openFullscreen() {
    //alert('openFullscreen');
    this.elem = document.getElementById("fullscreen");
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
