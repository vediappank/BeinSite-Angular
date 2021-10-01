import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { CampaignUploadJobModel } from '../../../../core/auth/_models/campaign/campaignuploadJob.Model';
import { CampaignUploadJobDetailModel } from '../../../../core/auth/_models/campaign/campaignuploadjobdetail.model'
import { AuthNoticeService, AuthService, AuthCampaignService } from '../../../../core/auth';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
//Charts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { CampaignuploadjobDetailsComponent } from '../campaignuploadjob-details/campaignuploadjob-details.component';
import { SaveButtonRendererComponent } from './../custom-ag-grid-buttons/save-button-renderer.component';
import { CancelButtonRendererComponent } from './../custom-ag-grid-buttons/cancel-button-renderer.component';
import { DetailButtonRendererComponent } from '../custom-ag-grid-buttons/detail-button-renderer.component';
import { round } from 'lodash';

@Component({
  selector: 'kt-campaignuploadjobs',
  templateUrl: './campaignuploadjobs.component.html',
  styleUrls: ['./campaignuploadjobs.component.scss']
})
export class CampaignuploadjobsComponent implements OnInit {
  public reportType: string = 'agent';
  formGroup: FormGroup
  public agentreportinputReq: CampaignUploadJobModel;
  public title = 'Campagin Upload Job Report';
  // private gridApi;
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
  public frameworkComponents: any;
  public rowData: [];
  public pagesize: number = 5;
  public pagenumber: number;
  public totalRecords: number;

  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;
  addcommentFlag: Boolean = true;

  // public enableOnRowClick: boolean = true;
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
  getRowHeight: (params: any) => number;
  rowHeight: number;


  constructor(private auth: AuthCampaignService, private activatedRoute: ActivatedRoute,
    public authcampaign: AuthCampaignService,
    formBuilder: FormBuilder, private router: Router, public dialog: MatDialog,) {




    let value = localStorage.getItem('Campaign Contact Upload');
    for (let i = 0; i < value.toString().split(',').length; i++) {
      var permissionName = value.toString().split(',')[i].toLowerCase();
      if (permissionName == "add")
        this.addFlag = false;
      else if (permissionName == "edit")
        this.editFlag = false;
      else if (permissionName == "delete")
        this.deleteFlag = false;
      else if (permissionName == "view")
        this.viewFlag = false;

    }

    console.log('Campaign Contact Upload Menu Permission:::' + value);





    this.frameworkComponents = {
      savebuttonRenderer: SaveButtonRendererComponent,
      cancelbuttonRenderer: CancelButtonRendererComponent,
      detailbuttonRenderer: DetailButtonRendererComponent
    }

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

    if (localStorage.hasOwnProperty('Campaign Contact Upload')) {
      let value = localStorage.getItem('Campaign Contact Upload');
      for (let i = 0; i < value.toString().split(',').length; i++) {
        var permissionName = value.toString().split(',')[i].toLowerCase();
        if (permissionName.toLowerCase() == "post contacts")
          this.addFlag = false;
        else if (permissionName.toLowerCase() == "cancel process")
          this.deleteFlag = false;
        else if (permissionName.toLowerCase() == "view")
          this.viewFlag = false;
      }

      console.log('Campaign Contact Upload Menu Permission:::' + value);
    }

    this.elem = document.documentElement;
    if (!this.chartTheme || this.chartTheme === '') {
      this.chartTheme = 'bein-theme';
    }
    if (this.pagenumber == undefined) {
      this.pagenumber = 1;
    }
    if (this.pagesize == undefined) {
      this.pagesize = 5;
    }
    setText('#lbCurrentPage', this.pagenumber);
    this.getcampaignJobsData(this.pagenumber, this.pagesize);

  }

  refreshCols() {

    this.columnDefs = [
      {
        headerName: 'Details',
        field: '',
        width: 90,
        cellRenderer: 'detailbuttonRenderer',
        cellRendererParams: {
          onClick: this.onDetailBtnClick.bind(this),
          label: 'Details'
        },
      },
      {
        headerName: 'Post',
        field: '',
        width: 80,
        cellRenderer: 'savebuttonRenderer',
        cellStyle: function (params) {
          if (params.data.Status.toString().toLowerCase() == 'processed' && this.addFlag == false)
            return { display: 'block' };

          else
            return { display: 'none' };
        },
        cellRendererParams: {
          onClick: this.onPostBtnClick.bind(this),
          label: 'Post'
        }
      },
      {
        headerName: 'Cancel',
        field: '',
        width: 90,
        cellRenderer: 'cancelbuttonRenderer',
        cellStyle: function (params) {
          if (params.data.Status.toString().toLowerCase() == 'processed' && this.deleteFlag == false)
            return { display: 'block' };

          else
            return { display: 'none' };
        },
        cellRendererParams: {
          onClick: this.onCancelBtnClick.bind(this),
          label: 'Cancel'
        },
      },
      { headerName: 'Job ID', field: 'JobID', width: 90 },
      { headerName: 'Campaign Name', field: 'CampaignName', width: 180 },
      { headerName: 'File Name', field: 'FileName', width: 160 },
      {
        headerName: 'Status', field: 'Status', width: 100
      },
      { headerName: 'Job Conditions', field: 'JobConditions', width: 170 },
      { headerName: 'Job Description', field: 'JobDesc', width: 200 },
      { headerName: 'Success/Upload', field: 'SuccessContacts', width: 160 },
      { headerName: 'Failure/Remove', field: 'FailureContacts', width: 160 },
      { headerName: 'Total Contacts', field: 'TotalContacts', width: 155 },
      { headerName: 'Created By', field: 'createdByName', width: 110 },
      { headerName: 'Created DateTime', field: 'CreatedDateTime', width: 150 },
      { headerName: 'Process Start Date', field: 'ProcessStartDateTime', width: 155 },
      { headerName: 'Process End Date', field: 'ProcessEndDateTime', width: 155 },
      { headerName: 'Posted By', field: 'postedByName', width: 110 },
      { headerName: 'Post DateTime', field: 'PostDateTime', width: 150 },
      { headerName: 'Upload Start DateTime', field: 'UploadStartDateTime', width: 210 },
      { headerName: 'Upload End DateTime', field: 'UploadEndDateTime', width: 210 },

    ];
  }

  onPostBtnClick(e) {

    this.agentreportinputReq = e.rowData;
    this.agentreportinputReq.Status = 'Posted';
    this.jobPostCancel(this.agentreportinputReq);
  }

  onCancelBtnClick(e) {
    this.agentreportinputReq = e.rowData;
    this.agentreportinputReq.Status = 'Cancelled';
    this.jobPostCancel(this.agentreportinputReq);
  }
  onDetailBtnClick(e) {
    this.onSelectionChanged(e.rowData);
  }
  jobPostCancel(rowJobData: CampaignUploadJobModel) {

    this.authcampaign.updateCampignJob(rowJobData).subscribe((_updateresult: any) => {
      if (_updateresult) {
        this.totalRecords = _updateresult.
          this.getcampaignJobsData(this.pagenumber, this.pagesize);
      }
      else {
        alert("Please Validate you Campaign File & Format");
        return;
      }
      console.log('submitCampign List::::' + JSON.stringify(_updateresult))
    });
  }
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
  redirecttoList() {
    this.router.navigate(['/reports/campaignupload'], { relativeTo: this.activatedRoute });
  }

  onSelectionChanged(event: any) {

    // const _saveMessage = `Activity successfully has been saved.`;
    //  if(event != false){
    const dialogRef = this.dialog.open(CampaignuploadjobDetailsComponent, { data: { jobid: Number(event.JobID) } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }


    });
  }



  getcampaignJobsData(pagenumber, pagesize) {
    console.log('Absenties Calls Data Function Called');

    if (localStorage.hasOwnProperty("currentUser")) {
      //this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
    }

    this.agentData = this.auth.GetAllCampaignUploadJob(pagenumber, pagesize);

    this.agentData.subscribe(_ratiobarList => {
      setTimeout(() => { this.autoSizeAll(); }, 1000);
      this.rowData = undefined;
      this.rowData = _ratiobarList;
      this.totalRecords = _ratiobarList[0].totalrecords;
      console.log('GetAllCampaignUploadJob Calls Response Called::::' + JSON.stringify(_ratiobarList));
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
    this.pagenumber = 1;
    this.getcampaignJobsData(this.pagenumber, this.pagesize);

  }


  onBtFirst() {

    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber = 1;

    this.getcampaignJobsData(this.pagenumber, this.pagesize);
    setText('#lbCurrentPage', this.pagenumber);

  }

  onBtLast() {

    console.log('here');
    this.pagenumber = round(this.totalRecords / this.pagesize) + 1;
    if (this.totalRecords != this.pagesize) {
      if (this.rowData.length >= this.pagesize) {
        this.getcampaignJobsData(this.pagenumber, this.pagesize);
        setText('#lbCurrentPage', this.pagenumber);
      }
    }
    // this.gridApi.paginationGoToLastPage();
  }

  onBtNext() {

    if (this.totalRecords != this.pagesize) {
      if (this.rowData.length >= this.pagesize) {
        this.pagenumber = this.pagenumber + 1;

        this.getcampaignJobsData(this.pagenumber, this.pagesize);
        setText('#lbCurrentPage', this.pagenumber);
      }
    }
    // this.gridApi.paginationGoToNextPage();
  }

  onBtPrevious() {

    if (this.pagenumber > 1) {
      this.pagenumber = this.pagenumber - 1;
      this.getcampaignJobsData(this.pagenumber, this.pagesize);
      setText('#lbCurrentPage', this.pagenumber);
    }
  }
}

function setText(selector, text) {
  document.querySelector(selector).innerHTML = text;
}
