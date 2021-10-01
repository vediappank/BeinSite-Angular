import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
// import { AbsentiesRequest } from '../_models/absentiesreuest.model';
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
  selector: 'kt-agentskillgroupmappingreport',
  templateUrl: './agentskillgroupmappingreport.component.html',
  styleUrls: ['./agentskillgroupmappingreport.component.scss']
})
export class AgentskillgroupmappingreportComponent implements OnInit {

  public reportType: string = 'agent';
  public reportRange: any;

  public reportFields: any;
  // public agentreportinputReq: AbsentiesRequest;
  public title = 'Agent Skill Group Mapping Report';
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
      { headerName: 'Skill Target ID', field: 'SkillTargetID', width: 220 },
      { headerName: 'Peripheral Number', field: 'PeripheralNumber', width: 380 },
      { headerName: 'Login Name', field: 'LoginName', width: 300 },
      { headerName: 'First Name', field: 'FirstName', width: 320 },
      { headerName: 'Last Name', field: 'LastName', width: 320 },
      { headerName: 'Mapped Skill Groups', field: 'MappedSkillGroups', width: 300 },
    ];
    
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  

  getReportData() { 
     
     this.auth.GetAllAgentSkillGroupMappingList().subscribe(_ratiobarList => {    
      this.agentData =  JSON.parse( _ratiobarList);       
        setTimeout(() => { this.autoSizeAll(); }, 1000);
        console.log('Agent Skill Group MappingList Response Called::::' + JSON.stringify(_ratiobarList));
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
