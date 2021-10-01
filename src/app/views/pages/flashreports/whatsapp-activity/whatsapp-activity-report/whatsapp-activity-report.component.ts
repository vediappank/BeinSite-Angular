import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { WhatsappChatInfoDialogComponent } from '../whatsapp-chat-info-dialog/whatsapp-chat-info-dialog.component';
import { Subscription } from 'rxjs';
import { AdminService } from '../../_services/admin.service';
import { AWDBAgent } from '../../model/awdbagent.model';
import { WhatsappService } from '../../_services/whatsapp.service';
import { WhatsappInfo } from '../../model/whatsapp-info.model';
import * as moment from 'moment';

@ Component({
  selector: 'app-whatsapp-activity-report',
  templateUrl: './whatsapp-activity-report.component.html',
  styleUrls: ['./whatsapp-activity-report.component.scss']
})
export class WhatsappActivityReportComponent implements OnInit, OnChanges {

  public chartTitle: string = 'Whatsapp Flashback';
  public chartTheme: string;
  public chartDate: string;
  public awdbAgent: AWDBAgent;
  public waInfo: WhatsappInfo[];

  public totcrec: number; public totcres: number; public totcbl: number; public maxYAxisValue: number;

  public barChartOptions: ChartOptions;
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [ ], label: 'Created Tickets',
      borderColor: 'rgba(74, 126, 187, 1)', backgroundColor: 'rgba(74, 126, 187, 1)', hoverBorderColor: 'rgba(74, 126, 187, 1)',
      hoverBackgroundColor: 'rgba(74, 126, 187, 1)', type: 'line', fill: false, pointStyle: 'line',
      xAxisID: 'x-axis-1', yAxisID: 'y-axis-2' },
    { data: [ ], label: 'Resolved Tickets',
      borderColor: 'rgba(8, 128, 24, 0.9)', backgroundColor: 'rgba(8, 128, 24, 0.8)', hoverBorderColor: 'rgba(8, 128, 24, 1)',
      hoverBackgroundColor: 'rgba(8, 128, 24, 0.9)', pointStyle: 'line', xAxisID: 'x-axis-1', yAxisID: 'y-axis-2' },
    { data: [ ], label: 'Resolution Time', // lineTension: 0,
      borderColor: 'rgba(120, 52, 197, 1)', backgroundColor: 'rgba(120, 52, 197, 0.1)', hoverBorderColor: 'rgba(120, 52, 197, 1)',
      hoverBackgroundColor: 'rgba(120, 52, 197, 0.2)', type: 'line', fill: true,
      pointStyle: 'line', xAxisID: 'x-axis-1', yAxisID: 'y-axis-1' }
  ];

  private awdbAgentSub: Subscription;

  constructor(private adminService: AdminService, private waService: WhatsappService, private matDialog: MatDialog) {
    this .chartDate = moment().format('YYYY-MM-DD');
    // this .awdbAgentSub = adminService.awdbAgent$.subscribe(data => {
      // this .awdbAgent = data;
      this .refresh();
    // });
    if ( ! this .chartTheme || this .chartTheme === '' ) {
      this .chartTheme = 'bein-theme';
    }
    this .setChartOptions(50);
    this .barChartLabels = this .generateLabels();
  }

  ngOnInit() {
    // this .calculateSummaryInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    // this .calculateSummaryInfo();
  }

  refresh(){
    // if( this .awdbAgent && !this .awdbAgent.LastName.startsWith('EGY') ){
      
      this .waService.getWhatsappInfo(this .chartDate).subscribe(data => {
        
        this .waInfo = data;
        this .calculateSummaryInfo();
      });
      console.log('Whatsapp data fetched');
    // }
  }

  calculateSummaryInfo() {
    
    if( this .waInfo && this .waInfo.length>0 ) {
      this .totcrec = this .waInfo[0].tcre;
      this .totcres = this .waInfo[0].tres;
      this .totcbl = this .totcrec - this .totcres;
      this .barChartData[0].data = this .waInfo[0].chatInfo.map( cInfo => { return cInfo.tcre });
      this .barChartData[1].data = this .waInfo[0].chatInfo.map( cInfo => { return cInfo.tres });
      this .barChartData[2].data = this .waInfo[0].chatInfo.map( cInfo => { return cInfo.rslt });
      this .maxYAxisValue = Math.max.apply(null, this .barChartData[0].data );
      this .maxYAxisValue = this .maxYAxisValue + (this .maxYAxisValue / 100) * 75;
      // console.log('maxYAxisValue:: ' + this .maxYAxisValue);
      this .setChartOptions(this .maxYAxisValue);
      // console.log('Calculated cabn Info:: ' + JSON.stringify(this .barChartData[0].data, null, 4));
      // console.log('Calculated cans Info:: ' + JSON.stringify(this .barChartData[1].data, null, 4));
      // console.log('Calculated foff Info:: ' + JSON.stringify(this .barChartData[2].data, null, 4));
    }
  }

  generateLabels(): Label[] {
    let labels: Label[];
    var x = 15; // minutes interval
    var tt = 0; // start time
    var ap = ['AM', 'PM']; // AM-PM
    labels = [];
    // loop to increment the time and push results in array
    for (var i=0; tt < 24*60; i++) {
      var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
      var mm = (tt%60); // getting minutes of the hour in 0-55 format
      // pushing data in array in [00:00 - 12:00 AM/PM format]
      // labels[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)];
      labels[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2)  // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
    }
    console.log('Labels:'+labels)

    return labels;
  }

  formatSecsAsMins(v): string {
    return new Date(v*1000).toISOString().substr(11, 8)
  }

  setChartOptions(maxYAxisVal: number): void {
    this .barChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{
          id: 'x-axis-1',
          position: 'bottom',
          gridLines: {
            zeroLineColor: 'rgba(0,0,0,1)',
            display: false
          }
        }],
        yAxes: [{
          // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'right',
          id: 'y-axis-1',
          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          ticks:{
            callback: (v) => this .formatSecsAsMins(v),
            min: 0
          }
        }, {
          // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-2',
          ticks: {
            suggestedMax: maxYAxisVal
          }
        }]
      },
      tooltips: {
        mode: 'label',
        callbacks: {
          label: function (tooltipItem, data) {
            if( tooltipItem.datasetIndex === 2 ) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                  label += ': ';
              }
              label += new Date(parseInt(''+tooltipItem.yLabel, 10)*1000).toISOString().substr(11, 8);
              // console.log('Tooltip::'+tooltipItem.datasetIndex+':::'+label);
              return label;
            }else{
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                  label += ': ';
              }
              label += Math.round(parseInt(''+tooltipItem.yLabel, 10) * 100) / 100;
              return label;
            }
          }
        }
      },
      legend: {
        labels: {
          usePointStyle: true
        },
        fullWidth: true,
      },
      maintainAspectRatio: false,
    };
  }

  showCallInfo(): void {
    if( this .waInfo && this .waInfo.length>0 ) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.maxHeight = '90vh';
      // dialogConfig.minWidth = '30vw';
      dialogConfig.data = this .waInfo[0];
      const dialogRef = this .matDialog.open(WhatsappChatInfoDialogComponent, dialogConfig);
    }
  }
}
