import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AgtTimeMgtWidgetDetailComponent } from '../../../../pages/dashboard/agt-time-mgt-widget-detail/agt-time-mgt-widget-detail.component';
import { MatDialog } from '@angular/material';
import { CCTimeMgtDetailRequest } from '../../../../pages/dashboard/_models/cctimemgtdetail.model';

export interface doungnuntData {
  AuxCode: string;
  AuxPer: number;
}

@Component({
  selector: 'kt-doughnut-chart-widget',
  templateUrl: './doughnut-chart-widget.component.html',
  styleUrls: ['./doughnut-chart-widget.component.scss']
})
export class DoughnutChartWidgetComponent implements OnInit, OnChanges {
  @Input() public inputs: CCTimeMgtDetailRequest;
  @Input() public data: doungnuntData[];
  dountchart: boolean;
  constructor(public dialog: MatDialog) {
    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {    
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          console.log('Bar Chart One Dataset Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));


          const result = change.currentValue.filter(row => row.AuxPer > 0);
          //if (result.length > 0) {
            const chart = am4core.create('Dchartdiv', am4charts.PieChart);
            // Add data
            chart.data = result;
            // Set inner radius
            chart.innerRadius = am4core.percent(50);
            // Add and configure Series
            const pieSeries = chart.series.push(new am4charts.PieSeries3D());
            pieSeries.dataFields.value = 'AuxPer';
            pieSeries.dataFields.category = 'AuxCode';
            pieSeries.slices.template.stroke = am4core.color('#fff');            
            pieSeries.slices.template.events.on("hit", this.ReasonCodeDetailpopupInfo, this);
            pieSeries.slices.template.strokeWidth = 2;
            pieSeries.slices.template.strokeOpacity = 1;
            pieSeries.slices.template.cornerRadius = 5;
            pieSeries.labels.template.text = "{category}: {value.value} %";
            pieSeries.slices.template.tooltipText = "{category}: {value.value} %";
            // This creates initial animation
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            pieSeries.hiddenState.properties.startAngle = -90;

            //  chart.legend = new am4charts.Legend();
          }
        //}
      }
    }
  }
  message: any;
  ReasonCodeDetailpopupInfo(events: any) {    
    this.message = events.target.dataItem.properties.category;
    const dialogRef = this.dialog.open(AgtTimeMgtWidgetDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}

