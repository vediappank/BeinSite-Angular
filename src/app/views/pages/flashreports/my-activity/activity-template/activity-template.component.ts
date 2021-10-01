import { Component, OnInit, Input } from '@angular/core';
import { AgentStatisticsRequest } from '../../model/agent-statistics-request.model';
import { AgentStatistics } from '../../model/agent-statistics.model';
import { AgentService } from '../../_services/agent.service';


@ Component({
  selector: 'myact-activity-template',
  templateUrl: './activity-template.component.html',
  styleUrls: ['./activity-template.component.scss']
})
export class ActivityTemplateComponent implements OnInit {

  @ Input() aInfo: AgentStatistics;
  @ Input() tInfo: AgentStatistics;
  @ Input() fInfo: AgentStatistics;

  constructor() { }

  ngOnInit() {
  }

}
