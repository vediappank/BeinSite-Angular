import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy, ɵConsole } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { InboundPerformanceDetailComponent } from '../inbound-performance-detail/inbound-performance-detail.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CCInboundRequest } from '../_models/ccinboundrequest.model';

@Component({
  selector: 'kt-inbound-performance-widget',
  templateUrl: './inbound-performance-widget.component.html',
  styleUrls: ['./inbound-performance-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboundPerformanceWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public popupData: any;
  @Input() public inputs: CCInboundRequest;
  public Detailsinputs: CCInboundRequest;

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();
  public finReptWidgetData: {
    summary?: Widget1Data[]; summary1?: Widget1Data[]; summary2?: Widget1Data[];
    transData?: { labels: string[]; datasets: ChartDataSets[] };
    revData?: { labels: string[]; datasets: ChartDataSets[] };
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
          console.log('Inbound Performance Chart Data Changes in popup::::' + JSON.stringify(change.currentValue));
          const finSummRec = finReptData.find(x => x.AgentID === 'SUMMARY');
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [
            { title: '# Handled Calls', desc: '', popupIcon: true, value: StringUtilComponent.formatNumber(finSummRec.Handled_Calls), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Answered Calls', desc: '', popupIcon: true, value: StringUtilComponent.formatNumber(finSummRec.Answred_Calls), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: 'Average Handled Time (AHT)', desc: '', popupIcon: true, value: StringUtilComponent.formatNumber(finSummRec.AHT),valueformat:'(Sec)', valueClass: 'kt-font-danger' },
            { title: 'Average Speed of Answer (ASA)', desc: '', popupIcon: false, value: StringUtilComponent.formatNumber(finSummRec.ASA),valueformat:'(Sec)', valueClass: 'kt-font-danger' },
            { title: '# Disconnected Calls', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Disconnected_Calls), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Hold Calls', desc: '', popupIcon: true, value: StringUtilComponent.formatNumber(finSummRec.Hold), valueClass: 'kt-font-primary',valueformat:'(#)' }
          ];
          this.finReptWidgetData.summary1 = [
            { title: '# Assist Reqs', desc: '', popupIcon: true, value: StringUtilComponent.formatNumber(finSummRec.Assist_Requests), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '% Of Assist Reqs', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Assist_Per),valueformat:'(%)', valueClass: 'kt-font-warning' },
            { title: '% Of Hold Accuracy', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Hold_Calls_Per),valueformat:'(%)', valueClass: 'kt-font-warning' },
            { title: '# Internal Calls', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Internal_Calls), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: 'Duration of Internal Calls', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Internal_Call_Duration),valueformat:'(Sec)', valueClass: 'kt-font-danger' }
          ];
          this.finReptWidgetData.summary2 = [

            { title: '# Inbound Transactions', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Transactions_Count), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: 'Inbound Revenue', desc: '', popupIcon: true, value: StringUtilComponent.dollar(finSummRec.Revenue_In_Dollar), valueClass: 'kt-font-success' },
            { title: '# Inbound ARPT', popupIcon: true, desc: '', value: StringUtilComponent.dollar(finSummRec.ARPT), valueClass: 'kt-font-success' }
          ];

          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

  message: any;
  GetPopupInfo($event) {     
    this.message = $event
    let GroupBy: string='';
    let Title: string;
    console.log('inbound performance input :::' + JSON.stringify(this.message));
    if(this.message.includes(','))
    {
      Title =  this.message.split(',')[0];    
      GroupBy =  this.message.split(',')[1];    
    this.Detailsinputs = {
      GroupBy: GroupBy, repStartDate: this.inputs.repStartDate, repEndDate: this.inputs.repEndDate, RoleID: this.inputs.RoleID, callcenter: this.inputs.callcenter
    }
  }
  else
  {
    Title = this.message ;
    this.Detailsinputs = {
      GroupBy: GroupBy, repStartDate: this.inputs.repStartDate, repEndDate: this.inputs.repEndDate, RoleID: this.inputs.RoleID, callcenter: this.inputs.callcenter
    }
  }
    console.log('Detail Reports input :::' + JSON.stringify(this.Detailsinputs));
    const dialogRef = this.dialog.open(InboundPerformanceDetailComponent, { data: { inputs: this.Detailsinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }

}
