import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { StringUtilComponent } from '../../../../../helper-classes/string-util.component';
import { BarDetailwidgetComponent } from '../bar-detail-widget/bar-detail-widget.component';
import { CCFinanceRequest } from '../../../../pages/dashboard/_models/ccfinancerequest.model';
import { FinanceSummaryDetailComponent } from '../../../../pages/dashboard/finance-summary-detail/finance-summary-detail.component';

@Component({
  selector: 'kt-bar-line-mixed-chartjs-widget',
  templateUrl: './bar-line-mixed-chartjs-widget.component.html',
  styleUrls: ['./bar-line-mixed-chartjs-widget.component.scss']
})
export class BarLineMixedChartJSWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public title: string;
  @Input() public desc: string;
  @Input() public data: { labels: string[]; datasets: ChartDataSets[], dashboard_inputs: any };
  @Input() public dataType = 'number';

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public barChartOptions: ChartOptions;
  public inputsRequest: CCFinanceRequest;
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartLabels: Label[];
  public barChartLabels$ = new BehaviorSubject<any>(this.barChartLabels);
  public barChartData: ChartDataSets[];
  public barChartData$ = new BehaviorSubject<any>(this.barChartData);


  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.barChartLabels = [];
    this.barChartData = [
      {
        data: [], label: '',
        borderColor: 'rgba(68, 114, 196, 1)', backgroundColor: 'rgba(68, 114, 196, 0.9)', hoverBorderColor: 'rgba(68, 114, 196, 1)',
        hoverBackgroundColor: 'rgba(68, 114, 196, 0.9)', pointStyle: 'line'
      }
    ];
    this.reconfigureOptions(this.dataType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          console.log('Bar Chart One Dataset Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));
          this.barChartLabels = change.currentValue.labels;
          this.barChartData = change.currentValue.datasets;
          this.barChartLabels$.next(this.barChartLabels);
          this.barChartData$.next(this.barChartData);
        }
      } else if (propName === 'dataType') {
        const change = changes[propName];
        if (change.currentValue) {
          this.reconfigureOptions(change.currentValue);
        }
      }
    }
  }

  reconfigureOptions(dType: string) {
    if (dType === 'dollar' || dType === 'currency') {
      this.barChartOptions = {
        responsive: true,
        title: {
          display: false,
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
          callbacks: {
            title: (tooltipItems) => {
              let res = '';
              if (tooltipItems[0].xLabel) {
                const lab = tooltipItems[0].xLabel.toString().split('~');
                if (lab.length > 2) {
                  let weekNo: string = "";
                  if (lab[0].length > 0 && lab[0].length <= 2)
                    weekNo = 'Week No: ' + lab[0];
                  res = weekNo + '\nFrom: ' + StringUtilComponent.formatDate(lab[1])
                    + '\nTo: ' + StringUtilComponent.formatDate(lab[2]);

                } else {
                  res = StringUtilComponent.formatDate(lab[0]);
                }
              }
              return res;
            },
            label: (tooltipItem, data) => {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' +
                StringUtilComponent.convertToDollar(tooltipItem.value.toString());
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
            gridLines: { display: false },
            id: 'x-axis-1',
            position: 'bottom'
          }],
          yAxes: [{
            display: false,
            gridLines: { display: false },
            id: 'y-axis-1',
            position: 'right'
          },
          {
            display: false,
            gridLines: { display: false },
            id: 'y-axis-2',
            position: 'left'
          }
          ]
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
    } else {
      this.barChartOptions = {
        responsive: true,
        title: {
          display: false,
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
          callbacks: {
            title: (tooltipItems) => {
              return StringUtilComponent.formatDate(tooltipItems[0].xLabel.toString());
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
            gridLines: { display: false },
            id: 'x-axis-1',
            position: 'bottom'
          }],
          yAxes: [{
            display: false,
            gridLines: { display: false },
            id: 'y-axis-1',
            position: 'right'
          },
          {
            display: false,
            gridLines: { display: false },
            id: 'y-axis-2',
            position: 'left'
          }
          ]
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
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: { _index?: number }[] }): void {
    
    if (active && active.length > 0) {
      let DashboardInput: any;
      let LabelName: string;
      const labelIndex = active[0]._index;
      const CategoryName = this.title;
      console.log('CategoryName: ' + CategoryName);
      if (CategoryName == 'Transactions' || CategoryName == 'Revenue') {
        if (CategoryName == 'Transactions')
          LabelName = 'Total Transactions'
        else if (CategoryName === 'Revenue')
          LabelName = 'Total Revenue'
        const BarDateInput = this.data.labels[labelIndex];
        DashboardInput = this.data.dashboard_inputs;
        this.inputsRequest = {
          repStartDate: BarDateInput.split('~')[1], repEndDate: BarDateInput.split('~')[2], RoleID: DashboardInput.RoleID,
          callcenter: DashboardInput.callcenter, dayorweek: DashboardInput.dayorweek, GroupBy:'Agent'
        }
        console.log('Finance Detail Reports  inputs: ' + JSON.stringify(this.inputsRequest));
        const dialogRef = this.dialog.open(FinanceSummaryDetailComponent, { data: { inputs: this.inputsRequest,repInput: LabelName+  ' From ' +BarDateInput.split('~')[1]+ ' To '+ BarDateInput.split('~')[2] } });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
        });
      }
    }
  }

}

