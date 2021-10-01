import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'kt-outbound-sidebar-details',
  templateUrl: './outbound-sidebar-details.component.html',
  styleUrls: ['./outbound-sidebar-details.component.scss']
})
export class OutboundSidebarDetailsComponent implements OnInit {
  public curdate : Date = new Date();
  @Input() public data: any;

  public finReptWidgetData: {
    summary?: any[];
  };
  public finReptWidgetData$ = new BehaviorSubject<any>(this.finReptWidgetData);
  
  constructor(public dialog: MatDialog,public datepipe : DatePipe,   private router: Router,) { 
    setInterval(()=>{
      this.curdate = new Date();
      console.log("Current Date Time",this.datepipe.transform(this.curdate,'dd-MMM-yyyy hh:mm:ss a'));
    },1000);
  }

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
          
          // let callswaitingcolorcode:any;
          // let callsansweredcolorcode:any;
          
          // if(finReptData[0].CallsInQueue < 6)
          // callswaitingcolorcode= "#00ff42";          
          // else if(finReptData[0].CallsInQueue >=  6 && finReptData[0].CallsInQueue <  11 )
          // callswaitingcolorcode= "#eab71e";
          // else
          // callswaitingcolorcode= "#f64e57";

          // if(finReptData[0].CallAnswredPer >= 95)
          // callsansweredcolorcode= "#00ff42";          
          // else if(finReptData[0].CallAnswredPer >=  90 && finReptData[0].CallAnswredPer < 95 )
          // callsansweredcolorcode= "#eab71e";
          // else
          // callsansweredcolorcode= "#f64e57";
          // , colorcode:'#FFF', size:'30px' 
          this.finReptWidgetData.summary = [
            { title: 'Reserve Calls', value: finReptData[0].ReserveCalls},
            { title: 'Success Calls', value: finReptData[0].SuccessCalls},
            { title: 'Success(%)', value: finReptData[0].SuccessPercentage +'%'},
            { title: 'AHT', value: finReptData[0].AHT, colorcode: '#FFF', size:'20px'},
            { title: 'LoggedOn', value: finReptData[0].agentsLoggedOn},
            { title: 'Agents Talking', value: finReptData[0].agentsTalking},
            { title: 'Agents Available', value: finReptData[0].agentsAvailable},
            { title: 'Agents Not Ready', value: finReptData[0].agentsNotReady},
            { title: 'Manual Outbound Calls', value: finReptData[0].ManualOutboundCalls},            
          ];
        }
      }
    }
  }
}
