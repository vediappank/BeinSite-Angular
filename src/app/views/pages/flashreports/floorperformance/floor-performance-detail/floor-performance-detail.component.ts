import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-floor-performance-detail',
  templateUrl: './floor-performance-detail.component.html',
  styleUrls: ['./floor-performance-detail.component.scss']
})
export class FloorPerformanceDetailComponent implements OnInit {

  @ Input() statsName: string;
  @ Input() aStatsVal: string; 
  @ Input() cClass: string;
  @ Input() iconClass: string;
  @ Input() duration: string;

  

  constructor() { }

  ngOnInit() {
    
  }

 

}
