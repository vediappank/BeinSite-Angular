import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {UserCCRoleRequest } from '../_models/userccrolerequest.model';
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
  selector: 'kt-user-ccrole-report',
  templateUrl: './user-ccrole-report.component.html',
  styleUrls: ['./user-ccrole-report.component.scss']
})
export class UserCcroleReportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;

  public reportFields: any;
  public agentreportinputReq: UserCCRoleRequest;
  public title = 'User CCRole Report';
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
   
    this.getReportData();
    //this.ShowBarCharts();
  }
  redirecttoList() {
    this.router.navigate(['/reports/reportslist'], { relativeTo: this.activatedRoute });
  }

  refreshCols() {
    this.columnDefs = [
      { headerName: 'Agent ID', field: 'agentid', width: 120 },
      { headerName: 'First Name', field: 'firstname', width: 450 },
      { headerName: 'Last Name', field: 'lastname', width: 450 },
      { headerName: 'CCRole', field: 'ccrole', width: 300 },
      { headerName: 'Start Date', field: 'startdate', width: 175 } ,
      { headerName: 'Time', field: 'starttime', width: 175 }    
    ];

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  

  getReportData() {    
    console.log('CCRole Calls Data Function Called');
    // if (this.reportRange.startDate && this.reportRange.endDate) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      }
      if(this.lastname=='ALL')
      this.lastname='';
      this.agentreportinputReq = {
         RoleID:this.RoleID,callcenter:this.lastname
      }
      
     

      
      this.agentData = this.auth.GetUserCCRoleReport(this.agentreportinputReq);
      this.agentData.subscribe(_ratiobarList => {                 
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('CCRole Calls Response Called::::' + JSON.stringify(_ratiobarList));
      });
    // }
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
