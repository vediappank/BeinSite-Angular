import { Component, OnInit,Inject } from '@angular/core';
import * as moment from 'moment';
import { QualityRequest } from '../_models/qualityrequest.model';
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
  selector: 'kt-qualityreport',
  templateUrl: './qualityreport.component.html',
  styleUrls: ['./qualityreport.component.scss']
})
export class QualityreportComponent implements OnInit { 
  public reportRange: any;  
  public reportFields: any;
  public agentreportinputReq: QualityRequest;
  public title = 'Quality Report';
  public userID : string;
  public RoleID:number;
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

  public dayorweek: string ='daily';
  public medialist: any[] 
  

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
    this.medialist = ['Inbound,Outbound,WhatsApp'];  
    this.elem = document.documentElement;
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userID = JSON.parse(localStorage.getItem('currentUser')).agentid;
  }
   
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    this.reportRange = {
      startDate: moment().subtract(1, 'months').startOf('month'),
      endDate: moment().subtract(1, 'months').endOf('month')
    };
    this.getReportData();
  }


  refreshCols() {
    this.columnDefs = [      
      { headerName: 'Date', field: 'Date', width: 120 },
      { headerName: 'RABAT EVals Count', field: 'RABATCount', width: 150 },
      { headerName: 'RABAT Avg Score', field: 'RABATAvgScore', width: 150 },
      { headerName: 'RABAT Eval Agents Count', field: 'RABATEvalAgentsCount', width: 180 },
      { headerName: 'RABAT NONEval Agents Count', field: 'RABATNONEvalAgentsCount', width: 200 }, 
      { headerName: 'HQ EVals Count', field: 'HQCount', width: 190 },
      { headerName: 'HQ Avg Score', field: 'HQAvgScore', width: 150 },
      { headerName: 'HQ Eval Agents Count', field: 'HQEvalAgentsCount', width: 190 },
      { headerName: 'HQ NONEval Agents Count', field: 'HQNONEvalAgentsCount', width: 190 },
      { headerName: 'TUN EVals Count', field: 'VCCount', width: 190 },
      { headerName: 'TUN Avg Score', field: 'VCAvgScore', width: 150 },
      { headerName: 'TUN Eval Agents Count', field: 'VCEvalAgentsCount', width: 190 },
      { headerName: 'TUN NONEval Agents Count', field: 'VCNONEvalAgentsCount', width: 190 },
    ];
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
  dateFormatter(params) {
    return moment(params.value).format('HH:mm:ss');
  }
  getReportData() { 
    console.log('Quality Info Rrports Data Function Called');
    if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      this.agentreportinputReq = {
        repStartDate: this.reportRange.startDate, 
        repEndDate: this.reportRange.endDate, 
        RoleID:this.RoleID,
        callcenter:'', 
        medialist:this.medialist,
        dayorweek:this.dayorweek,
        groupby:''
      }
      console.log('Quality Reports Inputs:::'+  JSON.stringify(this.agentreportinputReq))
      let schDateTime = moment(this.reportRange.startDate);
      console.log('StartDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment(this.reportRange.endDate);
      console.log('EndDateTime: ' + schDateTime.format('YYYY-MM-DDTHH:mm:ss'));
      this.agentreportinputReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      this.agentData = this.auth.GetQualityReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {               
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Quality Info Rrports Data Response Called::::' + JSON.stringify(_ratiobarList));
      });
    }
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

  //Full Scree
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

