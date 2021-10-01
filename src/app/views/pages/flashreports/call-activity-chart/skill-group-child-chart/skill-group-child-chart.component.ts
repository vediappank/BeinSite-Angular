import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SkillGroupCallInfo } from '../../model/skill-group-call-info.model';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts'; 
// import { Label } from 'ng-uikit-pro-standard';
import { SkillGroupInfo } from '../../model/skill-group-info.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SkillGroupCallInfoDialogComponent } from '../skill-group-call-info-dialog/skill-group-call-info-dialog.component';

@ Component({
  selector: 'app-skill-group-child-chart',
  templateUrl: './skill-group-child-chart.component.html',
  styleUrls: ['./skill-group-child-chart.component.scss']
})
export class SkillGroupChildChartComponent implements OnInit, OnChanges {

  @ Input() chartTitle: string;
  @ Input() chartTheme: string;
  @ Input() skGrpInfo: SkillGroupInfo;

  public pca: number; public asa: number; public aht: number;
  public fcoff: number; public fcoffAcc: number;
  public barChartOptions: ChartOptions;
  public barChartLabels: Label[] = ['00:00', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public cardTheme = '';

  public barChartData: ChartDataSets[] = [
    // { data: [65, 59, 80, 81, 56, 55, 40], label: 'Capacity' },
    { data: [ Math.round(Math.random() * 100), 59, 80, Math.random() * 100, 56, Math.random() * 100, 40], label: 'Answer',
      borderColor: 'rgba(68, 114, 196, 1)', backgroundColor: 'rgba(68, 114, 196, 0.9)', hoverBorderColor: 'rgba(68, 114, 196, 1)',
      hoverBackgroundColor: 'rgba(68, 114, 196, 0.9)', pointStyle: 'line' },
    { data: [ Math.round(Math.random() * 10), 9, 30, Math.random() * 10, 6, Math.random() * 10, 44], label: 'Abandoned',
      borderColor: 'rgba(197, 43, 43, 1)', backgroundColor: 'rgba(197, 43, 43, 0.7)', hoverBorderColor: 'rgba(255, 0, 0, 1)',
      hoverBackgroundColor: 'rgba(255, 0, 0, 0.7)', pointStyle: 'line' },
    { data: [ Math.round(Math.random() * 200), 159, 180, Math.random() * 200, 156, Math.random() * 200, 140], label: 'Forecast',
      borderColor: 'rgba(117, 113, 113, 1)', backgroundColor: 'rgba(0, 0, 0, 0.7)', type: 'line', fill: false, pointStyle: 'line' }
  ];

  constructor(private matDialog: MatDialog) {
   // console.log('Group Child Page1:::' + JSON.stringify(this .skGrpInfo));
    // console.log('Chart Theme: '+this .chartTheme);
    if ( ! this .chartTheme || this .chartTheme === '' ) {
      this .chartTheme = 'brown-theme';
    }
    this .barChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            display: false
          }
        }],
        yAxes: [{stacked: true}]
      },
      tooltips: {
        mode: 'label'
      },
      legend: {
        labels: {
          usePointStyle: true
        },
        fullWidth: true,
      },
      maintainAspectRatio: false,
    };
    this .barChartLabels = this .generateLabels();
  }

  ngOnInit() {
    this .calculateSummaryInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    this .calculateSummaryInfo();
  }

  calculateSummaryInfo() {
   
    // console.log('Received Skill Group Info:: ' + JSON.stringify(this .skGrpInfo, null, 4));
    if( this .skGrpInfo ) {
      this .chartTitle = this .skGrpInfo.skillName;
      this .barChartData[0].data = []; this .barChartData[0].data = this .skGrpInfo.callInfo.map( cInfo => { return cInfo.cans });
      this .barChartData[1].data = []; this .barChartData[1].data = this .skGrpInfo.callInfo.map( cInfo => { return cInfo.cabn });
      this .barChartData[2].data = []; this .barChartData[2].data = this .skGrpInfo.callInfo.map( cInfo => { return cInfo.foff });

      this .fcoff = 0;
      this .skGrpInfo.callInfo.forEach(cInfo => this .fcoff += cInfo.foff );
      this .skGrpInfo.foff = this .fcoff;
      this .pca = Math.round( (this .skGrpInfo.cans * 100 / this .skGrpInfo.coff) * 100) / 100;
      this .aht = Math.round(this .skGrpInfo.tht / this .skGrpInfo.chan);
      this .asa = Math.round(this .skGrpInfo.trt / this .skGrpInfo.cans);
    }
    // console.log('Calculated cabn Info:: ' + JSON.stringify(this .barChartData[2].data, null, 4));
  }

  generateData(randonCeiling: number): number[] {
    let data: number[];
    data = [];
    for( var i=0; i< 48; i++) {
      data[i] = Math.round(Math.random() * randonCeiling);
    }
    return data;
  }

  generateLabels(): Label[] {
    let labels: Label[];
    var x = 30; // minutes interval
    var tt = 0; // start time
    var ap = ['AM', 'PM']; // AM-PM
    labels = [];
      // loop to increment the time and push results in array
    for (var i=0; tt< 24*60 ; i++) {
      var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
      var mm = (tt%60); // getting minutes of the hour in 0-55 format
      // pushing data in array in [00:00 - 12:00 AM/PM format]
      // labels[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)];
      // pushing data in array in [00:00 - 12:00 AM/PM format]
      labels[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2);
      tt = tt + x;
    }
    // console.log('Labels:'+labels)

    return labels;
  }

  showCallInfo(): void {
    if( this.skGrpInfo ) {
     // console.log('Group Child Page2:::' + JSON.stringify(this.skGrpInfo));
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.maxHeight = '90vh';
      // dialogConfig.minWidth = '30vw';
      dialogConfig.data = this .skGrpInfo;
      
      const dialogRef = this .matDialog.open(SkillGroupCallInfoDialogComponent, dialogConfig);
    }
  }

}
