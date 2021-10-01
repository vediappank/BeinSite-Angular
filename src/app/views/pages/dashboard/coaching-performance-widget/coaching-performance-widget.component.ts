import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';

@Component({
  selector: 'kt-coaching-performance-widget',
  templateUrl: './coaching-performance-widget.component.html',
  styleUrls: ['./coaching-performance-widget.component.scss']
})
export class CoachingPerformanceWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public popupData: any;

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();
  public finReptWidgetData: {
    summary?: Widget1Data[]; summary1?: Widget1Data[]; summary2?: Widget1Data[];
    transData?: { labels: string[]; datasets: ChartDataSets[] };
    revData?: { labels: string[]; datasets: ChartDataSets[] };
  };
  public finReptWidgetData$ = new BehaviorSubject<any>(this.finReptWidgetData);

  constructor() { }

  ngOnInit() {
    // this.finReptWidgetData = {summary: []};
    // this.finReptWidgetData$.next(this.finReptWidgetData);
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          const finReptData = change.currentValue;
          console.log('Coaching Performance Chart Data Changes in popup::::' + JSON.stringify(change.currentValue));
          const finSummRec = finReptData.find(x => x.Date === 'SUMMARY');
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [
            { title: 'Assigned Course', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(10), valueClass: 'kt-font-primary' },
            { title: 'Completed Course', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(20), valueClass: 'kt-font-primary' },
            { title: 'Avg Quiz Score', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(30), valueClass: 'kt-font-primary' },
            { title: 'Avg Quiz Duration',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(40), valueClass: 'kt-font-primary' }
            
          ];
          this.finReptWidgetData.summary1 = [
            { title: '% of Pass', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(50), valueClass: 'kt-font-primary' },
            { title: 'Verint Coaching Sessions Count ', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(60), valueClass: 'kt-font-primary' },
            { title: 'Count of Agents Not Coached in Verint ',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(70), valueClass: 'kt-font-primary' },
            { title: '% of Verint Coaching Completed',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(80), valueClass: 'kt-font-primary' }
          ];
          

          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

}
