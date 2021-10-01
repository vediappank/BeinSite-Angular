import { Component, OnInit, Input, SimpleChanges, OnChanges, AfterViewInit, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AbsentiesDetailComponent } from '../../../../pages/dashboard/absenties-detail/absenties-detail.component';
import { CCAbsentiesRequest } from '../../../../pages/dashboard/_models/ccabsentiesrequest.model';
import { CCQualityRequest } from '../../../../pages/dashboard/_models/ccqualityrequest.model';
import { MatDialog } from '@angular/material';
import { QualityDetailComponent } from '../../../../pages/dashboard/quality-detail/quality-detail.component';

@Component({
  selector: 'kt-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss']
})
export class BarChartWidgetComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public title: string;
  @Input() public desc: string;
  @Input() public Chartdata: any;
  @Input() public Chartinput: any;
  public FilterChartData: any;
  public Reportsinputs: CCAbsentiesRequest;
  public ReportsQualityinputs: CCQualityRequest;
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
    this.chartDivName = "WidgetChart" + this.chartNum;
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.canChartLoad = true;
    });
  }
  // ngOnDestroy() {
  //   this.zone.runOutsideAngular(() => {
  //     if (this.chart) {
  //       this.chart.dispose();
  //     }
  //   });
  // }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'Chartdata') {
        let chartDataCollection: any;
        let chartDataInput: any;
        const change = changes[propName];
        if (change.currentValue) {
          console.log('Chart Records in bar Charts Inputs:::::' + JSON.stringify(this.Chartinput));
          console.log('Chart Records in bar Charts Data :::::' + JSON.stringify(change.currentValue));
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
    this.FilterChartData = chartrecords;
    chart.data = this.FilterChartData;
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
    console.log('Bar Chart Filter Data::::' + JSON.stringify(chart.data));
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "CategoryColumn";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.renderer.labels.template.fontWeight = "500";
    categoryAxis.renderer.inside = false;
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;
    valueAxis.cursorTooltipEnabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.renderer.labels.template.fontWeight = "bold";
    valueAxis.tooltip.disabled = true;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "ValueCoulmn";
    series.dataFields.categoryX = "CategoryColumn";
    series.name = "ValueCoulmn";
    //series.tooltipText = "[bold]{name}: {valueY}[/]";
    series.columns.template.strokeWidth = 0;
    series.hiddenInLegend = true;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.events.on("hit", this.DetailpopupInfo, this);
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color("#341E6C");
    if (chartinput.dayorweek == "Weekly") {
      series.tooltipHTML = `
    <center style="color:white; font-weight:bold;"><strong>{ToolTipHeader}: {valueY} </strong></center>    
    <table style="color:white; " >
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
      series.tooltipHTML = `
      <center style="color:white; font-weight:bold;"><strong>{ToolTipHeader}: {valueY} </strong></center>    
      <table style="color:white; " >
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


    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{BarOverValue}";
    valueLabel.label.fontWeight = "500";
    valueLabel.label.hideOversized = true;
    valueLabel.label.events.on("hit", this.DetailpopupInfo, this);
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
    valueAxis.renderer.grid.template.disabled = true;
    // Cursor
    chart.cursor = new am4charts.XYCursor();
    series.columns.template.adapter.add("height", function (height) {
      return height > 200 ? 200 : height;
    });
  }

  message: any;
  DetailpopupInfo(events: any) { 
 
    let headerName: string;
    this.message = events.target.dataItem._dataContext;
    
    this.Reportsinputs = {
      repStartDate: this.message.FromDate, repEndDate: this.message.ToDate, RoleID: this.Chartinput.RoleID,
      callcenter: this.Chartinput.callcenter, GroupBy: this.Chartinput.GroupBy, dayorweek: this.Chartinput.dayorweek
    }
    this.message = events.target.dataItem._dataContext;
    if (this.message.ParentModuleName === 'Absenties') {
      console.log('Bar chart Detailed called:::::' + JSON.stringify(this.message.ParentModuleName));
      headerName = '% Absence';      
      this.Reportsinputs = {
        repStartDate: this.message.FromDate, repEndDate: this.message.ToDate, RoleID: this.Chartinput.RoleID,
        callcenter: this.Chartinput.callcenter, GroupBy: this.Chartinput.GroupBy, dayorweek: this.Chartinput.dayorweek
      }
      const dialogRef = this.dialog.open(AbsentiesDetailComponent, { data: { inputs: this.Reportsinputs, repInput: headerName + ' From ' + this.message.FromDate + ' To ' + this.message.ToDate } });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    }
    else {
      console.log('Bar chart Detailed called:::::' + JSON.stringify(this.message.ParentModuleName));
      this.ReportsQualityinputs = {
        repStartDate: this.message.FromDate, repEndDate: this.message.ToDate, RoleID: this.Chartinput.RoleID,
        callcenter: this.Chartinput.callcenter, GroupBy: this.Chartinput.GroupBy, dayorweek: this.Chartinput.dayorweek, medialist:this.Chartinput.medialist
      }
      const dialogRef = this.dialog.open(QualityDetailComponent, { data: { inputs: this.ReportsQualityinputs, repInput: this.message.ParentModuleName + ' From ' + this.message.FromDate + ' To ' + this.message.ToDate } });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    }
  }

}
