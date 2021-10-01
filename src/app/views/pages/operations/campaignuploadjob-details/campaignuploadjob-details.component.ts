import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { CampaignUploadJobModel } from '../../../../core/auth/_models/campaign/campaignuploadJob.Model';
import { CampaignUploadJobDetailModel } from '../../../../core/auth/_models/campaign/campaignuploadjobdetail.model'
import { AuthNoticeService, AuthService, AuthCampaignService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { round } from 'lodash';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-campaignuploadjob-details',
  templateUrl: './campaignuploadjob-details.component.html',
  styleUrls: ['./campaignuploadjob-details.component.scss']
})
export class CampaignuploadjobDetailsComponent implements OnInit {
  public reportType: string = 'agent';
  public agentreportinputReq: CampaignUploadJobModel;
  public title = 'Campagin Upload Job Details Report';
  private gridApi;
  private gridColumnApi;
  public gridDefaultColDef = {
    resizable: true, sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: true, enableRowGroup: true, enablePivot: true,
  };
  public jobid:number;
  public gridOptions: GridOptions;
  public agentData: any;
  public columnDefs: any;
  public gridSummaryData: any;
  public getGridRowStyle: any;
  public elem;
  private defaultColDef;
  private rowHeight;
  //Barchart Variables assign
  public chartTheme: string;
  public chart: any;
  public rowData: [];
  public pagesize:number=15;
  public pagenumber:number;
  public totalRecords:number;

 

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


  constructor(private auth: AuthCampaignService, private activatedRoute: ActivatedRoute,
    private router: Router,@Inject(MAT_DIALOG_DATA) public data: any) {
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
    if (this.data.jobid) {	
      if(this.pagenumber==undefined){
        this.pagenumber=1;
      }
      if(this.pagesize==undefined){
        this.pagesize=15;
      }
      setText('#lblCurrentPage', this.pagenumber);
      this.jobid=this.data.jobid;
    this.getcampaignJobsDetailData(this.data.jobid,this.pagenumber,this.pagesize);
    }
  }

  refreshCols() {
    this.defaultColDef = {
      flex: 1,
      cellClass: 'cell-wrap-text',
      autoHeight: true,
      sortable: true,
      resizable: true,
    };
  
    this.columnDefs = [
      { headerName: 'Detail ID', field: 'JobDetailID', width: 110 },
      { headerName: 'AccountNumber', field: 'AccountNumber', width: 140 },
    { headerName: 'FirstName', field: 'FirstName', width: 120 },
    { headerName: 'LastName', field: 'LastName', width: 150 },    
    { headerName: 'Phone01', field: 'Phone01', width: 100 },
    { headerName: 'Status', field: 'Status', width: 100,cellStyle: function(params) {
      if (params.value=='Success') {          
          return {color: 'green','font-weight':'bold'};
      } else {
        return {color: 'red','font-weight':'bold'};
      }
  } },
    { headerName: 'ProcessSummary', field: 'ProcessSummary', width: 270, cellClass: 'cell-wrap-text' },
    
    ];

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }



  getcampaignJobsDetailData(jobid:number,pagenumber:number,pagesize:number) {
    console.log('getcampaignJobsDetailData Function Called');

    if (localStorage.hasOwnProperty("currentUser")) {
      //this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
    }

    this.agentData = this.auth.GetAllCampaignUploadJobDetail(jobid,pagenumber,pagesize);
    this.agentData.subscribe(_ratiobarList => {
      this.rowData = undefined;
      this.rowData = _ratiobarList;
      this.totalRecords = _ratiobarList[0].totalrecords;
      setTimeout(() => { this.autoSizeAll(); }, 1000);
      console.log('getcampaignJobsDetailData Calls Response Called::::' + JSON.stringify(_ratiobarList));
    });
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

  onChange() {
    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber =1;
    this.getcampaignJobsDetailData(this.jobid,this.pagenumber,this.pagesize);
    
  }


  onBtFirst() {
 
    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber = 1;
   
    this.getcampaignJobsDetailData(this.jobid,this.pagenumber,this.pagesize);
    setText('#lblCurrentPage', this.pagenumber);
    
  }

  onBtLast() {
 
    console.log('here');
    this.pagenumber = round(this.totalRecords/this.pagesize)+1;
    if(this.totalRecords != this.pagesize)
    {
    if(this.rowData.length >= this.pagesize)
    {
    this.getcampaignJobsDetailData(this.jobid,this.pagenumber,this.pagesize);
    setText('#lblCurrentPage', this.pagenumber);
    }
  }
}

onBtNext() {
 
  if(this.totalRecords != this.pagesize)
  {
  if(this.rowData.length >= this.pagesize)
  {
    this.pagenumber = this.pagenumber+1;
    
    this.getcampaignJobsDetailData(this.jobid,this.pagenumber,this.pagesize);
  setText('#lblCurrentPage', this.pagenumber);
  }
}
  // this.gridApi.paginationGoToNextPage();
}

onBtPrevious() {

  if(this.pagenumber > 1)
  {
  this.pagenumber = this.pagenumber-1;
  this.getcampaignJobsDetailData(this.jobid,this.pagenumber,this.pagesize);
  setText('#lblCurrentPage', this.pagenumber);
  }
}

}
function setText(selector, text) {
  document.querySelector(selector).innerHTML = text;
}
