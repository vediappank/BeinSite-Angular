import { Component, OnInit, Input } from '@angular/core';

@ Component({
  selector: 'mya-stats-detail',
  templateUrl: './stats-detail.component.html',
  styleUrls: ['./stats-detail.component.scss']
})
export class StatsDetailComponent implements OnInit {

  @ Input() statsName: string;
  @ Input() aStatsVal: string;
  @ Input() tStatsVal: string;
  @ Input() fStatsVal: string;
  @ Input() cClass: string;
  @ Input() iconClass: string;

  constructor() { }

  ngOnInit() {
  }

}
