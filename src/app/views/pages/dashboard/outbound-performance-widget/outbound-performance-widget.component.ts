import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OutboundPerformanceDetailComponent } from '../outbound-performance-detail/outbound-performance-detail.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { MatDialog } from '@angular/material';
import { CCOutBoundRequest } from '../_models/ccoutboundrequest.model';

@Component({
  selector: 'kt-outbound-performance-widget',
  templateUrl: './outbound-performance-widget.component.html',
  styleUrls: ['./outbound-performance-widget.component.scss']
})
export class OutboundPerformanceWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;  
  @Input() public inputs: CCOutBoundRequest;
   public ReportDetailinputs: CCOutBoundRequest;
  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();
  public finReptWidgetData: {
    summary?: any[];
    summary1?: any[];
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
          console.log('OutBound Chart Data Changes in popup::::' + JSON.stringify(change.currentValue));
          const finSummRec = finReptData.find(x => x.AgentID === 'SUMMARY');
          this.finReptWidgetData = {};
          
          this.finReptWidgetData.summary = [
            { title: '# Manual Out Calls', desc: '',popupIcon:true, value:StringUtilComponent.formatNumber(Number(finSummRec.NoofManualCalls)), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '# Dialer Calls', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(Number(finSummRec.NoofDiallerCalls)), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: 'AHT Dialer', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(Number(finSummRec.AHTDialer)),valueformat:'(Sec)', valueClass: 'kt-font-danger' }
            
          ];
          this.finReptWidgetData.summary1 = [
            { title: 'AHT Manual Outbound',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(Number(finSummRec.AHTManualOutBound)),valueformat:'(Sec)', valueClass: 'kt-font-danger' },
            { title: '% Manual Outbound', desc: '',popupIcon:true, value: finSummRec.ManualOutboundPer,valueformat:'(%)', valueClass: 'kt-font-warning' }
          ];
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

  message: any;
  GetPopupInfo($event) {
    // this.message = $event
    // console.log('outbound performance input :::' +this.message );
    // const dialogRef = this.dialog.open(OutboundPerformanceDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    // });
    this.message = $event
    let GroupBy: string='';
    let Title: string;
    console.log('inbound performance input :::' + JSON.stringify(this.message));
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
    console.log('Outbound Detail Reports input :::' + JSON.stringify(this.ReportDetailinputs));
    const dialogRef = this.dialog.open(OutboundPerformanceDetailComponent, { data: { inputs: this.ReportDetailinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}
