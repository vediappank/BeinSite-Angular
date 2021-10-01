import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { CCWhatsAppRequest } from '../_models/ccwhatsapprequest.model';
import { WhatsappPerformanceDetailComponent } from '../whatsapp-performance-detail/whatsapp-performance-detail.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'kt-whatsapp-performance-widget',
  templateUrl: './whatsapp-performance-widget.component.html',
  styleUrls: ['./whatsapp-performance-widget.component.scss']
})
export class WhatsappPerformanceWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public popupData: any;
  @Input() public inputs: CCWhatsAppRequest;
   public ReportDetailinputs: CCWhatsAppRequest;

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();
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
          console.log('whatsapp Performance Chart Data Changes in popup::::' + JSON.stringify(change.currentValue));
          const finSummRec = finReptData.find(x => x.AgentID === 'SUMMARY');
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [
            { title: '# WhatsApp Assigned', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.WhatsAppAssingedCount), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# WhatsApp Resolved', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.WhatsAppResolvedCount), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: 'WhatsApp Avg Response Time', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.WhatsAppResponseTime),valueformat:'(Sec)', valueClass: 'kt-font-danger' },
            { title: 'WhatsApp Avg Resolution Time', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.WhatsAppAvgResolutionTime),valueformat:'(Sec)', valueClass: 'kt-font-danger' },
            
            // { title: '# WhatsApp Resolution Time',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.WhatsAppResolutionTime), valueClass: 'kt-font-primary' },
            
          ];
          this.finReptWidgetData.summary1 = [
            { title: '# WhatsApp Messages Sent', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.WhatsAppMessageSent), valueClass: 'kt-font-primary',valueformat:'(#)' },           
            { title: '# WhatsApp Transactions',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.WhatsAppTransactions), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: 'WhatsApp Revenue',popupIcon:true, desc: '', value: StringUtilComponent.dollar(finSummRec.WhatsAppRevenue), valueClass: 'kt-font-success' },
            { title: 'WhatsApp ARPT',popupIcon:true, desc: '', value: StringUtilComponent.dollar(finSummRec.WhatsAppARPT), valueClass: 'kt-font-success' }
          ];          
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }
  message: any;
  GetPopupInfo($event) {
    // this.message = $event
    // console.log('WhatsApp performance input :::' +this.message );

    // const dialogRef = this.dialog.open(WhatsappPerformanceDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    // });

    this.message = $event
    let GroupBy: string='';
    let Title: string;
    console.log('WhatApp performance input :::' + JSON.stringify(this.message));
    if(this.message.includes(','))
    {
      Title =  this.message.split(',')[0];    
      GroupBy =  this.message.split(',')[1];    
    this.ReportDetailinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate,
       repEndDate: this.inputs.repEndDate, 
       RoleID: this.inputs.RoleID, 
       callcenter: this.inputs.callcenter
    }
  }
  else
  {
    Title = this.message ;
    this.ReportDetailinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate, 
      repEndDate: this.inputs.repEndDate, 
      RoleID: this.inputs.RoleID, 
      callcenter: this.inputs.callcenter
    }
  }
    console.log('whatsapp Detail Reports input :::' + JSON.stringify(this.ReportDetailinputs));
    const dialogRef = this.dialog.open(WhatsappPerformanceDetailComponent, { data: { inputs: this.ReportDetailinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }

}
