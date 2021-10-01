import { Component, OnInit , Input, OnChanges} from '@angular/core';
import { AgentStatistics } from '../../model/agent-statistics.model';

@ Component({
  selector: 'app-floor-performance-template',
  templateUrl: './floor-performance-template.component.html',
  styleUrls: ['./floor-performance-template.component.scss']
})
export class FloorPerformanceTemplateComponent implements OnInit {

  

  @ Input() aInfo: AgentStatistics;
  
  // @ Input() tInfo: AgentStatistics;
  // @ Input() fInfo: AgentStatistics;

  constructor() { }

  ngOnInit() { }

}
