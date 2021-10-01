import { Component, OnInit, OnDestroy } from '@angular/core';
import { AWDBAgent } from '../../model/awdbagent.model';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';

import { AdminService } from '../../_services/admin.service';
import { AgentService } from '../../_services/agent.service';
import * as moment from 'moment';
import { BeinUser } from '../../model/bein-user.model';
import { AgentReportActivity } from '../../model/agent-report-activity.model';
import { AgentStatisticsRequest } from '../../model/agent-statistics-request.model';
import { AgentStatistics } from '../../model/agent-statistics.model';

@ Component({
  selector: 'app-my-activity-report',
  templateUrl: './my-activity-report.component.html',
  styleUrls: ['./my-activity-report.component.scss']
})
export class MyActivityReportComponent implements OnInit, OnDestroy {

  public awdbAgent: AWDBAgent;
  public beINUser: BeinUser;
  public reportRange: any;
  public reportDateRanges: any = {
    // 'Today': [moment().startOf('day'), moment().add(1, 'days').startOf('day')],
    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().startOf('day')],
    'This Week': [moment().startOf('week'), moment().endOf('week')],
    'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'This Year': [moment().startOf('year'), moment().endOf('year')],
    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
  }
  public agentStatisticsReq : AgentStatisticsRequest;
  public agentData: AgentStatistics[];
  public aInfo: AgentStatistics;
  public tInfo: AgentStatistics;
  public fInfo: AgentStatistics;
  public currentReportDTRange: string; public prevReportDTRange: string;
  public currentReportDT: moment.Moment; public prevReportDT: moment.Moment;
  public userId: string;
  private awdbAgentbehav = new BehaviorSubject< AWDBAgent >(null);
  public awdbAgentbehav$ = this .awdbAgentbehav.asObservable();
  
  private awdbAgentSub: Subscription;
  private beINUserSub: Subscription;

  constructor(private adminService: AdminService, private agentService: AgentService) {
    
    if (localStorage.hasOwnProperty("currentUser")) {
     this.userId = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
    // adminService.getAgentInfoById(Number(this.userId)).subscribe(ipccAgent => {
    //   console.log('devipccAgent ::', ipccAgent);
    //   if (ipccAgent) {
    //       this .awdbAgentbehav.next( ipccAgent );
    //       console.log('devawdbAgent ::', this.awdbAgentbehav);
    //       // console.log('Received AWDB Agent:: ' + JSON.stringify(ipccAgent, null, 4));
    //       // console.log('Received AWWDB Agent:: ' + JSON.stringify(this.awdbAgent.source, null, 4));
    //   }
    // });
    // this .awdbAgentSub = this.awdbAgentbehav$.subscribe(data => {
    //   this .awdbAgent = data;
    // });
    // this .beINUserSub = adminService.currBeinUser$.subscribe(data => {
    //   this .beINUser = data;
    // });
  }
  

  ngOnInit() {
    this .reportRange = {
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    };
  }

  ngOnDestroy() {
    // this .awdbAgentSub.unsubscribe();
    // this .beINUserSub.unsubscribe();
    this .logReportActivityToServer('TabDestroy');
  }

  getReportData() {
    
    if( this .reportRange.startDate && this .reportRange.endDate) {
      this .aInfo = null;
      this .agentStatisticsReq = {
        reportType: '', repStartDate: this .reportRange.startDate, repEndDate: this .reportRange.endDate, agentId: this.userId
      }
      let schDateTime = moment( this .reportRange.startDate );
      console.log('StartDateTime: ' + this .reportRange.startDate + ':::::' + schDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      this .agentStatisticsReq.repStartDate = schDateTime.format('YYYY-MM-DD');
      schDateTime = moment( this .reportRange.endDate );
      console.log('EndDateTime: ' + this .reportRange.endDate + ':::::' + schDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      this .agentStatisticsReq.repEndDate = schDateTime.format('YYYY-MM-DD');

      this .logReportActivityToServer(this .agentStatisticsReq.repStartDate + '_'
                                      + this .agentStatisticsReq.repEndDate);

      this .agentService.getAgentStatistics(this .agentStatisticsReq).subscribe(agentStats => {
        // this .agentData = agentStats;
        console.log('Length of AgentStatsRes: '+ agentStats.length);
        
        if( agentStats.length >= 3) {
          
          this .aInfo = agentStats[0];
          this .tInfo = agentStats[1];
          this .fInfo = agentStats[2];
        }
      });
    }
  }

  logReportActivityToServer(newRepDTRange: string){
    this .prevReportDTRange = this .currentReportDTRange;
    this .currentReportDTRange = newRepDTRange;
    this .prevReportDT = this .currentReportDT;
    this .currentReportDT = moment();
    
    console.log('User '+AdminService.userId + ' with Date Range ' + this .prevReportDTRange
      + ' for Milliseconds: ' + (this .currentReportDT.diff(this .prevReportDT) ) );

    if(this .prevReportDTRange){
      const req: AgentReportActivity = {
        agentId: this.userId  + '', repName: 'My Activity',
        repDateRange: this .prevReportDTRange, repCat: null, repSCat: null,
        repActStDt: this .prevReportDT.format('YYYY-MM-DDTHH:mm:ss')+'Z',
        repActEdDt: this .currentReportDT.format('YYYY-MM-DDTHH:mm:ss')+'Z'
      }
      this .agentService.addAgentReportActivity(req).subscribe(data => console.log('Add Report Activity Response:'+data));
    }
  }

}
