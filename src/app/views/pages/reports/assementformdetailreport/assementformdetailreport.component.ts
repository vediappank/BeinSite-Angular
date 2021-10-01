import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { AssessmentFormDetailsRequest } from '../_models/assessmentformdetailsrequest.model'
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Lodash
import { each, find, some, remove } from 'lodash';

//import assessmentlist
import { MAssessmentFormList } from '../../reports/_models/assessmentformlist.model';
import { DOCUMENT } from '@angular/common';
import { keys } from '@amcharts/amcharts4/.internal/core/utils/Object';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';

@Component({
  selector: 'kt-assementformdetailreport',
  templateUrl: './assementformdetailreport.component.html',
  styleUrls: ['./assementformdetailreport.component.scss']
})
export class AssementformdetailreportComponent implements OnInit {


  public reportType: string = 'agent';
  public reportRange: any;
  public switchid: any;
  public reportFields: any;
  public agentreportinputReq: AssessmentFormDetailsRequest;
  public title = 'Assessment Form Details Report';
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
  public RoleID: number;
  //Barchart Variables assign
  public chartTheme: string;
  public chart: any;

  allForms: MAssessmentFormList[] = [];
  unassignedForms: MAssessmentFormList[] = [];
  assignedForms: MAssessmentFormList[] = [];
  AssessmentformIdsForFilter: number[];


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
  constructor(private auth: AuthService, @Inject(DOCUMENT) private document: any, private activatedRoute: ActivatedRoute, private router: Router) {
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

    // this.auth.GetAllAssessmentFormList().subscribe((forms: MAssessmentFormList[]) => {
    //   
    // 	each(forms, (_Forms: MAssessmentFormList) => {
    // 		this.allForms.push(_Forms);
    // 		this.unassignedForms.push(_Forms);
    // 	});

    // });


    this.getReportData();
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
      { headerName: 'Form Key', field: 'form_key', width: 150 },
      { headerName: 'Form Component Key', field: 'form_component_key', width: 200 },
      { headerName: 'Form Title', field: 'form_title', width: 150 },
      { headerName: 'Section Name', field: 'section_name', width: 375 },
      { headerName: 'Category Name', field: 'category_name', width: 250 },
      { headerName: 'Element Name', field: 'element_name', width: 250 },

      { headerName: 'Assess1 Comments', field: 'assess1_comments', width: 250 },
      { headerName: 'Assess1 Sum Attained Scores', field: 'assess1_sum_attained_scores', width: 350 },
      { headerName: 'Assess1 Sum Possible Scores', field: 'assess1_sum_possible_scores', width: 350 },
      { headerName: 'Assess1 Max Possible Score', field: 'assess1_max_possible_score', width: 350 },

      { headerName: 'Assess2 Commentst', field: 'assess2_comments', width: 250 },
      { headerName: 'Assess2 Sum Attained Scores', field: 'assess2_sum_attained_scores', width: 350 },
      { headerName: 'Assess2 Sum Possible Scores', field: 'assess2_sum_possible_scores', width: 350 },
      { headerName: 'Assess2 Max Possible Score', field: 'assess2_max_possible_score', width: 300 },

      { headerName: 'Assess3 Comments', field: 'assess3_comments', width: 350 },
      { headerName: 'Assess3 Sum Attained Scores', field: 'assess3_sum_attained_scores', width: 375 },
      { headerName: 'Assess3 Sum Possible Scores', field: 'assess3_sum_possible_scores', width: 350 },
      { headerName: 'Assess3 Max Possible Score', field: 'assess3_max_possible_score', width: 350 },

      { headerName: 'Asess4 Comments', field: 'assess4_comments', width: 350 },
      { headerName: 'Assess4 Sum Attained Scores', field: 'assess4_sum_attained_scores', width: 350 },
      { headerName: 'Assess4 Sum Possible Scores', field: 'assess4_sum_possible_scores', width: 350 },
      { headerName: 'Assess4 Max Possible Score', field: 'assess4_max_possible_score', width: 350 },

      { headerName: 'Assess5 Commentst', field: 'assess5_comments', width: 250 },
      { headerName: 'Assess5 Sum Attained Scores', field: 'assess5_sum_attained_scores', width: 350 },
      { headerName: 'Assess5 Sum Possible Scores', field: 'assess5_sum_possible_scores', width: 350 },
      { headerName: 'Assess5 Max Possible Score', field: 'assess5_max_possible_score', width: 350 },

    ];


    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }


  getReportData() {

    console.log('Agent Ratio Rrports Data Function Called');
    // let assessmentformids : number[] = [36];
    //   if (this.AssessmentformIdsForFilter != undefined)
    //   assessmentformids = this.AssessmentformIdsForFilter;
    // else
    // assessmentformids = [0];
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      
      if (!this.switchid)
        this.switchid = '';
      this.agentreportinputReq = {
        switch_call_id: this.switchid
      }



      //
      this.agentData = this.auth.GetAssessmentFormDetailsReport(this.agentreportinputReq);
      
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

  ShowBarCharts(ratiolist: any) {

    this.chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data

    this.chart.data = [{
      "RoleName": "Agent",
      "CCName": "Egypt",
      "AgentActualCount": 75,
      "AgentExpectedRatio": 10,
      "AgentExpectedCount": 20,
      "AgentDeviationCount": 30,
      "TMActualCount": 80,
      "TMExpectedRatio": 10,
      "TMExpectedCount": 20,
      "TMDeviationCount": 10,
      "SUPActualCount": 100,
      "SUPExpectedRatio": 10,
      "SUPExpectedCount": 10,
      "SUPDeviationCount": 20
    },
    {
      "RoleName": "Agent",
      "CCName": "Head Quarters",
      "AgentActualCount": 85,
      "AgentExpectedRatio": 20,
      "AgentExpectedCount": 30,
      "AgentDeviationCount": 10,
      "TMActualCount": 95,
      "TMExpectedRatio": 10,
      "TMExpectedCount": 20,
      "TMDeviationCount": 30
    },
    {
      "RoleName": "Agent",
      "CCName": "Rabat",
      "AgentActualCount": 80,
      "AgentExpectedRatio": 110,
      "AgentExpectedCount": 120,
      "AgentDeviationCount": 130,
      "TMActualCount": 58,
      "TMExpectedRatio": 140,
      "TMExpectedCount": 150,
      "TMDeviationCount": 160,
      "SUPActualCount": 109,
      "SUPExpectedRatio": 170,
      "SUPExpectedCount": 180,
      "SUPDeviationCount": 190
    }];
    //this.chart.data =ratiolist;
    // Create axes
    var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "CCName";
    categoryAxis.title.text = "Call Center";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Expenditure (M)";
    for (let i = 0; i < this.chart.data.length; i++) {
      for (var key in this.chart.data[i]) {
        if (i > 1) {
          //console.log(key +':'+ this.chart.data[i][key] + "<br>"); 
          if (key != 'RoleName' && key != 'CCName')
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
