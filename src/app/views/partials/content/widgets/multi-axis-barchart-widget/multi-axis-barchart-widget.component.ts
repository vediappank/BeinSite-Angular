import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {  AuthService } from '../../../../../core/auth';
import { BillableDetailComponent } from '../../../../pages/dashboard/billable-detail/billable-detail.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'kt-multi-axis-barchart-widget',
  templateUrl: './multi-axis-barchart-widget.component.html',
  styleUrls: ['./multi-axis-barchart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiAxisBarchartWidgetComponent implements OnInit, OnChanges {

  @Input() public data: any;

  public finReptWidgetData :any;
  constructor(public dialog: MatDialog) { 
    am4core.options.commercialLicense = true;
  }

  ngOnInit() {   
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          const finReptData = change.currentValue;  
          this.finReptWidgetData = change.currentValue;   
          console.log('multi axix Agent Time Widget Chart Data Changes::::' + JSON.stringify(this.finReptWidgetData));
          let chart = am4core.create("chartdivs", am4charts.XYChart);
          chart.data = finReptData;
          // Create axes
          let MONTHAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          MONTHAxis.dataFields.category = "MONTH";
          MONTHAxis.renderer.grid.template.location = 0;
          MONTHAxis.renderer.minGridDistance = 20;
          MONTHAxis.renderer.cellStartLocation = 0.1;
          MONTHAxis.renderer.cellEndLocation = 0.9;
          let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis1.title.text = "Duration";
          // Create series
          let series2 = chart.series.push(new am4charts.ColumnSeries());
          series2.dataFields.valueY = "Billable";
          series2.dataFields.categoryX = "MONTH";
          series2.yAxis = valueAxis1;
          series2.name = "Billable (Hrs)";
          series2.tooltipText = "{name}\n[bold font-size: 20]{valueY}";
          series2.fill = am4core.color("#28a745");
          series2.strokeWidth = 0;
          series2.stacked = true;
          series2.columns.template.width = am4core.percent(60);
          series2.columns.template.events.on("hit", this.billablepopupInfo, this);

           //show the values over the bar
           var valueLabel = series2.bullets.push(new am4charts.LabelBullet());
           valueLabel.label.text = "{Billable} Hrs";
           valueLabel.label.fontWeight = "500";
           valueLabel.label.fill = am4core.color("#FFF");
           valueLabel.label.hideOversized = true;
           valueLabel.label.events.on("hit", this.billablepopupInfo, this);
           valueLabel.label.adapter.add("verticalCenter", function (center, target) {
             if (!target.dataItem) {
               return center;
             }
             var values = target.dataItem.values;
             return values.valueY.value > values.openValueY.value ? "top" : "top";
           });

          
          let series1 = chart.series.push(new am4charts.ColumnSeries());
          series1.dataFields.valueY = "Unbillable";
          series1.dataFields.categoryX = "MONTH";
          series1.yAxis = valueAxis1;
          series1.name = "Non Billable (Hrs)";
          series1.tooltipText = "{name}\n[bold font-size: 20]{valueY}";
          series1.fill = am4core.color("#F51B00");
          series1.columns.template.width = am4core.percent(60);
          series1.columns.template.column.cornerRadiusTopLeft = 10;
          series1.columns.template.column.cornerRadiusTopRight = 10;
          series1.strokeWidth = 0;
          series1.stacked = true;
          series1.toBack();
          series1.columns.template.events.on("hit", this.billablepopupInfo, this);

          var valueLabel = series1.bullets.push(new am4charts.LabelBullet());
          valueLabel.label.text = "{Unbillable} Hrs";
          valueLabel.label.fontWeight = "500";
          valueLabel.label.fill = am4core.color("#FFF");
          valueLabel.label.hideOversized = true;
          valueLabel.label.events.on("hit", this.billablepopupInfo, this);
          valueLabel.label.adapter.add("verticalCenter", function (center, target) {
            if (!target.dataItem) {
              return center;
            }
            var values = target.dataItem.values;
            return values.valueY.value > values.openValueY.value ? "top" : "top";
          });

          
          let series3 = chart.series.push(new am4charts.LineSeries());
          series3.dataFields.valueY = "PotentialBillableDuration";
          series3.dataFields.categoryX = "MONTH";
          series3.name = "Potential (Hrs)";
          series3.strokeWidth = 2;
          series3.tensionX = 0.7;
          series3.yAxis = valueAxis1;
          series3.fill = am4core.color("#6f42c1");
          series3.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";


          let bullet3 = series3.bullets.push(new am4charts.CircleBullet());
          bullet3.circle.radius = 3;
          bullet3.circle.strokeWidth = 2;
          bullet3.circle.fill = am4core.color("#6f42c1");        

          // Add cursor
          chart.cursor = new am4charts.XYCursor();
          // Add legend
          chart.legend = new am4charts.Legend();
          chart.legend.position = "top";

            //Disable Grid
            MONTHAxis.renderer.grid.template.disabled = true;
            valueAxis1.renderer.grid.template.disabled = true;
            //valueAxis.renderer.grid.template.disabled = true
        }
      }
    }
  }
  
  billablepopupInfo(event) {    
    const dialogRef = this.dialog.open(BillableDetailComponent, { data: { inputs: this.finReptWidgetData} });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}
