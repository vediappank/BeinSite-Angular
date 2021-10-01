import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { AgtTimeMgtWidgetDetailComponent } from '../agt-time-mgt-widget-detail/agt-time-mgt-widget-detail.component'
import { MatDialog } from '@angular/material';
import { CCTimeMgtDetailRequest } from '../_models/cctimemgtdetail.model';




@Component({
  selector: 'kt-agt-time-mgt-widget',
  templateUrl: './agt-time-mgt-widget.component.html',
  styleUrls: ['./agt-time-mgt-widget.component.scss']
})
export class AgtTimeMgtWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public inputs: CCTimeMgtDetailRequest;
  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public Detailinputs: CCTimeMgtDetailRequest;

  

  public finReptWidgetData: {
    summary?: Widget1Data[]; summary1?: Widget1Data[]; summary2?: Widget1Data[];
    transData?: { labels: string[]; datasets: ChartDataSets[] };
    revData?: { labels: string[]; datasets: ChartDataSets[] };
  };
  public finReptWidgetData$ = new BehaviorSubject<any>(this.finReptWidgetData);

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // this.finReptWidgetData = {summary: []};
    // this.finReptWidgetData$.next(this.finReptWidgetData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          const finReptData = change.currentValue;
          

          this.finReptWidgetData = {};
          let col1value: any[] = [];
          let col1value1: any[] = [];
          let col1value2: any[] = [];
          for (let i = 0; i < finReptData.length; i++) {
            if (i <= 4)
              col1value.push({ title: finReptData[i].AuxCode, popupIcon: true, desc: '', value: finReptData[i].TotalDuration,valueformat:'(Hrs)', valueClass: 'kt-font-info' });

            else if (i > 4 && i < 10) {
              col1value1.push({ title: finReptData[i].AuxCode, popupIcon: true, desc: '', value: finReptData[i].TotalDuration,valueformat:'(Hrs)', valueClass: 'kt-font-info' })
            }
            else if (i > 9 && i < 13) {
              col1value2.push({ title: finReptData[i].AuxCode, popupIcon: true, desc: '', value: finReptData[i].TotalDuration,valueformat:'(Hrs)', valueClass: 'kt-font-info' })
            }
          }
          this.finReptWidgetData.summary = col1value;
          this.finReptWidgetData.summary1 = col1value1;
          this.finReptWidgetData.summary2 = col1value2;
         // console.log('this.finReptWidgetData:::' + JSON.stringify(this.finReptWidgetData));
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

  message: any;
  GetPopupInfo($event) {
    // this.message = $event
    // const dialogRef = this.dialog.open(AgtTimeMgtWidgetDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    // });
    
    this.message = $event
    let GroupBy: string='';
    let Title: string;
    //console.log('Time management Detail input :::' + JSON.stringify(this.message));
    if(this.message.includes(','))
    {
      Title =  this.message.split(',')[0];    
      GroupBy =  this.message.split(',')[1];    
    this.Detailinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate, 
      repEndDate: this.inputs.repEndDate, 
      RoleID: this.inputs.RoleID,
       callcenter: this.inputs.callcenter,
       aux_code:Title
    }
  }
  else
  {
    Title = this.message ;
    this.Detailinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate,
       repEndDate: this.inputs.repEndDate, 
       RoleID: this.inputs.RoleID, 
       callcenter: this.inputs.callcenter,
       aux_code:Title
    }
  }
    //console.log('Detail Reports input :::' + JSON.stringify(this.Detailinputs));
    const dialogRef = this.dialog.open(AgtTimeMgtWidgetDetailComponent, { data: { inputs: this.Detailinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }

}
