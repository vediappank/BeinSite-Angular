import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { StringUtilComponent } from '../../../../../helper-classes/string-util.component';

@Component({
  selector: 'kt-bchart-one-dscurr-widget',
  templateUrl: './bchart-one-dscurr-widget.component.html',
  styleUrls: ['./bchart-one-dscurr-widget.component.scss']
})
export class BChartOneDSCurrWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public title: string;
  @Input() public desc: string;
  @Input() public data: { labels: string[]; datasets: ChartDataSets[] };

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public barChartOptions: ChartOptions;
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartLabels: Label[];
  public barChartLabels$ = new BehaviorSubject<any>(this.barChartLabels);
  public barChartData: ChartDataSets[];
  public barChartData$ = new BehaviorSubject<any>(this.barChartData);

  constructor() {
    this.barChartOptions = {
      responsive: true,
      title: {
        display: false,
      },
      tooltips: {
        intersect: false,
        mode: 'nearest',
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
        callbacks: {
          title: (tooltipItems) => {
            // console.log('X Label:' + tooltipItems[0].xLabel );
            let res = '';            
            if ( tooltipItems[0].xLabel ) {
              const lab = tooltipItems[0].xLabel.toString().split('~');
              if (lab[0].length > 0 && lab[0].length <= 2){
                res = 'From: ' + StringUtilComponent.formatDate(lab[1])
                  + '\nTo: ' + StringUtilComponent.formatDate(lab[2]);
              } else {
                res = StringUtilComponent.formatDate(lab[0]);
              }
            }
            return res;
          },
          label: (tooltipItem, data) => {
            return StringUtilComponent.convertToDollar( tooltipItem.yLabel.toString() );
            // return '$' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        }
      },
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: false,
          gridLines: {display: false},
          stacked: true
        }],
        yAxes: [{
          display: false,
          stacked: true,
          gridLines: {display: false}
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    };
  }

  ngOnInit() {
    this.barChartLabels = [];
    this.barChartData = [
      { data: [ ], label: '',
        borderColor: 'rgba(68, 114, 196, 1)', backgroundColor: 'rgba(68, 114, 196, 0.9)', hoverBorderColor: 'rgba(68, 114, 196, 1)',
        hoverBackgroundColor: 'rgba(68, 114, 196, 0.9)', pointStyle: 'line' }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if ( change.currentValue ) {
          console.log('Bar Chart One Dataset Currency Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));
          this.barChartLabels = change.currentValue.labels;
          this.barChartData = change.currentValue.datasets;
          this.barChartLabels$.next(this.barChartLabels);
          this.barChartData$.next(this.barChartData);
        }
      }
    }
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {_index?: number}[] }): void {
    console.log(event, active);
    if ( active && active.length > 0 ) {
      const labelIndex = active[0]._index;
      console.log('Label: ' + this.barChartLabels[ labelIndex ] );
      this.parentComp.emit(this.barChartLabels[ labelIndex ].toString());
    }
  }

}

