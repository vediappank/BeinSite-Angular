import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

@Component({
  selector: 'kt-call-summary-widget',
  templateUrl: './call-summary-widget.component.html',
  styleUrls: ['./call-summary-widget.component.scss']
})
export class CallSummaryWidgetComponent implements OnInit {

  constructor() {
    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
  }

  ngOnInit() {
    this.getchartdate();
  }

  getchartdate() {

    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.heatRules.push({
      "property": "fill",
      "target": polygonSeries.mapPolygons.template,
      "min": am4core.color("#ffffff"),
      "max": am4core.color("#AAAA00")
    });
    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;
    polygonTemplate.fill = am4core.color("#999");
    polygonTemplate.propertyFields.fill = "fill";
    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    //hs.properties.fill = am4core.color("#367B25");


    
    // Add image series
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipText = "{title}:{value}";
    imageSeries.mapImages.template.propertyFields.url = "url";

    let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 3;
    circle.propertyFields.fill = "color";

    let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 3;
    circle2.propertyFields.fill = "color";


    circle2.events.on("inited", function (event) {
      animateBullet(event.target);
    })
    let colorSet = new am4core.ColorSet();

    imageSeries.data = [{
      "title": "Brussels",
      "value": 50,
      "latitude": 50.8371,
      "longitude": 4.3676,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Copenhagen",
      "value": 50,
      "latitude": 55.6763,
      "longitude": 12.5681,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Paris",
      "value": 50,
      "latitude": 48.8567,
      "longitude": 2.3510,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Reykjavik",
      "value": 50,
      "latitude": 64.1353,
      "longitude": -21.8952,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Moscow",
      "value": 50,
      "latitude": 55.7558,
      "longitude": 37.6176,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Madrid",
      "value": 50,
      "latitude": 40.4167,
      "longitude": -3.7033,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "London",
      "value": 50,
      "latitude": 51.5002,
      "longitude": -0.1262,
      "url": "http://www.google.co.uk",
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Peking",
      "value": 50,
      "latitude": 39.9056,
      "longitude": 116.3958,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "New Delhi",
      "value": 50,
      "latitude": 28.6353,
      "longitude": 77.2250,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Tokyo",
      "value": 50,
      "latitude": 35.6785,
      "longitude": 139.6823,
      "url": "http://www.google.co.jp",
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Ankara",
      "value": 50,
      "latitude": 39.9439,
      "longitude": 32.8560,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Buenos Aires",
      "value": 50,
      "latitude": -34.6118,
      "longitude": -58.4173,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Brasilia",
      "value": 50,
      "latitude": -15.7801,
      "longitude": -47.9292,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Ottawa",
      "value": 50,
      "latitude": 45.4235,
      "longitude": -75.6979,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Washington",
      "value": 50,
      "latitude": 38.8921,
      "longitude": -77.0241,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Kinshasa",
      "value": 50,
      "latitude": -4.3369,
      "longitude": 15.3271,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Cairo",
      "value": 50,
      "latitude": 30.0571,
      "longitude": 31.2272,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }, {
      "title": "Pretoria",
      "value": 50,
      "latitude": -25.7463,
      "longitude": 28.1876,
      "color": "#8A2BE2",
      "fill": am4core.color("#5C5CFF")
    }];
  }
}

function animateBullet(circle) {
  let animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
  animation.events.on("animationended", function (event) {
    animateBullet(event.target.object);
  })
}

