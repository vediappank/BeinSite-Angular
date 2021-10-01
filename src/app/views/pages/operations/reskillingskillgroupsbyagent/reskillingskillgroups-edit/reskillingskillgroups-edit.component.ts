
import * as moment from 'moment';

import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';

import { AuthService,AuthCampaignService } from '../../../../../core/auth';
import { string } from '@amcharts/amcharts4/core';
//import { AgentForecastModel } from '../../model/agentforecast.model';
import { AgentForecastModel } from '../../../forecast/model/agentforecast.model';

import { SubheaderService } from '../../../../../core/_base/layout';

import { ActiveAgentModel } from '../../reskillingskillgroups/Model/activeagentmodel';

import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Failure } from 'fp-ts/lib/Validation';
import { map, startWith, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { each, remove, find } from 'lodash';
import 'ag-grid-enterprise';
import { GridOptions, RowNode } from 'ag-grid-community';
import { delay } from 'rxjs/operators';
import {
  MeetingModel,
  Permission, selectMeetingById, User

} from '../../../../../core/auth';


import { BehaviorSubject, Observable, of, Subscription, from } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SkillGroupModel } from '../../reskillingskillgroups/Model/skillgroupmodel';
import { SkillGroupSkillTypeModel } from '../../reskillingskillgroups/Model/skillgroupskilltypemodel';
import { SkillGroupMappingModel } from '../../reskillingskillgroups/Model/skillgroupmappingmodel';
import { SkillGroupMappingFilterModel } from '../../reskillingskillgroups/Model/skillgroupmappingfilter';
import { SkillGroupUpdateModelFilter } from '../../reskillingskillgroups/Model/SkillGroupUpdateModelFilter';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProgressbarComponent } from '../../reskillingskillgroups/progressbar.component';
import { SkillGroupsByAgentModel } from '../../reskillingskillgroups/Model/skillgroupsbyagentmodel';
import { SkillGroupEditInboundUpdateModel } from '../../reskillingskillgroups/Model/skillgroupinboundModel';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { ReskillingskilgroupsbyagentlistComponent } from './../reskillingskilgroupsbyagentlist/reskillingskilgroupsbyagentlist.component';

@Component({
  selector: 'kt-reskillingskillgroups-edit',
  templateUrl: './reskillingskillgroups-edit.component.html',
  styleUrls: ['./reskillingskillgroups-edit.component.scss']
})

export class ReskillingskillgroupsEditComponent implements OnInit {
  public EditinboundupdateinputRequest: SkillGroupEditInboundUpdateModel;
  step = 0;
  Activity_Type: any;
  SkillGroups: any;
  SkillGroupsFlag: boolean;

  selectedSkillGroupsArray: Array<any> = [];

  public inboundlist: SkillGroupsByAgentModel[] = [];
  public Outboundlist: SkillGroupsByAgentModel[] = [];
  public Selectedinboundlist: SkillGroupsByAgentModel[] = [];
  public SelectedOutboundlist: SkillGroupsByAgentModel[] = [];

  public EnabledInboundlist: SkillGroupsByAgentModel[] = [];
  public DisabledInboundlist: SkillGroupsByAgentModel[] = [];

  public EnabledOutboundlist: SkillGroupsByAgentModel[] = [];
  public DisabledOutboundlist: SkillGroupsByAgentModel[] = [];
  percent: number = 70;
  AgentID: any;
  searchfiltername: any;
  public hasFormErrors: boolean = false;
  ErrorMessage: string;
  // selectedActivityTypeArray : any;
  // selectedSkillGroupsArray : any;
  setStep(index: number) {
    this.step = index;
  }
  public activeSkillGroupsByAgentList: SkillGroupsByAgentModel[] = [];
  viewLoading: boolean = false;
  selectedTab: number = 0;
  constructor(private router: Router, formBuilder: FormBuilder, private auth: AuthCampaignService,
    private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public datas: any, public dialogRef: MatDialogRef<ReskillingskillgroupsEditComponent>) { }

  ngOnInit() {
    if (this.datas.selectedAgent.AgentSkillTargetID > 0)
      this.searchfiltername = this.datas.firstname;      
      localStorage.setItem('FilterValue', this.searchfiltername);
    this.getAllSkillGroupsByagent(this.datas.selectedAgent.AgentSkillTargetID);
  }

  getAllSkillGroupsByagent(agent_skill_target_id: number) {
    this.auth.getAllSkillGroupsByAgent(agent_skill_target_id).subscribe((_result: SkillGroupsByAgentModel[]) => {

      this.activeSkillGroupsByAgentList = _result;
      console.log('getAllSkillGroupsByAgent collection:: Response::' + JSON.stringify(_result));
      if (_result.length > 0) {
        this.inboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == "Inbound");
        this.Selectedinboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == "Inbound" && row.active_flag == true);
        this.EnabledInboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == "Inbound" && row.active_flag == true);
        this.Outboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == "Outbound");
        this.SelectedOutboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == "Outbound" && row.active_flag == true);
        this.EnabledOutboundlist = this.activeSkillGroupsByAgentList.filter(row => row.activity_type == "Outbound" && row.active_flag == true);
      }
    });
  }
  getComponentTitle() {
    let result = 'Inbound/Outbound SkillGroup Mapping';
    return result;
  }



  getCheckedItemList(event, selectedData: any) {

    if (selectedData.activity_type.startsWith('Inbound')) {
      if (this.hasFormErrors) {
        this.DisabledInboundlist = [];
        this.EnabledInboundlist = [];
      }
      if (event.checked) {
        this.EnabledInboundlist.push(selectedData);
      }
      else {
        var index = this.EnabledInboundlist.indexOf(selectedData);
        if (index > -1) {
          this.EnabledInboundlist.splice(index, 1);
          this.DisabledInboundlist.push(selectedData);
        }
      }
    }
    else if (selectedData.activity_type.startsWith('Outbound')) {
      if (this.hasFormErrors) {
        this.DisabledOutboundlist = [];
        this.EnabledOutboundlist = [];
      }
      if (event.checked)
        this.EnabledOutboundlist.push(selectedData);
      else {
        var index = this.EnabledOutboundlist.indexOf(selectedData);
        if (index > -1) {
          this.EnabledOutboundlist.splice(index, 1);
          this.DisabledOutboundlist.push(selectedData);
        }
      }
    }
  }

  onsubmit(){
    this.onInboundsubmit();
    this.onOutboundsubmit();
  }
  onInboundsubmit() {
    if (this.EnabledInboundlist.length > 0 || this.DisabledInboundlist.length > 0) {
      this.hasFormErrors = false;
      this.ProgressBar();
      console.log('SelectedData:::' + JSON.stringify(this.datas));
      if (localStorage.hasOwnProperty('currentUser')) {
        this.AgentID = JSON.parse(localStorage.getItem('currentUser')).agentid;
      }
      let EnableDisableFlag: boolean = false;
      if ((this.Selectedinboundlist.length == this.DisabledInboundlist.length) && (this.EnabledInboundlist.length == 0))
        EnableDisableFlag = true;
      else
        EnableDisableFlag = false;

      this.EditinboundupdateinputRequest = {
        operation: this.datas.selectedAgent.Inbound == 'Enabled' ? 'Enable' : 'Disable',
        selectedAgents: this.EnabledInboundlist,
        unselectedAgents: this.DisabledInboundlist, userid: this.AgentID,
        inboundoutbounddisableflag : EnableDisableFlag
      }
      this.auth.EditEnableDisableInboundSkillGroupByAgent(this.EditinboundupdateinputRequest).subscribe(_mappingresult => {
        if (_mappingresult.toLowerCase() == "ok") {
          // location.reload();
         this.dialog.closeAll();
          this.dialogRef.close({
            searchfiltername:this.searchfiltername,
            isEdit: true
          });
          this.layoutUtilsService.showActionNotification("Inbound/Outbound SkillGroup Updated Successfully", MessageType.Update, 2000, true, true);
        }
        console.log('onEnableOutboundsubmit Data received: ' + _mappingresult);
      });
    }
    // else {
    //   this.hasFormErrors = true;
    //   this.ErrorMessage = "Please select atleast one inbound skillgroups";
    //   //return false;
    // }
  }
  ProgressBar() {
    const dialogRef: MatDialogRef<ProgressbarComponent> = this.dialog.open(ProgressbarComponent, {
      panelClass: 'transparent',
      disableClose: true,

      data: { percent: this.percent }
    });

  }

  onOutboundsubmit() {
    // 
    //     let Inboundst:any;
         let Outboundst:any;
    //     Inboundst = this.datas.selectedAgent.Outbound == 'Enabled' ? 'Enable' : 'Disable'
    //     Outboundst = this.datas.selectedAgent.Inbound == 'Enabled' ? 'Enable' : 'Disable'
    //   if( Inboundst == 'Disable' && Outboundst == 'Disable')      
    //   Outboundst='Enable';
    //   else
       Outboundst = this.datas.selectedAgent.Inbound == 'Enabled' ? 'Enable' : 'Disable';

    if (this.EnabledOutboundlist.length > 0 || this.DisabledOutboundlist.length > 0) {
      this.hasFormErrors = false;
      this.ProgressBar();

      if (localStorage.hasOwnProperty('currentUser')) {
        this.AgentID = JSON.parse(localStorage.getItem('currentUser')).agentid;
      }
      let EnableDisableFlag: boolean = false;
      if ((this.SelectedOutboundlist.length == this.DisabledOutboundlist.length) && (this.EnabledOutboundlist.length == 0))
        EnableDisableFlag = true;
      else
        EnableDisableFlag = false;
    
        

      this.EditinboundupdateinputRequest = {
        operation: Outboundst, 
        selectedAgents: this.EnabledOutboundlist, unselectedAgents: this.DisabledOutboundlist,
         userid: this.AgentID, inboundoutbounddisableflag : EnableDisableFlag
      }
      this.auth.EditEnableDisableInboundSkillGroupByAgent(this.EditinboundupdateinputRequest).subscribe(_mappingresult => {
        if (_mappingresult.toLowerCase() == "ok") {
           this.dialog.closeAll();
          // location.reload();
          this.dialogRef.close({
            searchfiltername:this.searchfiltername,
            isEdit: true
          });
          this.layoutUtilsService.showActionNotification("Inbound/Outbound SkillGroup Updated Successfully", MessageType.Update, 2000, true, true);
        }
        console.log('onEnableOutboundsubmit Data received: ' + _mappingresult);
      });
    }
    // else {
    //   this.hasFormErrors = true;
    //   this.ErrorMessage = "Please select atleast one outbound skillgroups";
    //   //return false;
    // }
  }

  /**
	 * Close alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    this.hasFormErrors = false;

  }



}
