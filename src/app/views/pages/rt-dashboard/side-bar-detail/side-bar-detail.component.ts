import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'kt-side-bar-detail',
  templateUrl: './side-bar-detail.component.html',
  styleUrls: ['./side-bar-detail.component.scss']
})
export class SideBarDetailComponent implements OnInit, OnChanges {

  @Input() public data: any;

  public finReptWidgetData: {
    summary?: any[];
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
          console.log('Side Bar Chart Data Changes::::' + JSON.stringify(change.currentValue));          
          this.finReptWidgetData = {};
          
          let callswaitingcolorcode:any;
          let callsansweredcolorcode:any;
          
          if(finReptData[0].CallsInQueue < 6)
          callswaitingcolorcode= "#00ff42";          
          else if(finReptData[0].CallsInQueue >=  6 && finReptData[0].CallsInQueue <  11 )
          callswaitingcolorcode= "#eab71e";
          else
          callswaitingcolorcode= "#f64e57";

          if(finReptData[0].CallAnswredPer >= 95)
          callsansweredcolorcode= "#00ff42";          
          else if(finReptData[0].CallAnswredPer >=  90 && finReptData[0].CallAnswredPer < 95 )
          callsansweredcolorcode= "#eab71e";
          else
          callsansweredcolorcode= "#f64e57";

          this.finReptWidgetData.summary = [
            { title: 'Calls Offered', value: finReptData[0].CallOffered, colorcode:'#FFF', size:'30px' },
            { title: 'Calls Handled', value: finReptData[0].CallsHandled, colorcode:'#FFF', size:'30px' },
            { title: 'Calls Answered(%)', value: finReptData[0].CallAnswredPer + ' %', colorcode: callsansweredcolorcode, size:'30px' },
            { title: 'Lognest Waiting', value: finReptData[0].MaxWaitTime, colorcode:'#FFF', size:'30px' },
            { title: 'Calls Waiting', value: finReptData[0].CallsInQueue, colorcode: callswaitingcolorcode, size:'60px'},
            { title: 'AHT', value: finReptData[0].AHT , colorcode:'#FFF', size:'30px'},
            { title: 'ASA', value: finReptData[0].ASA, colorcode:'#FFF', size:'30px' },            
            { title: 'Logged In', value: finReptData[0].AgentsLoggedOn, colorcode:'#FFF', size:'30px' },
            { title: 'Available', value: finReptData[0].AgentsAvailable, colorcode:'#FFF', size:'30px' },
            { title: 'Not Ready', value: finReptData[0].AgentsNotReady, colorcode:'#FFF' , size:'30px'},
            { title: 'Talking', value: finReptData[0].AgentsTalking, colorcode:'#FFF' , size:'30px'}
          ];
        }
      }
    }
  }
}
