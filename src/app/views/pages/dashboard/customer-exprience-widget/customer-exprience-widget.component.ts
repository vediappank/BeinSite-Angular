import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { CCCUSTEXPRequest } from '../_models/cccustexprequest.model';
import { MatDialog } from '@angular/material';
import { CustomerExprienceDetailComponent } from '../customer-exprience-detail/customer-exprience-detail.component';

@Component({
  selector: 'kt-customer-exprience-widget',
  templateUrl: './customer-exprience-widget.component.html',
  styleUrls: ['./customer-exprience-widget.component.scss']
})
export class CustomerExprienceWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public popupData: any;
  @Input() public inputs: CCCUSTEXPRequest;
  public CUSTEXPinputs: CCCUSTEXPRequest;
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
          console.log('Customer Performance Chart Data Changes in popup::::' + JSON.stringify(change.currentValue));
          const finSummRec = finReptData.find(x => x.AgentID === 'SUMMARY');
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [
            { title: '# Transferred Calls To Survey', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.Trans_to_Survey_Calls), valueClass: 'kt-font-primary',valueformat:'(#)' },
            { title: '% FCR', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.FCR), valueClass: 'kt-font-warning',valueformat:'(%)' },
            { title: '% CSAT', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.CSAT), valueClass: 'kt-font-warning',valueformat:'(%)' },
            { title: '# Once & Done',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Once_and_Done_Calls), valueClass: 'kt-font-primary',valueformat:'(#)' }
           
          ];
          this.finReptWidgetData.summary1 = [
            
            { title: '% Once & Done',popupIcon:true, desc: '', value: finSummRec.Once_and_Done_Calls_Per, valueClass: 'kt-font-warning',valueformat:'(%)' },
            { title: '% Transferred Calls to Survey', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.Trans_to_Survey_Calls_Per), valueClass: 'kt-font-warning',valueformat:'(%)' },
            // { title: '% of FCR Completed', desc: '',popupIcon:true, value: StringUtilComponent.formatNumber(finSummRec.FCR / finSummRec.Trans_to_Survey_Calls), valueClass: 'kt-font-primary' },
            { title: '% CSAT Completed',popupIcon:true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.CSAT_Ans_Per), valueClass: 'kt-font-warning',valueformat:'(%)' },          
          ];
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

  message: any;
  GetPopupInfo($event) {
    // this.message = $event
    // console.log('Customer Exprience performance input :::' +this.message );

    // const dialogRef = this.dialog.open(CustomerExprienceDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
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
    this.CUSTEXPinputs = {
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
    this.CUSTEXPinputs = {
      GroupBy: GroupBy, 
      repStartDate: this.inputs.repStartDate, 
      repEndDate: this.inputs.repEndDate, 
      RoleID: this.inputs.RoleID, 
      callcenter: this.inputs.callcenter
    }
  }
    console.log('Customer Expreience Detail Reports input :::' + JSON.stringify(this.CUSTEXPinputs));
    const dialogRef = this.dialog.open(CustomerExprienceDetailComponent, { data: { inputs: this.CUSTEXPinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}
