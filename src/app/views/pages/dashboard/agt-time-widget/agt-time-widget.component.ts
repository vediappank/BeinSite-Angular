import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { doungnuntData } from '../../../partials/content/widgets/_model/doungdata.model';
import { TimeMgtModel } from '../../../partials/content/widgets/_model/timemgt.model';
import { CCTimeMgtDetailRequest } from '../_models/cctimemgtdetail.model';

@Component({
  selector: 'kt-agt-time-widget',
  templateUrl: './agt-time-widget.component.html',
  styleUrls: ['./agt-time-widget.component.scss']
})
export class AgtTimeWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public popupData: any;
  @Input() public inputs: CCTimeMgtDetailRequest;
  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public finReptWidgetData: {
    summary?: TimeMgtModel[]; doughnut?: doungnuntData[]; agentEvalData?: { labels: string[]; datasets: ChartDataSets[] };
    evalData?: { labels: string[]; datasets: ChartDataSets[] }
  };
  public finReptWidgetData$ = new BehaviorSubject<any>(this.finReptWidgetData);

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          const finReptData = change.currentValue;
          console.log('Agent Time Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [];
          this.finReptWidgetData.doughnut = [];

          finReptData.map(item => {
            this.finReptWidgetData.summary.push({
              AuxCode: item.AuxCode,
              AvgDuration: item.AvgDuration,
              AuxPer: item.AuxPer,
              TotalDuration: item.TotalDuration,
              valueClass: 'kt-font-primary'
            });            
              if (item.AuxCode !== 'Logged On') {
                this.finReptWidgetData.doughnut.push({
                  AuxCode: item.AuxCode,
                  AuxPer: item.AuxPer
                });
              }
            
          });
          // console.log('finReptWidgetData.summary :::' + JSON.stringify(this.finReptWidgetData.summary));
          // console.log('finReptWidgetData.doughnut :::' + JSON.stringify(this.finReptWidgetData.doughnut));
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

  // GetPopupInfo(event) {
  //   const dialogRef = this.dialog.open(QualityDetailComponent, { data: { inputs:this.popupData} });
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (!res) {
  //       return;
  //     }
  //   });
  // }

}
