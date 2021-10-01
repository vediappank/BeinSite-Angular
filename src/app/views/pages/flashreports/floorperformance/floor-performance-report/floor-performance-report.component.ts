import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../_services/agent.service';
import { AgentStatistics } from '../../model/agent-statistics.model';
import {formatDate} from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';



@Component({
  selector: 'app-floor-performance-report',
  templateUrl: './floor-performance-report.component.html',
  styleUrls: ['./floor-performance-report.component.scss']
})
export class FloorPerformanceReportComponent implements OnInit {
  public agentData: AgentStatistics[];
  public aInfo1: AgentStatistics; 
  public chartTheme: string;
  public elem;

  constructor(private agentService: AgentService, private router: Router) {    
    
  }

  ngOnInit() {
    this.elem = document.documentElement;
    if ( ! this .chartTheme || this .chartTheme === '' ) {
      this .chartTheme = 'bein-theme';
    }
    this.getReportData();

   // setInterval(() => {
      this.getReportData();
      console.log('refresh Time: '+formatDate(new Date(), "dd, MM, yyyy, hh:mm:ss aaa", 'en'));
      console.log('refresh page: '+"RabatSitePerformance");
      //this.router.navigate(['/RabatSitePerformance']);         
      //this.router.navigateByUrl('/RabatSitePerformance');
  //  }, 10000);    
    
  }

  getReportData() {
    
      this .agentService.getFloorPerformance().subscribe(agentStats => {

        this .agentData = agentStats;
        // console.log('Length of AgentStatsRes: '+this .agentData.length);
        let stats = agentStats;
        if( stats.length > 0) {
          this .aInfo1 = stats[0];
          console.log('FloorPerformanceReportComponent::getReportData ::aInfo1:'+ JSON.stringify(this .aInfo1, null, 4));
        }
      });
    }
     //Full Scree
  openFullscreen() {
    // alert('openFullscreen');
     this.elem = document.getElementById("fullscreen");
     if (this.elem.requestFullscreen) {
       this.elem.requestFullscreen();
     } else if (this.elem.mozRequestFullScreen) {
       /* Firefox */
       this.elem.mozRequestFullScreen();
     } else if (this.elem.webkitRequestFullscreen) {
       /* Chrome, Safari and Opera */
       this.elem.webkitRequestFullscreen();
     } else if (this.elem.msRequestFullscreen) {
       /* IE/Edge */
       this.elem.msRequestFullscreen();
     }
   }
}
