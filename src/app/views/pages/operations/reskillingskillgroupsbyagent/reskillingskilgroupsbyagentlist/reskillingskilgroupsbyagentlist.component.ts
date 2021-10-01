import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AgentActivityReportVO } from '../../../reports/_models/agent-activity-report-vo.model';
import { AgentActivityRequest } from '../../../reports/_models/agentactivityrequest.model';
import { CCActivity, selectActivityById } from '../../../../../core/auth';
import * as moment from 'moment';

import { AuthService,AuthCampaignService } from '../../../../../core/auth';
import { string } from '@amcharts/amcharts4/core';
//import { AgentForecastModel } from '../../model/agentforecast.model';
import { AgentForecastModel } from '../../../forecast/model/agentforecast.model';

import { SubheaderService } from '../../../../../core/_base/layout';

import { ActiveAgentModel } from '../../../operations/reskillingskillgroups/Model/activeagentmodel';

import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Failure } from 'fp-ts/lib/Validation';
import { map, startWith, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { each, remove, find } from 'lodash';
import 'ag-grid-enterprise';
import { GridOptions, RowNode } from 'ag-grid-community';
import { ButtonRendererComponent } from './../../reskillingskillgroups/button-renderer.component';
import { SkillGroupsByAgentModel } from '../../reskillingskillgroups/Model/skillgroupsbyagentmodel';
import {
  MeetingModel,
  Permission, selectMeetingById, User

} from '../../../../../core/auth';

import { BehaviorSubject, Observable, of, Subscription, from } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SkillGroupModel } from './../../reskillingskillgroups/Model/skillgroupmodel';
import { SkillGroupSkillTypeModel } from './../../reskillingskillgroups/Model/skillgroupskilltypemodel';
import { SkillGroupMappingModel } from './../../reskillingskillgroups/Model/skillgroupmappingmodel';
import { SkillGroupMappingFilterModel } from './../../reskillingskillgroups/Model/skillgroupmappingfilter';
import { SkillGroupUpdateModelFilter } from './../../reskillingskillgroups/Model/SkillGroupUpdateModelFilter';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProgressbarComponent } from './../../reskillingskillgroups/progressbar.component';
import { ReskillingskillgroupsEditComponent } from './../../reskillingskillgroupsbyagent/reskillingskillgroups-edit/reskillingskillgroups-edit.component';
import { SkillGroupEditInboundUpdateModel } from '../../reskillingskillgroups/Model/skillgroupinboundModel';

@Component({
  selector: 'kt-reskillingskilgroupsbyagentlist',
  templateUrl: './reskillingskilgroupsbyagentlist.component.html',
  styleUrls: ['./reskillingskilgroupsbyagentlist.component.scss']
})
export class ReskillingskilgroupsbyagentlistComponent implements OnInit {
  public EditinboundupdateinputRequest: SkillGroupEditInboundUpdateModel;

  //Auto Complete supervisor
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  IsWait: boolean = false;
  loadingAfterSubmit: boolean = false;
  hasFormErrors: boolean = false;
  hasdisabled: boolean = false;
  viewLoading: boolean = false;
  public RoleID: number;
  ErrorMessage: string;
  hasFormSuccess: boolean = false;
  hasFormSuccess1: boolean = false;
  UserID: any;
  percent: number = 50;
  public skillgroupmappinginputRequest: SkillGroupMappingFilterModel;
  public skillgroupmappingupdateinputRequest: SkillGroupUpdateModelFilter;
  //AutocompletedSEarch
  public selctedFirstName: string = '';
  selctedskill_target_id: string;
  unassignedSupervisor: ActiveAgentModel[] = [];
  supervisorIdForAdding: number;
  selectedSkillGroups: string;
  public activeAgentsList: ActiveAgentModel[] = [];
  public activeSkillGroupBySkillTypeList: SkillGroupSkillTypeModel[] = [];
  public skillGroupList: SkillGroupModel[] = [];
  selectedEnabledisbaleSkillGroups: string;
  public skillGroupMappinglist: SkillGroupMappingModel[];
  public skillGroupMappingLists$ = new BehaviorSubject<SkillGroupMappingModel[]>(this.skillGroupMappinglist);

  public selectedAgentList: SkillGroupMappingModel[] = [];

  assignedSupervisor: ActiveAgentModel[] = [];
  public SupervisorList$: Observable<ActiveAgentModel[]>

  public activeSkillGroupsByAgentList: SkillGroupsByAgentModel[] = [];
  public inboundlist: SkillGroupsByAgentModel[] = [];
  public Outboundlist: SkillGroupsByAgentModel[] = [];
  public Selectedinboundlist: SkillGroupsByAgentModel[] = [];
  public SelectedOutboundlist: SkillGroupsByAgentModel[] = [];


  //Grid
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
  filterfirstName: string;
  //fields
  public inboundfield: string;
  public outboundfield: string;

  public viewFlag : Boolean =true; 
  public addFlag: Boolean =true;
  public editFlag: Boolean =true;
  public deleteFlag: Boolean =true;

  public enabaleInboundFlag: Boolean =true;
  public disableInboundFlag: Boolean =true;

  public enabaleOutboundFlag: Boolean =true;
  public disableOutboundFlag: Boolean =true;

  //Slider
  isdisbaleskillgroupsChecked = true;
  isenableskillgroupsChecked = true;
  formGroup: FormGroup
  AgentID: any;
  sessionfiltervalues: any;
  frameworkComponents: any;
  closedialogueflag: boolean = false;
  public searchvalue:any;
  constructor(private router: Router, private route: ActivatedRoute,
     formBuilder: FormBuilder, private auth: AuthCampaignService, private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog) {


    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
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
    this.formGroup = formBuilder.group({
      searchFirstName: ''
    });
  //   if (localStorage.hasOwnProperty('FilterValue')) {  
  //     this.searchvalue = localStorage.getItem('FilterValue');       
  //   this.formGroup = formBuilder.group({
  //     searchFirstName: this.searchvalue == ''?'':this.searchvalue
  //   });
  // }
   
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
  };

  refreshCols() {

    let inboundHeaders: any[] = [];
    let tempinboundHeaders: any;
    let OutboundHeaders: any[] = [];
    let tempOutboundHeaders: any;
    let inboundparamvalue: any[] = [];
    let outboundparamvalue: any[] = [];
    let inboundfield: any[] = [{ "Value": "Disabled" }];
    let outboundfield: any[] = [{ "Value": "Disabled" }];

    if (this.activeSkillGroupBySkillTypeList.length > 0) {


      tempinboundHeaders = this.activeSkillGroupBySkillTypeList.filter(row => row.skilltype.toLowerCase() == "inbound");
      tempOutboundHeaders = this.activeSkillGroupBySkillTypeList.filter(row => row.skilltype.toLowerCase() == "outbound");
      for (let i = 0; i < tempinboundHeaders.length; i++) {
        inboundHeaders.push({
          headerName: tempinboundHeaders[i].enterpricename, field: tempinboundHeaders[i].enterpricename, width: 120,
          cellStyle: function (params) {

            if (params.value.toString().toLowerCase() == 'enabled') {

              return { color: 'green' };
            } else {

              return { color: 'red' };
            }
          }
        })


      }
      for (let j = 0; j < tempOutboundHeaders.length; j++) {
        OutboundHeaders.push({
          headerName: tempOutboundHeaders[j].enterpricename, field: tempOutboundHeaders[j].enterpricename, width: 120,
          cellStyle: function (params) {
            if (params.value.toString().toLowerCase() == 'enabled') {

              return { color: 'green' };
            } else {

              return { color: 'red' };
            }
          }
        })
      }

      console.log("Inboundparamvalue ::" + inboundparamvalue);
      console.log("Outboundparamvalue ::" + outboundparamvalue);
    }
    this.columnDefs = [
      {
        headerName: '',
        field: '',
        width: 40,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      {
        headerName: 'Update',
        field: '',
        width: 40,

        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditBtnClick.bind(this),
          label: 'Edit'
        }
        // enable : this.editFlag
        
      },

      {
        headerName: 'Agent Info',
        children: [
          { headerName: 'Agent Skill Target ID', field: 'AgentSkillTargetID', width: 150 },
          { headerName: 'Peripheral Number', field: 'PeripheralNumber', width: 150 },
          { headerName: 'First Name', field: 'FirstName', width: 150 },
          { headerName: 'Last Name', field: 'LastName', width: 150 }
        ]
      },
      {
        headerName: 'Inbound',
        field: 'Inbound', width: 100
        ,
        cellStyle: function (params) {
          if (params.value.toString().toLowerCase() == 'enabled') {

            return { color: 'green' };
          } else {

            return { color: 'red' };
          }
        }
      },
      {
        headerName: 'Outbound',
        field: 'Outbound', width: 110,
        cellStyle: function (params) {
          if (params.value.toString().toLowerCase() == 'enabled') {

            return { color: 'green' };
          } else {

            return { color: 'red' };
          }
        }
      },
      {
        headerName: 'Inbound',
        children: inboundHeaders
      },
      {
        headerName: 'Outbound',
        children: OutboundHeaders

      },
    ];
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }




  public filterValue;
  onQuickFilterChanged() {
    //alert(this.filterValue);
    this.gridApi.setQuickFilter(this.filterValue);
  }

  ngOnInit() {   
    let value = localStorage.getItem('ReSkilling Agent');	    
			for(let i=0; i< value.toString().split(',').length; i++)		{
			var permissionName = value.toString().split(',')[i].toLowerCase().trim();
			if (permissionName== "add")
				this.addFlag = false;
			else if (permissionName == "edit")
				this.editFlag = false;
			else if (permissionName == "delete")
				this.deleteFlag = false;
			else if (permissionName == "view")
        this.viewFlag = false;
      else if (permissionName == "enableinbound")
        this.enabaleInboundFlag = false;
      else if (permissionName == "disableinbound")
        this.disableInboundFlag = false;
      else if (permissionName == "enableoutbound")
        this.enabaleOutboundFlag = false;
      else if (permissionName == "disableoutbound")
				this.disableOutboundFlag = false;
      }
    console.log('ReSkilling Agent Menu Permission:::'+ value);
    
    this.getAllSkillGroupsBySkillType();
    if (localStorage.hasOwnProperty('currentUser')) {
      this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      this.AgentID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
    this.TempOnint();
  }

  TempOnint() {
    //Auto Complete supervisor
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.getAllActiveAgents();
    this.getAllSkillGroups();
    this.getAllSkillGroupMapping();
    this.selectedEnabledisbaleSkillGroups = '';
    this.selectedAgentList = [];
  }

  //Auto Complete active agent list
  _filter(value: string): any[] {

    if (value != 'search') {
      const filterValue = value.toLowerCase();
      return this.activeAgentsList.filter(option => option.lastname.toLowerCase().includes(filterValue));
    }
    else {
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this.activeAgentsList.filter(option => option.lastname.toLowerCase().includes(value))));
    }
  }

  onEditBtnClick(e) {
    const controls1 = this.formGroup.controls;
    const authData = {
      searchFirstName: controls1['searchFirstName'].value
    };
    const dialogRef = this.dialog.open(ReskillingskillgroupsEditComponent, { data: { selectedAgent: e.rowData, firstname: authData.searchFirstName } });
    dialogRef.afterClosed().subscribe(res => {
      
      if (!res) {
        return;
      }
      this.sessionfiltervalues =  res.searchfiltername ;
      this.getAllSkillGroupMapping();
    });
  }

  onRowSelected(event) {
    console.log('Console Data before:' + JSON.stringify(this.selectedAgentList));
    if (event.node.selected)
      this.selectedAgentList.push(event.data);
    else {
      var index = this.selectedAgentList.indexOf(event.data);
      if (index > -1) {
        this.selectedAgentList.splice(index, 1);
      }
    }


    console.log('Console Data after:' + JSON.stringify(this.selectedAgentList));
  }

  //getLastItem() {
  // return this.selectedNodes[this.selectedNodes.length - 1];
  //} 

  getAllActiveAgents() {

    this.auth.getAllActiveAgents(this.RoleID.toString()).subscribe((_Super: ActiveAgentModel[]) => {
      this.activeAgentsList = _Super;
      console.log('Active Agent List::::' + JSON.stringify(this.activeAgentsList))
    });
  }
  getAllSkillGroupsBySkillType() {

    this.auth.getAllSkillGroupsBySkillType().subscribe((_Super: SkillGroupSkillTypeModel[]) => {
      this.activeSkillGroupBySkillTypeList = _Super;
      this.refreshCols();
      console.log('getAllSkillGroupsBySkillType List::::' + JSON.stringify(this.activeSkillGroupBySkillTypeList))
    });
  }

  getAllSkillGroups() {
    this.auth.getAllSkillGroups().subscribe((_Super: SkillGroupModel[]) => {
      this.skillGroupList = _Super;
      console.log('getAllSkillGroups List::::' + JSON.stringify(this.skillGroupList))
    });
  }

  getAllSkillGroupMapping() {
    this.selectedAgentList = [];
    const controls = this.formGroup.controls;   
    let authData; 
    if (this.sessionfiltervalues == '' || this.sessionfiltervalues == undefined) {
       authData = {
        searchFirstName: controls['searchFirstName'].value
      };
      // localStorage.setItem("FilterValue",authData.searchFirstName);
    }
    else
    {
       authData = {
        searchFirstName: this.sessionfiltervalues
      };

    }
    let value: any;
    value = this.activeAgentsList.filter(option => option.lastname == this.myControl.value);
    this.skillgroupmappinginputRequest = {
      firstname: authData.searchFirstName, lastname: this.myControl.value,
      roleid: this.RoleID, skill_target_id: this.selectedSkillGroups
    }
    
    this.auth.getAllSkillMappingsForAgents(this.skillgroupmappinginputRequest).subscribe((_mappingresult: SkillGroupMappingModel[]) => {
      if (_mappingresult) {
        this.hasFormSuccess1 = false;
        this.skillGroupMappinglist = _mappingresult;
        console.log('skillGroupMappinglist for agents List::::' + JSON.stringify(this.skillGroupMappinglist))
        this.skillGroupMappingLists$.next(this.skillGroupMappinglist);
    
      }
      else {

        this.hasFormSuccess1 = true;
        this.ErrorMessage = "No Record Found";
        this.skillGroupMappinglist = null;
        this.skillGroupMappingLists$.next(this.skillGroupMappinglist);

      }

      console.log('getAllSkillGroupMapping List::::' + JSON.stringify(this.skillGroupMappinglist))
    });
  }

  ProgressBar() {

    const dialogRef: MatDialogRef<ProgressbarComponent> = this.dialog.open(ProgressbarComponent, {
      panelClass: 'transparent',
      disableClose: true,
      data: { percent: this.percent }
    });

  }
  onEnableInboundsubmit() {
    this.hasFormErrors = false;
    this.hasFormSuccess = false;
    this.ErrorMessage = "";
    this.closedialogueflag = false;
    if (this.selectedAgentList.length > 0) {

      for (let i = 0; i < this.selectedAgentList.length; i++) {
        var skill_target_id = this.selectedAgentList[i].AgentSkillTargetID;
        console.log('skill_target_id::::' + skill_target_id);

        this.auth.getAllSkillGroupsByAgent(skill_target_id).subscribe((_result: SkillGroupsByAgentModel[]) => {
          this.activeSkillGroupsByAgentList = _result;

          if (_result.length > 0) {
            this.Selectedinboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == 'Inbound' && row.active_flag == true);

            console.log('filterdata::::' + JSON.stringify(this.Selectedinboundlist));
            if (this.Selectedinboundlist.length > 0) {
              this.ProgressBar();
              this.EditinboundupdateinputRequest = {
                operation: "Enable", selectedAgents: this.Selectedinboundlist, unselectedAgents: [],
                userid: this.AgentID, inboundoutbounddisableflag: false
              }
              this.auth.EnableDisableInboundOutboundSkillGroupByAgent(this.EditinboundupdateinputRequest).subscribe(_mappingresult => {
                if (_mappingresult.toLowerCase() == "ok") {
                  this.hasFormSuccess = true;
                  this.ErrorMessage = "Selected SkillGroup Enabled to Inbound  Successfully";
                  this.dialog.closeAll();
                  this.TempOnint();
                } else {
                  this.ErrorMessage = _mappingresult;
                  this.hasFormErrors = true;
                  this.closedialogueflag = false;
                }

                console.log('EnableDisableInboundOutboundSkillGroupByAgent data Infoamrion::::' + JSON.stringify(this.EditinboundupdateinputRequest));
              });
            }
            else {
              alert("No skill groups assigned to this agent to enable");
              return false;
            }
          }
        });
      }

    }
    else {
      this.hasFormErrors = true;
      this.ErrorMessage = "Please select the Agents to Enable Inbound";
    }
  }
  ///Get Enabled/Diabled Inbound OuboundSkillGRoups

  onDisableInboundsubmit() {
    this.hasdisabled = false;
    this.hasFormErrors = false;
    this.hasFormSuccess = false;
    this.ErrorMessage = "";
    if (this.selectedAgentList.length > 0) {

      for (let i = 0; i < this.selectedAgentList.length; i++) {
        var skill_target_id = this.selectedAgentList[i].AgentSkillTargetID;
        console.log('skill_target_id::::' + skill_target_id);

        this.auth.getAllSkillGroupsByAgent(skill_target_id).subscribe((_result: SkillGroupsByAgentModel[]) => {

          this.activeSkillGroupsByAgentList = _result;

          if (_result.length > 0) {

            this.Selectedinboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == 'Inbound' && row.active_flag == true);

            console.log('filterdata::::' + JSON.stringify(this.Selectedinboundlist));
            if (this.Selectedinboundlist.length > 0) {
              this.ProgressBar();
              this.EditinboundupdateinputRequest = {
                operation: "Disable", selectedAgents: this.Selectedinboundlist, unselectedAgents: [],
                userid: this.AgentID, inboundoutbounddisableflag: false
              }
              this.auth.EnableDisableInboundOutboundSkillGroupByAgent(this.EditinboundupdateinputRequest).subscribe(_mappingresult => {
                if (_mappingresult.toLowerCase() == "ok") {
                  this.hasFormSuccess = true;
                  this.ErrorMessage = "Selected SkillGroup Disabled to Inbound  Successfully";
                  this.dialog.closeAll();
                  this.TempOnint();
                } else {
                  this.ErrorMessage = _mappingresult;
                  this.hasFormErrors = true;
                  this.closedialogueflag = false;
                }
                console.log('EnableDisableInboundOutboundSkillGroupByAgent data Infoamrion::::' + JSON.stringify(this.EditinboundupdateinputRequest));
              });
            }
            else {
              alert("Selected agent is already disabled");
              return false;
            }
          }
        })
      }
    }
    else {
      this.hasFormErrors = true;
      this.ErrorMessage = "Please select the Agents to Disable Inbound";
    }
  }

  onEnableOutboundsubmit() {
    if (this.selectedAgentList.length > 0) {

      for (let i = 0; i < this.selectedAgentList.length; i++) {
        var skill_target_id = this.selectedAgentList[i].AgentSkillTargetID;
        console.log('skill_target_id::::' + skill_target_id);

        this.auth.getAllSkillGroupsByAgent(skill_target_id).subscribe((_result: SkillGroupsByAgentModel[]) => {
          this.activeSkillGroupsByAgentList = _result;

          if (_result.length > 0) {
            this.SelectedOutboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == 'Outbound' && row.active_flag == true);

            console.log('filterdata::::' + JSON.stringify(this.SelectedOutboundlist));
            if (this.SelectedOutboundlist.length > 0) {
              this.ProgressBar();
              this.EditinboundupdateinputRequest = {
                operation: "Enable", selectedAgents: this.SelectedOutboundlist, unselectedAgents: [],
                userid: this.AgentID, inboundoutbounddisableflag: false
              }
              this.auth.EnableDisableInboundOutboundSkillGroupByAgent(this.EditinboundupdateinputRequest).subscribe(_mappingresult => {

                if (_mappingresult.toLowerCase() == "ok") {
                  this.hasFormSuccess = true;
                  this.ErrorMessage = "Selected SkillGroup Enabled to Outbound  Successfully";
                  this.dialog.closeAll();
                  this.getAllSkillGroupsBySkillType();
                  this.onsearch();

                } else {
                  this.ErrorMessage = _mappingresult;
                  this.hasFormErrors = true;
                  this.closedialogueflag = false;
                }

                console.log('onEnableOutboundsubmit data Infoamrion::::' + JSON.stringify(this.EditinboundupdateinputRequest));
              });
            }
            else {
              alert("No skill groups assigned to this agent to enable");
              return false;
            }
          }
        });
      }

    }
    else {
      this.hasFormErrors = true;
      this.ErrorMessage = "Please select the Agents to Enable Outbound";
    }
  }

  onDisableOutboundsubmit() {
    if (this.selectedAgentList.length > 0) {

      for (let i = 0; i < this.selectedAgentList.length; i++) {
        var skill_target_id = this.selectedAgentList[i].AgentSkillTargetID;
        console.log('skill_target_id::::' + skill_target_id);

        this.auth.getAllSkillGroupsByAgent(skill_target_id).subscribe((_result: SkillGroupsByAgentModel[]) => {
          this.activeSkillGroupsByAgentList = _result;

          if (_result.length > 0) {
            this.SelectedOutboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == 'Outbound' && row.active_flag == true);

            console.log('filterdata::::' + JSON.stringify(this.SelectedOutboundlist));
            if (this.SelectedOutboundlist.length > 0) {
              this.ProgressBar();
              this.EditinboundupdateinputRequest = {
                operation: "Disable", selectedAgents: this.SelectedOutboundlist, unselectedAgents: [],
                userid: this.AgentID, inboundoutbounddisableflag: false
              }
              this.auth.EnableDisableInboundOutboundSkillGroupByAgent(this.EditinboundupdateinputRequest).subscribe(_mappingresult => {

                if (_mappingresult.toLowerCase() == "ok") {
                  this.hasFormSuccess = true;
                  this.ErrorMessage = "Selected SkillGroup Disabled to Outbound  Successfully";
                  this.dialog.closeAll();
                  this.TempOnint();

                } else {
                  this.ErrorMessage = _mappingresult;
                  this.hasFormErrors = true;
                  this.closedialogueflag = false;
                }

                console.log('onDisableOutboundsubmit data Infoamrion::::' + JSON.stringify(this.EditinboundupdateinputRequest));
              });
            }
            else {
              alert("Selected agent is already disabled");
              return false;
            }
          }
        });
      }

    }
    else {
      this.hasFormErrors = true;
      this.ErrorMessage = "Please select the Agents to Disable Outbound";
    }
  }

  onsearch() {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
    this.sessionfiltervalues = '';
    this.getAllSkillGroupMapping();
  }



	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    this.hasFormErrors = false;
    this.hasdisabled = false;
    this.hasFormSuccess = false;
  }


}

