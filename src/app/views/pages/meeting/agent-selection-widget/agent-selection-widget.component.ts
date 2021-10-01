import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';

import { AuthService, User } from '../../../../core/auth';
@Component({
  selector: 'kt-agent-selection-widget',
  templateUrl: './agent-selection-widget.component.html',
  styleUrls: ['./agent-selection-widget.component.scss']
})
export class AgentSelectionWidgetComponent implements OnInit, OnChanges {

  Agents: any[] = [];
  selectedAgents: any[] = [];
  selectedPeople: any;
  source: Array<any>;
  confirmed: Array<any>;
  @Input() public UpdateAgentSelectedList: string;
  @Input() public MeetingType: string;
  @Output() public AgentSelectedList = new EventEmitter<any>();

 

  constructor(public auth: AuthService) {
    this.confirmed = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
      const filter: any = {};
      filter.ID = undefined;
      filter.UserName = '';
      filter.CallCenter = '';
      filter.LastName = '';
      filter.FirstName = '';
      filter.UserRole = '';
      filter.CCRole = '';
      filter.Status = '';
      filter.PageNumber = 0;
      filter.PageSize= 0;
    this.auth.getAllUsers(filter)
      .subscribe((res) => {
        this.Agents = res;
        this.source = res;
        this.source =  this.source.filter(row=>row.active_flag !="N");
        this.Agents =  this.Agents.filter(row=>row.active_flag !="N");
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
        this.AgentSelectedList.emit(this.selectedPeople);
      });
  }

  OnChangeAgent($event) {    
    this.selectedAgents = [];
    //console.log(' OnChangeAgent this.confirmed User List::::' + JSON.stringify($event));   

    if (this.MeetingType === 'One to One') {
      if ($event.length == 1) {
        this.selectedAgents.push($event[0].id);
        this.AgentSelectedList.emit(this.selectedAgents.toString());
        console.log(' One to One Meeting Selected Agents List::::' + JSON.stringify(this.selectedAgents));
      }
      else if($event.length == 0)
      {
        this.AgentSelectedList.emit(this.selectedAgents.toString());
        console.log(' One to One Meeting Selected Agents List::::' + JSON.stringify(this.selectedAgents));
      }
      else {
        const finSummRec = this.Agents.find(x => x.id === this.confirmed[0].id);
        this.confirmed = [];
        this.confirmed.push(finSummRec);
        this.selectedAgents.push($event[0].id);
        this.AgentSelectedList.emit(this.selectedAgents.toString());        
        alert('Agent Can`t Select More then one - Because Meeting Type is One-to-One');
        console.log('Agent Can`t Select More then one - Because Meeting Type is One-to-One::' + JSON.stringify(this.confirmed));

      }
    }
    else {
      for (let i = 0; i < $event.length; i++) {
        this.selectedAgents.push($event[i].id);
      }
      this.AgentSelectedList.emit(this.selectedAgents.toString());
      console.log('Meeting Selected Agents List::::' + JSON.stringify(this.selectedAgents));
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

