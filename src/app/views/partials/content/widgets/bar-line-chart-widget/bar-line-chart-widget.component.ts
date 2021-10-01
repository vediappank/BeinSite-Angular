import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AgtTimeMgtWidgetDetailComponent } from '../../../../pages/dashboard/agt-time-mgt-widget-detail/agt-time-mgt-widget-detail.component';
import { MatDialog } from '@angular/material';
import { CCTimeMgtDetailRequest } from '../../../../pages/dashboard/_models/cctimemgtdetail.model';


@Component({
  selector: 'kt-bar-line-chart-widget',
  templateUrl: './bar-line-chart-widget.component.html',
  styleUrls: ['./bar-line-chart-widget.component.scss']
})
export class BarLineChartWidgetComponent implements OnInit, OnChanges {

  @Input() public Chartdata: any;
  @Input() public data: any;
  @Input() public inputs: CCTimeMgtDetailRequest;
  dountchart: boolean;

  constructor(public dialog: MatDialog) {
    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      //if (propName === 'data') {
        if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          const finReptData = change.currentValue;

          console.log('Bar Chart Chartdata Data Changes::::' + JSON.stringify(this.Chartdata));

          console.log('Bar Chart One Dataset Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));
          let chart = am4core.create("TimeManagementChart", am4charts.XYChart);
          const chartData = finReptData.filter(x => x.AuxCode != 'Logged On');
          console.log('Chart Filter Data::::' + JSON.stringify(chartData));
          chart.scrollbarX = new am4core.Scrollbar();
          chart.scrollbarX.disabled = true;
          chart.data = chartData;
          chart.colors.list = [
            am4core.color("#9B30F0")
            // am4core.color("#FF0000"),
            // am4core.color("#FFFF00"),
            // am4core.color("#808000"),
            // am4core.color("#808080"),
            // am4core.color("#008000"),
            // am4core.color("#00FFFF"),
            // am4core.color("#008080"),
            // am4core.color("#0000FF"),
            // am4core.color("#000080"),
            // am4core.color("#FF00FF"),
            // am4core.color("#800080")
          ];
          // Create axes
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "AuxCode";
          categoryAxis.title.text = "Aux Code";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 60;
          categoryAxis.tooltip.disabled = false;


          // First value axis
          var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis1.title.text = "Avg Duration";
          valueAxis1.renderer.minWidth = 50;
          //valueAxis1.fill = am4core.color("red");
          valueAxis1.cursorTooltipEnabled = true;
        //  valueAxis1.propertyFields.fill = "#dc3545";
          valueAxis1.extraMax = 0.1;
          // Second value axis
          var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis2.title.text = "Aux (%)";
          valueAxis2.renderer.opposite = true;
          
         // valueAxis2.propertyFields.fill = "#dc3545";
          valueAxis2.renderer.grid.template.disabled = true;
          valueAxis2.extraMax = 0.1;
          // First series
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.sequencedInterpolation = true;
          series.dataFields.valueY = "AvgDuration";
          series.dataFields.categoryX = "AuxCode";
          series.hiddenInLegend = true;
          series.name = "Avg Duration (Hrs)";
          series.tooltipText = "{name}: [bold]{valueY}[/]";
          series.columns.template.strokeWidth = 0;
          series.tooltip.pointerOrientation = "vertical";
          series.columns.template.column.cornerRadiusTopLeft = 10;
          series.columns.template.column.cornerRadiusTopRight = 10;
         // series.columns.template.column.fillOpacity = 0.8;
          series.columns.template.events.on("hit", this.ReasonCodeDetailpopupInfo, this);

          let hoverState = series.columns.template.column.states.create("hover");
          hoverState.properties.cornerRadiusTopLeft = 10;
          hoverState.properties.cornerRadiusTopRight = 10;
          hoverState.properties.fillOpacity = 1;
          series.columns.template.adapter.add("fill", function (fill, target) {          
            return chart.colors.getIndex(0);
          })


          // Second series
          var series2 = chart.series.push(new am4charts.LineSeries());
          series2.dataFields.valueY = "AuxPer";
          series2.dataFields.categoryX = "AuxCode";
          series2.name = "Aux (%)";
          //Tooltip Background Color
          series2.fill = am4core.color("#000");
          series2.tooltipText = "{name}: [bold]{valueY}[/]";
          series2.strokeWidth = 3;        
          series2.yAxis = valueAxis2;
          //Line Color
          series2.properties.stroke = am4core.color("#000");
         
          let bullet3 = series2.bullets.push(new am4charts.CircleBullet());
          bullet3.circle.fill =  am4core.color("#000");
          bullet3.circle.radius = 3;
          bullet3.circle.strokeWidth = 2;

          //show the values over the bar
          var valueLabel = series.bullets.push(new am4charts.LabelBullet());
          valueLabel.label.text = "{AvgDuration} Hrs";
          valueLabel.label.fontWeight = "500";
          valueLabel.label.hideOversized = true;
          valueLabel.label.events.on("hit", this.ReasonCodeDetailpopupInfo, this);
          valueLabel.label.adapter.add("verticalCenter", function (center, target) {
            if (!target.dataItem) {
              return center;
            }
            var values = target.dataItem.values;
            return values.valueY.value > values.openValueY.value ? "top" : "top";
          });

          var valueLabel = series.bullets.push(new am4charts.LabelBullet());
          valueLabel.label.text = "{AuxPer} %";
          valueLabel.label.fontWeight = "500";
          valueLabel.label.hideOversized = true;
          valueLabel.label.events.on("hit", this.ReasonCodeDetailpopupInfo, this);
          valueLabel.label.adapter.add("verticalCenter", function (center, target) {
            if (!target.dataItem) {
              return center;
            }
            var values = target.dataItem.values;
            return values.valueY.value > values.openValueY.value ? "bottom" : "bottom";
          });


          //Disable Grid
          categoryAxis.renderer.grid.template.disabled = true;
          valueAxis1.renderer.grid.template.disabled = true
          // valueAxis2.renderer.grid.template.disabled = true
          // Cursor
          chart.cursor = new am4charts.XYCursor();
          chart.cursor.behavior = "zoomXY";

          // Add legend
             
            //  chart.legend = new am4charts.Legend();
            //  chart.legend.position = "top";
        }
      }
    }
  }

  message: any;
  ReasonCodeDetailpopupInfo(events: any) {
    this.message = events.target.dataItem.categoryX;
    const dialogRef = this.dialog.open(AgtTimeMgtWidgetDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }


}


