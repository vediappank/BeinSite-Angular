import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AgentActivityReportVO } from '../../reports/_models/agent-activity-report-vo.model';
import { AgentActivityRequest } from '../../reports/_models/agentactivityrequest.model';
import { CCActivity, selectActivityById } from '../../../../core/auth';
import * as moment from 'moment';

import { AuthService,AuthCampaignService } from '../../../../core/auth';
import { string } from '@amcharts/amcharts4/core';
//import { AgentForecastModel } from '../../model/agentforecast.model';
import { AgentForecastModel } from '../../forecast/model/agentforecast.model';

import { SubheaderService } from '../../../../core/_base/layout';

import { ActiveAgentModel } from '../../operations/reskillingskillgroups/Model/activeagentmodel';

import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { Failure } from 'fp-ts/lib/Validation';
import { map, startWith, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { each, remove, find } from 'lodash';
import 'ag-grid-enterprise';
import { GridOptions, RowNode } from 'ag-grid-community';
import { ProgressbarComponent } from '../reskillingskillgroups/progressbar.component';
import {
  MeetingModel,
  Permission, selectMeetingById, User

} from '../../../../core/auth';

import { BehaviorSubject, Observable, of, Subscription, from } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SkillGroupModel } from './Model/skillgroupmodel';
import { SkillGroupSkillTypeModel } from './Model/skillgroupskilltypemodel';
import { SkillGroupMappingModel } from './Model/skillgroupmappingmodel';
import { SkillGroupMappingFilterModel } from './Model/skillgroupmappingfilter';
import { SkillGroupUpdateModelFilter } from './Model/SkillGroupUpdateModelFilter';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-reskillingskillgroups',
  templateUrl: './reskillingskillgroups.component.html',
  styleUrls: ['./reskillingskillgroups.component.scss']
})
export class ReskillingskillgroupsComponent implements OnInit {



  //Auto Complete supervisor
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  IsWait : boolean = false;
  loadingAfterSubmit: boolean = false;
  hasFormErrors: boolean = false;
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

  public viewFlag : Boolean =true; 
  public addFlag: Boolean =true;
  public editFlag: Boolean =true;
  public deleteFlag: Boolean =true;

  //Slider
  isdisbaleskillgroupsChecked = true;
  isenableskillgroupsChecked = true;
  formGroup: FormGroup
  AgentID: any;
  frameworkComponents: any;
  enabaleFlag: boolean;
  disableFlag: boolean;
  constructor( private router: Router,formBuilder: FormBuilder, private auth: AuthCampaignService, private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService, 
    public dialog: MatDialog) {
     
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
    this.getAllSkillGroupsBySkillType();
   

    this.formGroup = formBuilder.group({     
      searchFirstName:''
    });
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
    
    let inboundHeaders:any[]=[];
    let tempinboundHeaders:any;
    let OutboundHeaders:any[]=[];
    let tempOutboundHeaders:any;
    if(this.activeSkillGroupBySkillTypeList.length > 0)
    {      
        tempinboundHeaders = this.activeSkillGroupBySkillTypeList.filter(row=>row.skilltype.toLowerCase() == "inbound");
        tempOutboundHeaders = this.activeSkillGroupBySkillTypeList.filter(row=>row.skilltype.toLowerCase() == "outbound");
        for(let i=0; i< tempinboundHeaders.length; i++)
        {
          inboundHeaders.push({ headerName: tempinboundHeaders[i].enterpricename, field: tempinboundHeaders[i].enterpricename, width: 120,
            cellStyle: function(params) {
              if (params.value.toString().toLowerCase() =='enabled') {                  
                  return {color: 'green'};
              } else {
                return {color: 'red'};
              }
          }})
        }
        for(let j=0; j< tempOutboundHeaders.length; j++)
        {
          OutboundHeaders.push({ headerName: tempOutboundHeaders[j].enterpricename, field: tempOutboundHeaders[j].enterpricename, width: 120,
            cellStyle: function(params) {
              if (params.value.toString().toLowerCase() =='enabled') {                  
                  return {color: 'green' };
              } else {
                return {color: 'red'};
              }
          }})
        }
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
         
      // {
      //   headerName: '',
      //   field: '',
      //   width: 40,
      //   headerCheckboxSelection: true,
      //   headerCheckboxSelectionFilteredOnly: true,
      //   checkboxSelection: true,
      //   cellRendererParams : {
      //     onClick: this.onBtnClick1.bind(this),
      //     label: 'Click 1'
      //   }
        
      // },  
      {
        headerName: 'Agent Info',
      children:[
      { headerName: 'Agent Skill Target ID', field: 'AgentSkillTargetID', width: 150 },
      { headerName: 'Peripheral Number', field: 'PeripheralNumber', width: 150 },
      { headerName: 'First Name', field: 'FirstName', width: 150 },
      { headerName: 'Last Name', field: 'LastName', width: 150 }
      ]},      
      {headerName: 'Inbound',
      children: inboundHeaders      
    },
      {headerName: 'Outbound',
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
    let value = localStorage.getItem('ReSkilling SkillGroups');	
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
    else if (permissionName == "enable")
      this.enabaleFlag = false;
    else if (permissionName == "disable")
      this.disableFlag = false;    
    }
        console.log('ReSkilling SkillGroups Menu Permission:::'+ value);
    this.TempOnint();
  }

  TempOnint()
  {
    
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
  
  onRowSelected(event) {
    console.log('Console Data before:' + JSON.stringify(this.selectedAgentList));
    //
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
    if (localStorage.hasOwnProperty('currentUser')) {
      this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
      this.AgentID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
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
    const controls = this.formGroup.controls;
    const authData = {
      searchFirstName: controls['searchFirstName'].value,
      
    };
    // alert(JSON.stringify(this.formGroup.value));
    //alert(JSON.stringify(this.formGroup.value, null, 2));
    //alert(authData.searchFirstName);
    let value: any;
    value = this.activeAgentsList.filter(option => option.lastname == this.myControl.value);
    this.skillgroupmappinginputRequest = {
      firstname: authData.searchFirstName, lastname: this.myControl.value,
      roleid: this.RoleID, skill_target_id: this.selectedSkillGroups
    }
    this.auth.getAllSkillMappings(this.skillgroupmappinginputRequest).subscribe((_mappingresult: SkillGroupMappingModel[]) => {
    
      if(_mappingresult){        
      this.hasFormSuccess1 = false;       
      this.skillGroupMappinglist = _mappingresult;
      this.skillGroupMappingLists$.next(this.skillGroupMappinglist);
      }
      else{
        
        this.hasFormSuccess1 = true;       
        this.ErrorMessage="No Record Found";
        this.skillGroupMappinglist = null;
        this.skillGroupMappingLists$.next(this.skillGroupMappinglist);
        
      }
      console.log('getAllSkillGroupMapping List::::' + JSON.stringify(this.skillGroupMappinglist))
    });
  }

  onEnablesubmit() {
  
    this.onSkillGroupSubmit("ENABLE");
    // this.IsWait= false;
  }

  onDisablesubmit() {
    
    this.onSkillGroupSubmit("DISABLE");
    
  }

  onSkillGroupSubmit(operation: string) {
    // this.IsWait = true;
    this.hasFormErrors = false;
    this.hasFormSuccess = false;
    this.ErrorMessage = "";
    //alert(JSON.stringify(this.selectedAgentList));
    //
   // alert(this.selectedEnabledisbaleSkillGroups);
    if( !this.selectedEnabledisbaleSkillGroups || this.selectedAgentList.length == 0  ){
      this.hasFormErrors = true;
      this.ErrorMessage = "Please select Skill Group and Agents to Enable/Disable";
    }
    else
    {
      this.ProgressBar();
      var SplitedValue = this.selectedEnabledisbaleSkillGroups.split('-');
      this.skillgroupmappingupdateinputRequest = {
        skillGroupId: Number(SplitedValue[0]), changeStamp: Number(SplitedValue[1]),
        operation: operation, selectedAgents: this.selectedAgentList,userid:this.UserID 
      }
      console.log('UpdateSkillGroupAgentsAsync List::'+operation+'::' + JSON.stringify(this.skillgroupmappingupdateinputRequest))
      this.auth.UpdateSkillGroupAgentsAsync(this.skillgroupmappingupdateinputRequest).subscribe((_mappingresult: any) => {
        // alert(_mappingresult);
        if(_mappingresult.toLowerCase() == "ok")
        {
          this.hasFormSuccess = true;
          this.ErrorMessage ="Selected SkillGroup "+operation+" to Agents Successfully";
          this.TempOnint();
          this.dialog.closeAll();
        }else{
          this.ErrorMessage = _mappingresult;
          this.hasFormErrors = true;
        }
        console.log('UpdateSkillGroupAgentsAsync List::'+operation+'::' + JSON.stringify(_mappingresult))
        
        // this.IsWait= false;
      });
    }
      // this.IsWait = false;

  }

  ProgressBar()
  {
   
    const dialogRef: MatDialogRef<ProgressbarComponent> = this.dialog.open(ProgressbarComponent, {
      panelClass: 'transparent',
      disableClose: true,
      data:{percent: this.percent}
    });
 
  }

  onsearch() {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
    this.getAllSkillGroupMapping();
  }



	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    this.hasFormErrors = false;
    this.hasFormSuccess = false;
  }


}

