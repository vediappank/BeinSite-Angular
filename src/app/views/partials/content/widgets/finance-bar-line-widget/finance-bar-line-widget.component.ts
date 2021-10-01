import { Component, OnInit, Input, ElementRef, ViewChild, SimpleChanges, Output, EventEmitter, AfterViewInit, NgZone, OnChanges } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AgtTimeMgtWidgetDetailComponent } from '../../../../pages/dashboard/agt-time-mgt-widget-detail/agt-time-mgt-widget-detail.component';
import { MatDialog } from '@angular/material';
import { CCFinanceRequest } from '../../../../pages/dashboard/_models/ccfinancerequest.model';
import { FinanceSummaryDetailComponent } from '../../../../pages/dashboard/finance-summary-detail/finance-summary-detail.component';

@Component({
  selector: 'kt-finance-bar-line-widget',
  templateUrl: './finance-bar-line-widget.component.html',
  styleUrls: ['./finance-bar-line-widget.component.scss']
})
export class FinanceBarLineWidgetComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public Chartdata: any;
  @Input() public Chartinput: any;
  // @Input() public data: any;
  @Input() public title: string;
  @Input() public desc: string;
  @Input() public inputs: CCFinanceRequest;
  public Detailsinputs: CCFinanceRequest;
  dountchart: boolean;

  public chartNum: number;
  public chartDivName: string;
  public canChartLoad = false;
  constructor(public dialog: MatDialog, private zone: NgZone) {
    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
  }

  ngOnInit() {
    let min = 1;
    let max = 5000;
    this.chartNum = Math.floor(Math.random() * (max - min + 1)) + min;
    this.chartDivName = "FinWidgetChart" + this.chartNum;

  }
  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.canChartLoad = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'Chartdata' || propName === '') {
        let chartDataCollection: any;
        let chartDataInput: any;
        const change = changes[propName];
        if (change.currentValue) {
          chartDataCollection = change.currentValue;
          chartDataInput = this.Chartinput;
          if (this.canChartLoad) {
            this.getChartdata(chartDataCollection, chartDataInput)
          } else {
            // to display back the body content
            setTimeout(() => {
              this.getChartdata(chartDataCollection, chartDataInput);
            }, 1500);
          }
        }
      }
    }
  }

  getChartdata(chartrecords: any, chartinput: any) {
    let chart = am4core.create(this.chartDivName, am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.disabled = true;
    chart.data = chartrecords;
    chart.colors.list = [
      am4core.color("#9B30F0")
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
    categoryAxis.dataFields.category = "CategoryColumn";
    //categoryAxis.title.text ="{CategoryColumn}";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.renderer.labels.template.fontWeight = "500";
    categoryAxis.renderer.inside = false;


    // First value axis
    var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = "{ValueCoulmn}";
    valueAxis1.cursorTooltipEnabled = true;
    valueAxis1.extraMax = 0.1;
    valueAxis1.min = 0;

    // Second value axis
    var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    //valueAxis2.title.text = "Conversation Rate ($)";
    valueAxis2.renderer.opposite = true;
    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.extraMax = 0.1;

    // First series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ValueCoulmn";
    series.dataFields.categoryX = "CategoryColumn";
    series.hiddenInLegend = true;
    series.name = "Transactions ($)";
    series.tooltipText = "{name}: [bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    //series.columns.template.column.fillOpacity = 0.8;
    series.columns.template.events.on("hit", this.FinancepopupInfo, this);
    series.columns.template.showTooltipOn = "always";

    // Second series
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "LineCoulmn";
    series2.dataFields.categoryX = "CategoryColumn";
    series2.strokeWidth = 3;
    series2.yAxis = valueAxis2;
    //Line Color
    series2.properties.stroke = am4core.color("#000");
    let bullet3 = series2.bullets.push(new am4charts.CircleBullet());
    bullet3.circle.fill = am4core.color("#000");
    bullet3.circle.radius = 3;
    bullet3.circle.strokeWidth = 2;

    //show the values over the bar
    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    if (this.title == 'Transactions')
    valueLabel.label.text = "{ValueCoulmn} ";
    else
    valueLabel.label.text = "{ValueCoulmn} $";
    valueLabel.label.fontWeight = "500";
    valueLabel.label.hideOversized = true;
    valueLabel.label.events.on("hit", this.FinancepopupInfo, this);
    valueLabel.label.adapter.add("verticalCenter", function (center, target) {
      if (!target.dataItem) {
        return center;
      }
      var values = target.dataItem.values;
      return values.valueY.value > values.openValueY.value ? "top" : "top";
    });
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color("#341E6C");
    series.tooltip.events.on("hit", this.FinancepopupInfo, this);

    console.log('Chartdata:::::' + JSON.stringify(this.Chartdata));
    if (this.title == 'Transactions') {
      if (chartinput.dayorweek == "Weekly") {
        series.tooltipHTML = ``;
        series.tooltipHTML = `
    <center style="color:white; font-weight:bold;"><strong>{ToolTipHeader} (#): {valueY} </strong></center>    
    <table style="color:white; " >
    <tr>
    <td align="left"><strong>{ToolTipHeader1} : </strong></td>
    <td ><strong>{LineCoulmn}</strong></td>
  </tr>
    <tr>
      <td align="left">Week: </td>
      <td >{Date}</td>
    </tr>
    <tr>
      <td align="left">From Date: </td>
      <td style="color:white;">{FromDate}</td>
    </tr>
    <tr>
      <td align="left">To Date: </td>
      <td style="color:white;">{ToDate}</td>
    </tr>
    
    </table>
    `;
      }
      else {
        series.tooltipHTML = ``;
        series.tooltipHTML = `
      <center style="color:white; font-weight:bold;"><strong>{ToolTipHeader} (#): {valueY} </strong></center>      
      <table style="color:white; " >
      <tr>
      <td align="left"><strong>{ToolTipHeader1} : </strong></td>
      <td ><strong>{LineCoulmn}</strong></td>
    </tr>
      <tr>
        <td align="left">Date: </td>
        <td >{Date}</td>
      </tr>
      <tr style='visibility:collapse'>
        <td align="left">From Date: </td>
        <td style="color:white;">{FromDate}</td>
      </tr>
      <tr style='visibility:collapse'>
        <td align="left">To Date: </td>
        <td style="color:white;">{ToDate}</td>
      </tr>
      </table>
      `;
      }
    }
    else {
      if (chartinput.dayorweek == "Weekly") {
        series.tooltipHTML = ``;
        series.tooltipHTML = `
  <center style="color:white; font-weight:bold;"><strong>{ToolTipHeader} ($): {valueY} </strong></center>    
  <table style="color:white; " >
  <tr>
  <td align="left"><strong>{ToolTipHeader1}: </strong></td>
  <td ><strong>{LineCoulmn}</strong></td>
</tr>
  <tr>
    <td align="left">Week: </td>
    <td >{Date}</td>
  </tr>
  <tr>
    <td align="left">From Date: </td>
    <td style="color:white;">{FromDate}</td>
  </tr>
  <tr>
    <td align="left">To Date: </td>
    <td style="color:white;">{ToDate}</td>
  </tr>
  
  </table>
  `;
      }
      else {
        series.tooltipHTML = ``;
        series.tooltipHTML = `
    <center style="color:white; font-weight:bold;"><strong>{ToolTipHeader} ($): {valueY} </strong></center>      
    <table style="color:white; " >
    <tr>
    <td align="left"><strong>{ToolTipHeader1} : </strong></td>
    <td ><strong>{LineCoulmn}</strong></td>
  </tr>
    <tr>
      <td align="left">Date: </td>
      <td >{Date}</td>
    </tr>
    <tr style='visibility:collapse'>
      <td align="left">From Date: </td>
      <td style="color:white;">{FromDate}</td>
    </tr>
    <tr style='visibility:collapse'>
      <td align="left">To Date: </td>
      <td style="color:white;">{ToDate}</td>
    </tr>
    </table>
    `;
      }
    }
    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{LineCoulmn} ";
    valueLabel.label.fontWeight = "500";
    valueLabel.label.hideOversized = true;
    valueLabel.label.events.on("hit", this.FinancepopupInfo, this);
    valueLabel.label.adapter.add("verticalCenter", function (center, target) {
      if (!target.dataItem) {
        return center;
      }
      var values = target.dataItem.values;
      return values.valueY.value > values.openValueY.value ? "bottom" : "bottom";
    });

    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 10;
    hoverState.properties.cornerRadiusTopRight = 10;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(0);
    })





    //Disable Grid
    categoryAxis.renderer.grid.template.disabled = true;
    valueAxis1.renderer.grid.template.disabled = true
    // valueAxis2.renderer.grid.template.disabled = true
    // Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomXY";

    // Add legend

     // chart.legend = new am4charts.Legend();
   //  chart.legend.position = "top";

  }

  message: any;
  FinancepopupInfo(events: any) {
    let headerName: string;
    this.message = events.target.dataItem._dataContext;
    if (this.message.ToolTipHeader == 'Transactions')
      headerName = 'Total Transactions'
    else
      headerName = 'Total Revenue'
    this.Detailsinputs = {
      GroupBy: 'Agent',
      dayorweek: this.Chartinput.dayorweek,
      repStartDate: this.message.FromDate,
      repEndDate: this.message.ToDate,
      RoleID: this.Chartinput.RoleID,
      callcenter: this.Chartinput.callcenter
    }
    console.log('Finance Bar inputs:::::' + JSON.stringify(this.Detailsinputs));
    console.log('Finance Bar Return Value:::::' + JSON.stringify(headerName));
    this.message = events.target.dataItem.categoryX;
    const dialogRef = this.dialog.open(FinanceSummaryDetailComponent, { data: { inputs: this.Detailsinputs, repInput: headerName } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}


