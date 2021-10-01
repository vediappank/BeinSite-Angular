import { Component, OnInit, Input, SimpleChanges, AfterViewInit, NgZone, OnChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { MatDialog } from '@angular/material';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'kt-multibar-line-call-metrics-charts',
  templateUrl: './multibar-line-call-metrics-charts.component.html',
  styleUrls: ['./multibar-line-call-metrics-charts.component.scss']
})
export class MultibarLineCallMetricsChartsComponent implements OnInit {
  @Input() public data: any;  
  public finReptWidgetData: any;

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
              this.finReptWidgetData = change.currentValue;
              console.log('loadCallMetricsData Reports Data::::' + JSON.stringify(this.finReptWidgetData));
              this.loadCallMetricsData(this.finReptWidgetData);
        }
      }
    }
  }



 

  loadCallMetricsData(reportdata: any) {
    let chart = am4core.create("CallMetrics", am4charts.XYChart);
    // Add data
    //chart.data = [{"year": "2019","week":"Week 1-2019","StartDate":"1/1/2019 12:00:00 AM","EndDate":"1/5/2019 11:59:59 PM","ActiveCount":537,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 2-2019","StartDate":"1/6/2019 12:00:00 AM","EndDate":"1/12/2019 11:59:59 PM","ActiveCount":532,"JoinedCount":18,"LeftCount":3,"LeftPer":0.56},{"year": "2019","week":"Week 3-2019","StartDate":"1/13/2019 12:00:00 AM","EndDate":"1/19/2019 11:59:59 PM","ActiveCount":531,"JoinedCount":0,"LeftCount":1,"LeftPer":0.19},{"year": "2019","week":"Week 4-2019","StartDate":"1/20/2019 12:00:00 AM","EndDate":"1/26/2019 11:59:59 PM","ActiveCount":530,"JoinedCount":0,"LeftCount":1,"LeftPer":0.19},{"year": "2019","week":"Week 5-2019","StartDate":"1/27/2019 12:00:00 AM","EndDate":"2/2/2019 11:59:59 PM","ActiveCount":521,"JoinedCount":1,"LeftCount":9,"LeftPer":1.73},{"year": "2019","week":"Week 6-2019","StartDate":"2/3/2019 12:00:00 AM","EndDate":"2/9/2019 11:59:59 PM","ActiveCount":521,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 7-2019","StartDate":"2/10/2019 12:00:00 AM","EndDate":"2/16/2019 11:59:59 PM","ActiveCount":509,"JoinedCount":16,"LeftCount":12,"LeftPer":2.36},{"year": "2019","week":"Week 8-2019","StartDate":"2/17/2019 12:00:00 AM","EndDate":"2/23/2019 11:59:59 PM","ActiveCount":506,"JoinedCount":0,"LeftCount":3,"LeftPer":0.59},{"year": "2019","week":"Week 9-2019","StartDate":"2/24/2019 12:00:00 AM","EndDate":"3/2/2019 11:59:59 PM","ActiveCount":500,"JoinedCount":0,"LeftCount":6,"LeftPer":1.2},{"year": "2019","week":"Week 10-2019","StartDate":"3/3/2019 12:00:00 AM","EndDate":"3/9/2019 11:59:59 PM","ActiveCount":496,"JoinedCount":0,"LeftCount":2,"LeftPer":0.4},{"year": "2019","week":"Week 11-2019","StartDate":"3/10/2019 12:00:00 AM","EndDate":"3/16/2019 11:59:59 PM","ActiveCount":493,"JoinedCount":0,"LeftCount":2,"LeftPer":0.41},{"year": "2019","week":"Week 12-2019","StartDate":"3/17/2019 12:00:00 AM","EndDate":"3/23/2019 11:59:59 PM","ActiveCount":491,"JoinedCount":0,"LeftCount":1,"LeftPer":0.2},{"year": "2019","week":"Week 13-2019","StartDate":"3/24/2019 12:00:00 AM","EndDate":"3/30/2019 11:59:59 PM","ActiveCount":489,"JoinedCount":0,"LeftCount":2,"LeftPer":0.41},{"year": "2019","week":"Week 14-2019","StartDate":"3/31/2019 12:00:00 AM","EndDate":"4/6/2019 11:59:59 PM","ActiveCount":485,"JoinedCount":0,"LeftCount":3,"LeftPer":0.62},{"year": "2019","week":"Week 15-2019","StartDate":"4/7/2019 12:00:00 AM","EndDate":"4/13/2019 11:59:59 PM","ActiveCount":484,"JoinedCount":0,"LeftCount":1,"LeftPer":0.21},{"year": "2019","week":"Week 16-2019","StartDate":"4/14/2019 12:00:00 AM","EndDate":"4/20/2019 11:59:59 PM","ActiveCount":480,"JoinedCount":0,"LeftCount":3,"LeftPer":0.63},{"year": "2019","week":"Week 17-2019","StartDate":"4/21/2019 12:00:00 AM","EndDate":"4/27/2019 11:59:59 PM","ActiveCount":478,"JoinedCount":0,"LeftCount":2,"LeftPer":0.42},{"year": "2019","week":"Week 18-2019","StartDate":"4/28/2019 12:00:00 AM","EndDate":"5/4/2019 11:59:59 PM","ActiveCount":477,"JoinedCount":6,"LeftCount":1,"LeftPer":0.21},{"year": "2019","week":"Week 19-2019","StartDate":"5/5/2019 12:00:00 AM","EndDate":"5/11/2019 11:59:59 PM","ActiveCount":476,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 20-2019","StartDate":"5/12/2019 12:00:00 AM","EndDate":"5/18/2019 11:59:59 PM","ActiveCount":458,"JoinedCount":0,"LeftCount":18,"LeftPer":3.93},{"year": "2019","week":"Week 21-2019","StartDate":"5/19/2019 12:00:00 AM","EndDate":"5/25/2019 11:59:59 PM","ActiveCount":455,"JoinedCount":0,"LeftCount":3,"LeftPer":0.66},{"year": "2019","week":"Week 22-2019","StartDate":"5/26/2019 12:00:00 AM","EndDate":"6/1/2019 11:59:59 PM","ActiveCount":450,"JoinedCount":1,"LeftCount":5,"LeftPer":1.11},{"year": "2019","week":"Week 23-2019","StartDate":"6/2/2019 12:00:00 AM","EndDate":"6/8/2019 11:59:59 PM","ActiveCount":450,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 24-2019","StartDate":"6/9/2019 12:00:00 AM","EndDate":"6/15/2019 11:59:59 PM","ActiveCount":450,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 25-2019","StartDate":"6/16/2019 12:00:00 AM","EndDate":"6/22/2019 11:59:59 PM","ActiveCount":438,"JoinedCount":0,"LeftCount":12,"LeftPer":2.74},{"year": "2019","week":"Week 26-2019","StartDate":"6/23/2019 12:00:00 AM","EndDate":"6/29/2019 11:59:59 PM","ActiveCount":434,"JoinedCount":0,"LeftCount":1,"LeftPer":0.23},{"year": "2019","week":"Week 27-2019","StartDate":"6/30/2019 12:00:00 AM","EndDate":"7/6/2019 11:59:59 PM","ActiveCount":431,"JoinedCount":10,"LeftCount":1,"LeftPer":0.23},{"year": "2019","week":"Week 28-2019","StartDate":"7/7/2019 12:00:00 AM","EndDate":"7/13/2019 11:59:59 PM","ActiveCount":431,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 29-2019","StartDate":"7/14/2019 12:00:00 AM","EndDate":"7/20/2019 11:59:59 PM","ActiveCount":428,"JoinedCount":0,"LeftCount":1,"LeftPer":0.23},{"year": "2019","week":"Week 30-2019","StartDate":"7/21/2019 12:00:00 AM","EndDate":"7/27/2019 11:59:59 PM","ActiveCount":428,"JoinedCount":3,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 31-2019","StartDate":"7/28/2019 12:00:00 AM","EndDate":"8/3/2019 11:59:59 PM","ActiveCount":349,"JoinedCount":0,"LeftCount":79,"LeftPer":22.64},{"year": "2019","week":"Week 32-2019","StartDate":"8/4/2019 12:00:00 AM","EndDate":"8/10/2019 11:59:59 PM","ActiveCount":349,"JoinedCount":20,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 33-2019","StartDate":"8/11/2019 12:00:00 AM","EndDate":"8/17/2019 11:59:59 PM","ActiveCount":348,"JoinedCount":1,"LeftCount":1,"LeftPer":0.29},{"year": "2019","week":"Week 34-2019","StartDate":"8/18/2019 12:00:00 AM","EndDate":"8/24/2019 11:59:59 PM","ActiveCount":343,"JoinedCount":0,"LeftCount":5,"LeftPer":1.46},{"year": "2019","week":"Week 35-2019","StartDate":"8/25/2019 12:00:00 AM","EndDate":"8/31/2019 11:59:59 PM","ActiveCount":337,"JoinedCount":0,"LeftCount":3,"LeftPer":0.89},{"year": "2019","week":"Week 36-2019","StartDate":"9/1/2019 12:00:00 AM","EndDate":"9/7/2019 11:59:59 PM","ActiveCount":332,"JoinedCount":0,"LeftCount":4,"LeftPer":1.2},{"year": "2019","week":"Week 37-2019","StartDate":"9/8/2019 12:00:00 AM","EndDate":"9/14/2019 11:59:59 PM","ActiveCount":331,"JoinedCount":0,"LeftCount":1,"LeftPer":0.3},{"year": "2019","week":"Week 38-2019","StartDate":"9/15/2019 12:00:00 AM","EndDate":"9/21/2019 11:59:59 PM","ActiveCount":326,"JoinedCount":19,"LeftCount":5,"LeftPer":1.53},{"year": "2019","week":"Week 39-2019","StartDate":"9/22/2019 12:00:00 AM","EndDate":"9/28/2019 11:59:59 PM","ActiveCount":325,"JoinedCount":1,"LeftCount":1,"LeftPer":0.31},{"year": "2019","week":"Week 40-2019","StartDate":"9/29/2019 12:00:00 AM","EndDate":"10/5/2019 11:59:59 PM","ActiveCount":319,"JoinedCount":12,"LeftCount":5,"LeftPer":1.57},{"year": "2019","week":"Week 41-2019","StartDate":"10/6/2019 12:00:00 AM","EndDate":"10/12/2019 11:59:59 PM","ActiveCount":317,"JoinedCount":0,"LeftCount":2,"LeftPer":0.63},{"year": "2019","week":"Week 42-2019","StartDate":"10/13/2019 12:00:00 AM","EndDate":"10/19/2019 11:59:59 PM","ActiveCount":316,"JoinedCount":0,"LeftCount":1,"LeftPer":0.32},{"year": "2019","week":"Week 43-2019","StartDate":"10/20/2019 12:00:00 AM","EndDate":"10/26/2019 11:59:59 PM","ActiveCount":310,"JoinedCount":16,"LeftCount":6,"LeftPer":1.94},{"year": "2019","week":"Week 44-2019","StartDate":"10/27/2019 12:00:00 AM","EndDate":"11/2/2019 11:59:59 PM","ActiveCount":296,"JoinedCount":48,"LeftCount":14,"LeftPer":4.73},{"year": "2019","week":"Week 45-2019","StartDate":"11/3/2019 12:00:00 AM","EndDate":"11/9/2019 11:59:59 PM","ActiveCount":290,"JoinedCount":1,"LeftCount":6,"LeftPer":2.07},{"year": "2019","week":"Week 46-2019","StartDate":"11/10/2019 12:00:00 AM","EndDate":"11/16/2019 11:59:59 PM","ActiveCount":289,"JoinedCount":0,"LeftCount":1,"LeftPer":0.35},{"year": "2019","week":"Week 47-2019","StartDate":"11/17/2019 12:00:00 AM","EndDate":"11/23/2019 11:59:59 PM","ActiveCount":287,"JoinedCount":0,"LeftCount":2,"LeftPer":0.7},{"year": "2019","week":"Week 48-2019","StartDate":"11/24/2019 12:00:00 AM","EndDate":"11/30/2019 11:59:59 PM","ActiveCount":285,"JoinedCount":0,"LeftCount":2,"LeftPer":0.7},{"year": "2019","week":"Week 49-2019","StartDate":"12/1/2019 12:00:00 AM","EndDate":"12/7/2019 11:59:59 PM","ActiveCount":285,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 50-2019","StartDate":"12/8/2019 12:00:00 AM","EndDate":"12/14/2019 11:59:59 PM","ActiveCount":285,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 51-2019","StartDate":"12/15/2019 12:00:00 AM","EndDate":"12/21/2019 11:59:59 PM","ActiveCount":285,"JoinedCount":1,"LeftCount":0,"LeftPer":0},{"year": "2019","week":"Week 52-2019","StartDate":"12/22/2019 12:00:00 AM","EndDate":"12/28/2019 11:59:59 PM","ActiveCount":285,"JoinedCount":0,"LeftCount":0,"LeftPer":0},{"year":99999,"week":"Week 99999-99999","StartDate":"1/1/2019 12:00:00 AM","EndDate":"12/31/2019 12:00:00 AM","ActiveCount":285,"JoinedCount":174,"LeftCount":252,"LeftPer":88.42}];
    console.log('loadCallMetricsData:::::' + JSON.stringify(this.loadCallMetricsData))
    chart.data = reportdata;
    chart.colors.list = [
      am4core.color("orange"),
      am4core.color("green"),
      am4core.color("blueviolet"),
      am4core.color("yellow"),
      am4core.color("purple"),
      am4core.color("red")

    ];
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "week";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.dx = -25;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.labels.template.fontWeight = "500";

    //Agents Count Axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Agents Calls Count(#)";
    valueAxis.extraMax = 0.1;
    //Agent Left Axis
    var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.title.text = "PCA (%)";
    valueAxis2.renderer.opposite = true;
    valueAxis2.renderer.grid.template.disabled = true;



    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.columns.template.tooltipY = 0;
      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.dataFields.categoryX = "week";
      series.name = name;
      // series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color("#341E6C");
      if(field =="Forecast")
      {
         series.tooltipHTML = `
        
       <table style="color:white; " >
       <tr>
         <td align="left">Forecast : </td>
         <td >{Forecast}</td>
       </tr>
       <tr>
         <td align="left">IVR Offered: </td>
         <td >{IVROffered}</td>
       </tr>
       <tr>
         <td align="left">IVR Handled: </td>
         <td style="color:white;">{IVRHandled}</td>
       </tr>
       <tr>
         <td align="left">Agent Answered: </td>
         <td style="color:white;">{AgentAnswered}</td>
       </tr>
       <tr>
         <td align="left">Abandoned: </td>
         <td style="color:white;">{Abandoned}</td>
       </tr>
       <tr>
         <td align="left">PCA (%): </td>
         <td style="color:white;">{PCAPer}</td>
       </tr>
       </table>
       `;
      }
      //Create the label on over the bar charts
      var valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{" + field + "}";
      valueLabel.label.fontWeight = "500";
      valueLabel.label.hideOversized = false;
      //valueLabel.label.events.on("hit", this.DetailpopupInfo, this);
      valueLabel.label.adapter.add("verticalCenter", function (center, target) {
        if (!target.dataItem) {
          return center;
        }
        var values = target.dataItem.values;
        return values.valueY.value > values.openValueY.value ? "bottom" : "bottom";
      });
    }
    createSeries("Forecast", "Forecast", false);
    createSeries("IVROffered", "IVR Offered", false);
    createSeries("IVRHandled", "IVR Handled", false);
    createSeries("AgentAnswered", "Agent Answered", false);
    createSeries("Abandoned", "Abandoned", false);
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "PCAPer";
    series2.dataFields.categoryX = "week";
    series2.name = "PCA (%)";
    series2.strokeWidth = 3;
    //series2.properties.stroke = am4core.color("#000");
    series2.yAxis = valueAxis2;
    let bullet3 = series2.bullets.push(new am4charts.CircleBullet());
    // series2.bullets.getIndex(0).tooltipText = "{name}: [bold]{valueY}[/]";
    bullet3.circle.radius = 3;
    bullet3.circle.strokeWidth = 2;
    //Disable Grid
    categoryAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis2.renderer.grid.template.disabled = true;
    // Add legend
    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomX";
  }
}
