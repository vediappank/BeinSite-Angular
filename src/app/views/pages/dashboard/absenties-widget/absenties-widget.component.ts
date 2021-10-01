import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter,ChangeDetectionStrategy } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { AbsentiesDetailComponent } from '../absenties-detail/absenties-detail.component';
import { CCAbsentiesRequest } from '../_models/ccabsentiesrequest.model';
import { BarChartWidgetModel } from '../../../partials/content/widgets/_model/barchart.model';
import { MatDialog } from '@angular/material';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'kt-absenties-widget',
  templateUrl: './absenties-widget.component.html',
  styleUrls: ['./absenties-widget.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbsentiesWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public inputs: CCAbsentiesRequest;
  public AbsentiesDetailinputs:CCAbsentiesRequest;
  @Input() public popupData: any;
  public absentiesChartData:any;
  public ChartabsentiesData:BarChartWidgetModel[]=[];
  public ChartInputs:any;
  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public finReptWidgetData: {
    summary?: Widget1Data[]; agentEvalData?: { labels: string[]; datasets: ChartDataSets[],dashboard_inputs: any };
    evalData?: { labels: string[]; datasets: ChartDataSets[]  }
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
          this.absentiesChartData = this.data.filter(item =>item.Date !== 'SUMMARY');    
          this.ChartabsentiesData=[];      
          for(let i=0; i<this.absentiesChartData.length; i++  )
          {
            this.ChartabsentiesData.push({CategoryColumn:this.absentiesChartData[i].WeekORDay,
              ValueCoulmn: this.absentiesChartData[i].AbsencePer,
              FromDate:this.absentiesChartData[i].StartDate,
              ToDate:this.absentiesChartData[i].EndDate,
              Date:this.absentiesChartData[i].Date,
              ParentModuleName:'Absenties',
              ToolTipHeader:'Absence (%)',
              BarOverValue:this.absentiesChartData[i].AbsencePer+ ' %'
            })
          }
          console.log('ChartabsentiesData:::'+ JSON.stringify(this.ChartabsentiesData));
          this.ChartInputs = this.inputs; 
          
          
          console.log('Absenties Widget Chart Data Changes::::' + JSON.stringify(change.currentValue));
         // console.log('Absenties Widget Chart Data ::::' + JSON.stringify(this.data));
          const finSummRec = finReptData.find(x => x.Date === 'SUMMARY');          
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [            
            { title: '% Absence' , desc: '', popupIcon:true, value: finSummRec.AbsencePer, valueClass: 'kt-font-warning',valueformat:'(%)'},
            { title: '# Absence', desc: '', popupIcon:true, value: finSummRec.AbsenceCount, valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Late', desc: '',  popupIcon:true,value: finSummRec.LateCount, valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Left Early', popupIcon:true, desc: '', value: finSummRec.LeftEarlyCount, valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# FullDay Abs',  popupIcon:true,desc: '', value: finSummRec.FullDayAbsCount, valueClass: 'kt-font-primary',valueformat:'(#)' }
          ];                 
          this.finReptWidgetData.agentEvalData = {            
            labels: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Date + '~' + item.StartDate
            + '~' + item.EndDate),
            datasets: [
              { 
                label: 'Absence (%)',
                backgroundColor: '#28a745',
                hoverBackgroundColor: '#28a745',               
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.AbsencePer)
              }
            ],
            dashboard_inputs: this.inputs
          };         
         
          this.finReptWidgetData$.next(this.finReptWidgetData);
          console.log('this.finReptWidgetData::::'+ JSON.stringify(this.finReptWidgetData));
        }
      }
    }
  }
  message: any;
  GetPopupInfo($event) {
    this.message = $event
    let GroupBy: string='';
    let Title: string;
    console.log('Absenties performance input :::' + JSON.stringify(this.message));
    if(this.message.includes(','))
    {
      Title =  this.message.split(',')[0];    
      GroupBy =  this.message.split(',')[1];    
    this.AbsentiesDetailinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate,
       repEndDate: this.inputs.repEndDate, 
       RoleID: this.inputs.RoleID, 
       callcenter: this.inputs.callcenter,
       dayorweek:this.inputs.dayorweek
    }
  }
  else
  {
    Title = this.message ;
    this.AbsentiesDetailinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate, 
      repEndDate: this.inputs.repEndDate, 
      RoleID: this.inputs.RoleID, 
      callcenter: this.inputs.callcenter,
      dayorweek:this.inputs.dayorweek
    }
  }
    console.log('Absenties Detail Reports input :::' + JSON.stringify(this.AbsentiesDetailinputs));
    const dialogRef = this.dialog.open(AbsentiesDetailComponent, { data: { inputs: this.AbsentiesDetailinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}
