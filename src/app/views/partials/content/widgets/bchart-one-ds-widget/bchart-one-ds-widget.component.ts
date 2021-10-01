import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { StringUtilComponent } from '../../../../../helper-classes/string-util.component';
import { MatDialog } from '@angular/material';
import { AbsentiesDetailComponent } from '../../../../pages/dashboard/absenties-detail/absenties-detail.component';
import { AbsentiesRequest } from '../../../../pages/reports/_models/absentiesreuest.model';
import { QualityDetailComponent } from '../../../../pages/dashboard/quality-detail/quality-detail.component';
import { CCQualityRequest } from '../../../../pages/dashboard/_models/ccqualityrequest.model';

@Component({
  selector: 'kt-bchart-one-ds-widget',
  templateUrl: './bchart-one-ds-widget.component.html',
  styleUrls: ['./bchart-one-ds-widget.component.scss']
})
export class BChartOneDSWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public title: string;
  @Input() public desc: string;
  @Input() public data: { labels: string[]; datasets: ChartDataSets[], dashboard_inputs: any };

  @Output() parentComp: EventEmitter<any> = new EventEmitter<any>();

  public Reportsinputs: AbsentiesRequest;
  public inputsRequest: CCQualityRequest;
  public barChartOptions: ChartOptions;
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartLabels: Label[];
  public barChartLabels$ = new BehaviorSubject<any>(this.barChartLabels);
  public barChartData: ChartDataSets[];
  public barChartData$ = new BehaviorSubject<any>(this.barChartData);

  constructor(public dialog: MatDialog) {
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
            let res = '';
            //console.log('Label Data:::' + tooltipItems[0].xLabel.toString());
            if (tooltipItems[0].xLabel) {
              const lab = tooltipItems[0].xLabel.toString().split('~');
              if (lab.length > 2) {
                let WeekNo: string = "";
                if (lab[0].length > 0 && lab[0].length <= 2)
                  WeekNo = 'Week No: ' + lab[0];
                res = WeekNo + '\nFrom: ' + StringUtilComponent.formatDate(lab[1])
                  + '\nTo: ' + StringUtilComponent.formatDate(lab[2]);

              } else {
                res = StringUtilComponent.formatDate(lab[0]);
              }
            }
            return res;
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
          stacked: true
        }],
        yAxes: [{
          display: false,
          stacked: true,
          gridLines: { display: false }
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
      {
        data: [], label: '',
        borderColor: 'rgba(68, 114, 196, 1)', backgroundColor: 'rgba(68, 114, 196, 0.9)', hoverBorderColor: 'rgba(68, 114, 196, 1)',
        hoverBackgroundColor: 'rgba(68, 114, 196, 0.9)', pointStyle: 'line'
      }
    ];
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
      }
    }
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: { _index?: number }[] }): void {   
    let DashboardInput: any;
    if (active && active.length > 0) {
      const labelIndex = active[0]._index;
      const CategoryName = this.title;
      console.log('CategoryName: ' + CategoryName);
      //const CategoryName = this.data.datasets[labelIndex].label;
      if (CategoryName == 'Agents - Evaluated' || CategoryName == 'Avg Evaluation Score') {

        const BarDateInput = this.data.labels[labelIndex];
        DashboardInput = this.data.dashboard_inputs;
        this.inputsRequest = {
          repStartDate: BarDateInput.split('~')[1], repEndDate: BarDateInput.split('~')[2], RoleID: DashboardInput.RoleID,
          callcenter: DashboardInput.callcenter, medialist:DashboardInput.medialist,dayorweek:DashboardInput.dayorweek,GroupBy:'Agent'
        }
        console.log('Quality '+CategoryName+' Bar Input Information: ' + JSON.stringify(this.Reportsinputs));        
        const dialogRef = this.dialog.open(QualityDetailComponent, { data: { inputs: this.inputsRequest, repInput: CategoryName+  ' From ' +BarDateInput.split('~')[1]+ ' To '+ BarDateInput.split('~')[2] } });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
        });
      }
      else if (CategoryName == 'Absence (%)') {
        const BarDateInput = this.data.labels[labelIndex];
        
        DashboardInput = this.data.dashboard_inputs;
        this.Reportsinputs = {
          repStartDate: BarDateInput.split('~')[1], repEndDate: BarDateInput.split('~')[2], RoleID: DashboardInput.RoleID,
          callcenter: DashboardInput.callcenter, GroupBy:'Agent', dayorweek:'Daily'
        }
        console.log('Absenties Bar Input Information: ' + JSON.stringify(this.Reportsinputs));
        console.log('Bar chart Label: ' + DashboardInput);
        const dialogRef = this.dialog.open(AbsentiesDetailComponent, { data: { inputs: this.Reportsinputs, repInput: '% Absence From ' +BarDateInput.split('~')[1]+ ' To '+ BarDateInput.split('~')[2]  } });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
        });
      }
    }
  }
}


