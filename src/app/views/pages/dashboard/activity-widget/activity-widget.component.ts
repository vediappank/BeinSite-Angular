import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LayoutConfigService } from '../../../../core/_base/layout';
import { AgentActivityReportVO } from '../../reports/_models/agent-activity-report-vo.model';
import { ActivityWidgetRequest } from '../_models/activitywidgetrequest.model';
import Chart, { ChartElementsOptions } from 'chart.js';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BehaviorSubject } from 'rxjs';
import { ActivityWidgetDetailComponent } from '../activity-widget-detail/activity-widget-detail.component';
import { MatDialog } from '@angular/material';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'kt-activity-widget',
  templateUrl: './activity-widget.component.html',
  styleUrls: ['./activity-widget.component.scss']
})
export class ActivityWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() title: string;
  @Input() desc: string;
  @Input() inputs: ActivityWidgetRequest;
  public popupinputs: ActivityWidgetRequest;
  @Input() agentActData: AgentActivityReportVO[];
  @Input() data: { labels: string[]; datasets: any[] };
  @ViewChild('chart', { static: true }) chart: ElementRef;

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public barChartOptions: ChartOptions;
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [ChartDataLabels];
  public barChartData: ChartDataSets[] = [
    {
      data: [], label: 'Answer',
      borderColor: 'rgba(68, 114, 196, 1)', backgroundColor: 'rgba(68, 114, 196, 0.9)', hoverBorderColor: 'rgba(68, 114, 196, 1)',
      hoverBackgroundColor: 'rgba(68, 114, 196, 0.9)', pointStyle: 'line'
    }
  ];
  public barChartLabels$ = new BehaviorSubject<any>(this.barChartLabels);
  public barChartData$ = new BehaviorSubject<any>(this.barChartData);

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   */
  constructor(private layoutConfigService: LayoutConfigService, public dialog: MatDialog) {
    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);

  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {

    this.barChartLabels = [];
    // this.initChartJS();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'agentActData') {
        const change = changes[propName];
        if (change.currentValue) {
          //this.loadcylinderchart(change.currentValue.filter(item => item.ActivityName !== 'SUMMARY'));
          this.getChartdata(change.currentValue.filter(item => item.ActivityName !== 'SUMMARY'));
          console.log('Agent Activity Reports Chart Data Changes::::' +
            JSON.stringify(change.currentValue.filter(item => item.ActivityName !== 'SUMMARY')));
          this.data = {
            labels: change.currentValue.filter(item => item.ActivityName !== 'SUMMARY').map(item => item.ActivityName),
            datasets: [
              {
                // label: 'dataset 1',
                backgroundColor: this.layoutConfigService.getConfig('colors.state.success'), fontColor: '#fff',
                data: change.currentValue.filter(item => item.ActivityName !== 'SUMMARY').map(item => item.Count)
              }
            ]
          };
          this.barChartLabels = change.currentValue.filter(item => item.ActivityName !== 'SUMMARY').map(item => item.ActivityName);
          this.barChartData[0].data = change.currentValue.filter(item => item.ActivityName !== 'SUMMARY').map(item => item.Count);
          this.barChartLabels$.next(this.barChartLabels);
          this.barChartData$.next(this.barChartData);
          // this.initChartJS();
        }
      }
    }
  }

  /** Init chart */
  initChartJS() {
    // For more information about the chartjs, visit this link
    // https://www.chartjs.org/docs/latest/getting-started/usage.html
    const chart = new Chart(this.chart.nativeElement, {
      type: 'bar',
      data: this.data,
      options: this.barChartOptions,
      plugins: [ChartDataLabels],
    });
  }

 

  getChartdata(reportdata: any[]) {
    let chart = am4core.create("chartdiv3", am4charts.XYChart);
    console.log('Chart Filter Data::::' + JSON.stringify(reportdata));
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.disabled = true;
    chart.data = reportdata;
   // chart.fill = am4core.color("#341e6c");
     chart.colors.list = [
       am4core.color("#9B30F0")
    //   // am4core.color("#FF0000"),
    //   // am4core.color("#FFFF00"),
    //   // am4core.color("#808000"),
    //   // am4core.color("#808080"),
    //   // am4core.color("#008000"),
    //   // am4core.color("#00FFFF"),
    //   // am4core.color("#008080"),
    //   // am4core.color("#0000FF"),
    //   // am4core.color("#000080"),
    //   // am4core.color("#FF00FF"),
    //   // am4core.color("#800080")
     ];
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "ActivityNameWithCount";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.fontWeight="500";
    categoryAxis.renderer.labels.template.fontSize="14";
    
    categoryAxis.renderer.labels.template.fontFamily="inherit";
    


    let labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -90;
    labelTemplate.horizontalCenter = "left";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.dy = 0; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated
    labelTemplate.events.on("hit", this.ActivityDetailpopupInfo, this);
    // First value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.title.text = "Count";
    valueAxis.renderer.minWidth = 50;    
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.renderer.labels.template.fontWeight="bold";

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "Count";
    series.dataFields.categoryX = "ActivityNameWithCount";
    series.name = "Count";
    series.tooltipText = "[bold]{name}: {valueY}[/]";
    series.columns.template.strokeWidth = 0;
    series.hiddenInLegend = true;
    //series.stroke = am4core.color("#ff0000");
    series.columns.template.stroke = am4core.color("#341e6c"); // red outline
series.columns.template.fill = am4core.color("#341e6c"); 
series.columns.template.propertyFields.fill = "#341e6c";
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.events.on("hit", this.ActivityDetailpopupInfo, this);

    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 10;
    hoverState.properties.cornerRadiusTopRight = 10;
    hoverState.properties.fillOpacity = 1;


    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(0);
    })

    //Disable Grid
    categoryAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.grid.template.disabled = true

    // Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomXY";

    // Add legend
  //  chart.legend = new am4charts.Legend();
  }

  message: any;
  ActivityDetailpopupInfo(events: any) {
    let activityName;
    this.message = events.target.dataItem.categoryX;
    if (this.message != undefined)
      activityName = this.message.split(' - ')[0];
    else
      activityName = events.target.currentText.split(' - ')[0];
      console.log('activityName::::'+ activityName);
    this.popupinputs = this.inputs;
    const dialogRef = this.dialog.open(ActivityWidgetDetailComponent, { data: { detail_inputs: this.popupinputs, ActivityID: activityName, ActivityName: activityName } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }




  /*public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
    if ( active && active.length > 0 ) {
      const labelIndex = active[0]._index;
      console.log('Label: ' + this.barChartLabels[ labelIndex ] );
    }
  }*/

}
