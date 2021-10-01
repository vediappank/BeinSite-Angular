import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
export interface doungnuntData {
  AuxCode: string;
  AuxPer: number;
}


@Component({
  selector: 'kt-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrls: ['./pie-chart-widget.component.scss']
})
export class PieChartWidgetComponent implements OnInit, OnChanges {

  @Input() public data: doungnuntData[];
  constructor() {
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
          // let chart = am4core.create("chartdiv", am4charts.PieChart);

          let chart = am4core.create("chartdiv", am4charts.PieChart3D);
          chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

          chart.legend = new am4charts.Legend();
          var markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 20;
          markerTemplate.height = 20;
          
          // Add data
          chart.data = change.currentValue;          
          let series = chart.series.push(new am4charts.PieSeries3D());
          series.dataFields.value = "AuxPer";
          series.dataFields.category = "AuxCode";

          series.legendSettings.labelText = "{AuxCode}: {value.percent.formatNumber('#.00')}%";
          chart.legend.valueLabels.template.disabled = false;
          
          
        }
      }
    }
    
  }
}

