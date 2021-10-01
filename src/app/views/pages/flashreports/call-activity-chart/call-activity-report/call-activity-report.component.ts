import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SkillGroupService } from '../../_services/skill-group.service';
import { SkillGroupInfo } from '../../model/skill-group-info.model';
import { Subscription, Subject } from 'rxjs';
import { AWDBAgent } from '../../model/awdbagent.model';
import { AdminService } from '../../_services/admin.service';
import { MatTabChangeEvent } from '@angular/material';
import * as moment from 'moment';
// import { AgentReportActivity } from 'src/app/model/agent-report-activity.model';
// import { AgentService } from 'src/app/_services/agent.service';
import { AgentReportActivity } from '../../model/agent-report-activity.model';
import { AgentService } from '../../_services/agent.service';
import { debug } from 'webpack';
@ Component({
  selector: 'app-call-activity-report',
  templateUrl: './call-activity-report.component.html',
  styleUrls: ['./call-activity-report.component.scss']
})
export class CallActivityReportComponent implements OnInit, OnDestroy {

  public chartDate: string;
  public awdbAgent: AWDBAgent;
  public showVIP = false; public showGCC = false; public showROW = false;
  public showNA = false; public showMorocco = false; public showGlobal = false;
  public showKSA = false;public showJordan = false;
  public userId;
  public currentTabLabel: string; public prevTabLabel: string;
  public currentTabChangeDT: moment.Moment; public prevTabChangeDT: moment.Moment;

  private awdbAgentSub: Subscription;

  constructor(private adminService: AdminService, private skGrpService: SkillGroupService,
    private agentService: AgentService) {
      if (localStorage.hasOwnProperty("currentUser")) {
        this.userId = JSON.parse(localStorage.getItem('currentUser')).agentid;
        }
        
      this .adminService.setUserId(this.userId);
   // this .awdbAgentSub = adminService.awdbAgent$.subscribe(data => {
      
      //this .awdbAgent = data;
    //  if( this .awdbAgent && !this .awdbAgent.LastName.startsWith('EGY') ){
        this .showGlobal = true;
        this .showVIP = true;
        this .showGCC = true;
        this .showROW = true;
        this .showNA = true;
        this .showMorocco = true;
        this .showKSA = true;
        this.showJordan = true;
        /*console.log('Received AWDB Agent:: ' + JSON.stringify(this .awdbAgent, null, 4));
        if ( this .awdbAgent.SkillGroups.indexOf('VIP_') != -1 ) {
          this .showVIP = true;
        }
        if ( this .awdbAgent.SkillGroups.indexOf('GCC_') != -1 ) {
          this .showGCC = true;
        }
        if ( this .awdbAgent.SkillGroups.indexOf('ROW_') != -1 ) {
          this .showROW = true;
        }
        if ( this .awdbAgent.SkillGroups.indexOf('NA_') != -1 ) {
          this .showNA = true;
        }
        if ( this .awdbAgent.SkillGroups.indexOf('MOROCCO') != -1 ) {
          this .showMorocco = true;
        }*/
        this .refresh();
     // }
   // });
  }

  ngOnInit() {
    this .chartDate = moment().format('YYYY-MM-DD');
    this .refresh();
    this .currentTabLabel = this .prevTabLabel = 'Global';
    this .currentTabChangeDT = this .prevTabChangeDT = moment();
  }

  ngOnDestroy() {
    // this .awdbAgentSub.unsubscribe();
    this .logFlashActToServer('TabDestroy');
  }

  refresh(){    

    //if( this .awdbAgent && !this .awdbAgent.LastName.startsWith('EGY') ){     
      this .skGrpService.populateSkGrpInfo(this .chartDate);
      console.log('skillgroup data fetched');
   // }
  }

  handleTabChange(event: MatTabChangeEvent) {
    console.log('New tab selection: '+event.index+'::'+event.tab.ariaLabel+'::'+event.tab.textLabel);
    if( event.tab.textLabel !== this .currentTabLabel ) {
      this .logFlashActToServer(event.tab.textLabel);
    }
  }

  logFlashActToServer(newTabLabel: string){;
   
    console.log('New tab Label: '+newTabLabel);
    this .prevTabLabel = this .currentTabLabel;
    this .currentTabLabel = newTabLabel;
    this .prevTabChangeDT = this .currentTabChangeDT;
    this .currentTabChangeDT = moment();
    console.log('User '+this.userId+' Stayed in ' + this .prevTabLabel + ' for Date: ' + this .chartDate
      + ' for Milliseconds: ' + (this .currentTabChangeDT.diff(this .prevTabChangeDT) ) );

    const req: AgentReportActivity = {
      agentId: this.userId , repName: 'Flash Charts',
      repDateRange: this .chartDate, repCat: this .prevTabLabel, repSCat: null,
      repActStDt: this .prevTabChangeDT.format('YYYY-MM-DDTHH:mm:ss')+'Z',
      repActEdDt: this .currentTabChangeDT.format('YYYY-MM-DDTHH:mm:ss')+'Z'
    }
    this .agentService.addAgentReportActivity(req).subscribe(data => console.log('Add Report Activity Response:'+data));
  }

}

