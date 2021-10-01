import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { CCRatioDetailRequest } from '../../../../core/auth/_models/ccratiodetailrequest.model';
import { CCRatioDetailModel } from '../../../../core/auth/_models/ccratiodetail.model';

import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-ratio-detail',
  templateUrl: './ratio-detail.component.html',
  styleUrls: ['./ratio-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RatioDetailComponent implements OnInit {
  public agentreportinputReq: CCRatioDetailRequest;
  ratioDetailList: CCRatioDetailModel[] = [];
  public title: string;

  private gridApi;
  public gridDefaultColDef = {
    resizable: true, sortable: true, filter: true, filterParams: { applyButton: true, clearButton: true },
    enableValue: true, enableRowGroup: true, enablePivot: true,
  };
  public gridOptions: GridOptions;
  public columnDefs: any;
  public gridSummaryData: any;
  public getGridRowStyle: any;
  public ratioInfo: any;
  public RatioInfoData$ = new BehaviorSubject<any[]>(this.ratioInfo);
  displayedColumns = ['AgentID', 'FirstName', 'LastName'];
  constructor(public dialogRef: MatDialogRef<RatioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public auth: AuthService) {
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
    if (this.data.RoleID) {
      this.getReportData();
    }
  }

  refreshCols() {
    this.columnDefs = [
      { headerName: 'Agent ID', field: 'AgentID', width: 190 },
      { headerName: 'First Name', field: 'FirstName', width: 300 },
      { headerName: 'Last Name', field: 'LastName', width: 300 },
    ];
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

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
  }


  getReportData() {   
    this.title = this.data.RoleName + ' List';
    console.log('Agent Ratio Dashboard Data Function Called');
    this.agentreportinputReq = {
      repStartDate: this.data.inputs.repStartDate, repEndDate: this.data.inputs.repEndDate, callcenter: this.data.inputs.callcenter, RoleID: this.data.RoleID
    }
    console.log('Dialog inputs: ' + JSON.stringify(this.data));

    this.auth.GetCCRatioDetailDashboard(this.agentreportinputReq).subscribe(ccRatioList => {
      this.ratioInfo = ccRatioList;
      this.RatioInfoData$.next(this.ratioInfo);
      console.log('Agent Ratio Report Response ::::' + JSON.stringify(this.ratioDetailList));
    });

  }

}
