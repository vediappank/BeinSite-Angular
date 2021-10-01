import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { QualityDetailComponent } from '../quality-detail/quality-detail.component';
import { InputRequest } from '../_models/inputrequest.model';
import { BarChartWidgetModel } from '../../../partials/content/widgets/_model/barchart.model';
import { MatDialog } from '@angular/material';

import { CCQualityRequest } from '../_models/ccqualityrequest.model';

@Component({
  selector: 'kt-quality-widget',
  templateUrl: './quality-widget.component.html',
  styleUrls: ['./quality-widget.component.scss']
})
export class QualityWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public inputs: CCQualityRequest;
  @Input() public popupData: any;
  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public Detailsinputs: CCQualityRequest;
  public chartQualityEvalData:BarChartWidgetModel[]=[];
  public chartQualityAvgEvalData:BarChartWidgetModel[]=[];
  qualityChartData: any;
  ChartInputs: CCQualityRequest;

  

  public finReptWidgetData: {
    summary?: Widget1Data[]; agentEvalData?: { labels: string[]; datasets: ChartDataSets[], dashboard_inputs: any };
    evalData?: { labels: string[]; datasets: ChartDataSets[], dashboard_inputs: any }
  };
  public finReptWidgetData$ = new BehaviorSubject<any>(this.finReptWidgetData);
 
 

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          
          const finReptData = change.currentValue;         


           // 2 Lines for Charts data
           this.qualityChartData = this.data.filter(item =>item.Date !== 'SUMMARY');    
           this.chartQualityEvalData=[];  
           this.chartQualityAvgEvalData=[];    
           for(let i=0; i<this.qualityChartData.length; i++  )
           {
             this.chartQualityEvalData.push({CategoryColumn:this.qualityChartData[i].WeekORDay,
               ValueCoulmn: this.qualityChartData[i].TotalEvalAgentsCount,
               FromDate:this.qualityChartData[i].StartDate,
               ToDate:this.qualityChartData[i].EndDate,
               Date:this.qualityChartData[i].Date,
               ParentModuleName:'Agents - Evaluated',
               ToolTipHeader:'Evaluated',
               BarOverValue:this.qualityChartData[i].TotalEvalAgentsCount
             })
           }
           console.log('chartQualityEvalData:::'+ JSON.stringify(this.chartQualityEvalData));
           
           for(let i=0; i<this.qualityChartData.length; i++  )
           {
             this.chartQualityAvgEvalData.push({CategoryColumn:this.qualityChartData[i].WeekORDay,
               ValueCoulmn: this.qualityChartData[i].TotalAvgScore,
               FromDate:this.qualityChartData[i].StartDate,
               ToDate:this.qualityChartData[i].EndDate,
               Date:this.qualityChartData[i].Date,
               ParentModuleName:'Avg Evaluation Score',
               ToolTipHeader:'Avg. Evaluation Score',
               BarOverValue:this.qualityChartData[i].TotalAvgScore
             })
           }
           console.log('chartQualityAvgEvalData:::'+ JSON.stringify(this.chartQualityAvgEvalData));
           this.ChartInputs = this.inputs; 

          console.log('Quality Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));
          const finSummRec = finReptData.find(x => x.Date === 'SUMMARY');
          console.log('finSummRec Widget Chart Data Changes::::' + JSON.stringify(finSummRec));
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [
            // "TotalCount":1945,"TotalAvgScore":71,"TotalEvalAgentsCount":162,"TotalNONEvalAgentsCount":557
            {
              title: '# Total Evaluations', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.TotalCount),
              valueClass: 'kt-font-primary',valueformat:'(#)'
            },
            { title: '# Avg Evaluation Score', popupIcon: true, desc: '', value: finSummRec.TotalAvgScore, valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Agents - Evaluated', popupIcon: true, desc: '', value: finSummRec.TotalEvalAgentsCount, valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Agents - Not Evaluated', popupIcon: true, desc: '', value: finSummRec.TotalNONEvalAgentsCount, valueClass: 'kt-font-primary',valueformat:'(#)' }
          ];
          this.finReptWidgetData.agentEvalData = {
            labels: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Date + '~' + item.StartDate
              + '~' + item.EndDate),
            datasets: [
              {
                label: 'Evaluated',
                backgroundColor: '#28a745',
                hoverBackgroundColor: '#28a745',
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.TotalEvalAgentsCount)
              }
            ],
            dashboard_inputs: this.inputs
          };
          this.finReptWidgetData.evalData = {
            labels: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Date + '~' + item.StartDate
              + '~' + item.EndDate),
            datasets: [
              {
                label: 'Avg.Evaluation Score',
                backgroundColor: '#5e2e94',
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.TotalAvgScore)
              }
            ],
            dashboard_inputs: this.inputs
          };
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

 

  message: any;
  GetPopupInfo($event) {   
    this.message = $event
    let GroupBy: string = '';
    let Title: string;
    console.log('Quality performance input :::' + JSON.stringify(this.message));
    if (this.message.includes(',')) {
      Title = this.message.split(',')[0];
      GroupBy = this.message.split(',')[1];
      this.Detailsinputs = {
        GroupBy: GroupBy,
        repStartDate: this.inputs.repStartDate,
        repEndDate: this.inputs.repEndDate,
        RoleID: this.inputs.RoleID,
        callcenter: this.inputs.callcenter,
        dayorweek: this.inputs.dayorweek,
        medialist: this.inputs.medialist
      }
    }
    else {
      Title = this.message;
      this.Detailsinputs = {
        GroupBy: GroupBy,
        repStartDate: this.inputs.repStartDate,
        repEndDate: this.inputs.repEndDate,
        RoleID: this.inputs.RoleID,
        callcenter: this.inputs.callcenter,
        dayorweek: this.inputs.dayorweek,
        medialist: this.inputs.medialist
      }
    }
    console.log('Quality Detail Reports input :::' + JSON.stringify(this.Detailsinputs));
    const dialogRef = this.dialog.open(QualityDetailComponent, { data: { inputs: this.Detailsinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }

}
