import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';

import { AuthService, User } from '../../../../../core/auth';
@Component({
  selector: 'kt-actiontracker-agent-selection-widget',
  templateUrl: './actiontracker-agent-selection-widget.component.html',
  styleUrls: ['./actiontracker-agent-selection-widget.component.scss']
})
export class ActiontrackerAgentSelectionWidgetComponent implements OnInit {

  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;
  public isAddPermission: Boolean = true;
  public activateactiontrackerFlag: Boolean = true;
  public deactivateactiontrackerFlag: Boolean = true;

  Agents: any[] = [];
  selectedAgents: any[] = [];
  selectedPeople: any;
  source: Array<any>;
  confirmed: Array<any>;
  @Input() public UpdateAgentSelectedList: string;
  @Input() public OrganizationId: any;
  // @Input() public MeetingType: string;
  @Output() public AgentSelectedList = new EventEmitter<any>();



  constructor(public auth: AuthService) {
    this.confirmed = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedPeople = '';
    this.getUsersByOrg(this.OrganizationId);
  }

  ngOnInit() {
    if (localStorage.hasOwnProperty('Action Tracker')) {
      let value = localStorage.getItem('Action Tracker');
      for (let i = 0; i < value.toString().split(',').length; i++) {

        var permissionName = value.toString().split(',')[i].toLowerCase().trim();
        if (permissionName == "add")
          this.addFlag = false;
        else if (permissionName == "edit")
          this.editFlag = false;
        //   else if (permissionName == "delete")
        //   this.deleteFlag = false;
        //   else if (permissionName == "view")
        //   this.viewFlag = false;
        // else if (permissionName == "actiontrackerapprover")
        //   this.isAddPermission = false;

      }
      console.log('Activity Menu Permission:::' + value);
    }

    if (this.OrganizationId != undefined) {
      this.selectedPeople = '';
      this.getUsersByOrg(this.OrganizationId);
    }
  }

  getUsersByOrg(OrgId: any) {
   
    if (!this.addFlag || !this.editFlag) {
      this.auth.getUserByOrganization(OrgId)
        .subscribe((res) => {
          this.userSelectedAgents(res);
          this.AgentSelectedList.emit(this.selectedPeople);
        });
    }
  }
  OnChangeAgent($event) {
    this.selectedAgents = [];
    //console.log(' OnChangeAgent this.confirmed User List::::' + JSON.stringify($event));   
    for (let i = 0; i < $event.length; i++) {
      this.selectedAgents.push($event[i].id);
    }
    this.AgentSelectedList.emit(this.selectedAgents.toString());
    console.log('Actiontracker Selected Agents List::::' + JSON.stringify(this.selectedAgents));

  }
  userSelectedAgents(res) {
    this.Agents = res;
    this.source = res;
    this.source = this.source.filter(row => row.active_flag != "N");
    this.Agents = this.Agents.filter(row => row.active_flag != "N");
    // this.confirmed = [];
    console.log('Source List::::' + JSON.stringify(this.source));
    console.log('User List::::' + JSON.stringify(this.Agents));
    console.log(' this.confirmed User List::::' + JSON.stringify(this.confirmed));
    this.confirmed = [];
    this.selectedPeople = this.UpdateAgentSelectedList;
    for (let i = 0; i < this.UpdateAgentSelectedList.length; i++) {
      const finSummRec = this.Agents.find(x => x.id === this.UpdateAgentSelectedList[i]);
      this.confirmed.push(finSummRec);
    }
  }
  OnSelectAgent() {
    this.AgentSelectedList.emit(this.selectedPeople);
    console.log('OnSelectAgent List on changed::::' + JSON.stringify(this.selectedPeople));
  }

  getAgentName(item: any) {
    return item.lastname + ' ' + item.firstname;
  }
}

