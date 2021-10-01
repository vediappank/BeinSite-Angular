import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { SkillGroupCallInfo } from '../../model/skill-group-call-info.model';
import { SkillGroupInfo } from '../../model/skill-group-info.model';
import { SkillGroupService } from '../../_services/skill-group.service';
import { Subscription } from 'rxjs';

@ Component({
  selector: 'app-skill-group-call-activity-report',
  templateUrl: './skill-group-call-activity-report.component.html',
  styleUrls: ['./skill-group-call-activity-report.component.scss']
})
export class SkillGroupCallActivityReportComponent implements OnInit, OnChanges, OnDestroy {

  @ Input() skillGroupName: string;

  public skGrpInfo: SkillGroupInfo;
  public arSkGrpInfo: SkillGroupInfo;
  public enSkGrpInfo: SkillGroupInfo;

  public title1 = 'be<b>IN</b> Global';
  public title2 = 'be<b>IN</b> Global - AR';
  public title3 = 'be<b>IN</b> Global - EN';

  private skGrpsInfo: SkillGroupInfo[];
  private skGrpInfoSub: Subscription;
  pca: string;

  constructor(private skGrpService: SkillGroupService) {
    
    this .skGrpInfoSub = this .skGrpService.skGrpInfo$.subscribe(skGrpsInfo => {
      console.log('info:::' + JSON.stringify(skGrpsInfo))
      this .skGrpsInfo = skGrpsInfo;
      this .calculateInfo();
    });
  }

  ngOnInit() {
    // console.log('Got Skill Group Name: '+this .skillGroupName);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Got Change Skill Group Name: '+this .skillGroupName);
    this .calculateInfo();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this .skGrpInfoSub.unsubscribe();
  }

  calculateInfo() {
    
    // console.log('Skill Group Name: '+this .skillGroupName);
    if( this .skillGroupName && this .skGrpsInfo ) {
      this .skGrpInfo = new SkillGroupInfo();
      this .skGrpInfo.skillName = this .skillGroupName.toUpperCase();
      // console.log('Skill Group Name: '+this .skillGroupName);
      
      this .skGrpsInfo.forEach(skInfo => {
        if( skInfo.skillName ) {
          if(skInfo.skillName.toLowerCase().startsWith(this .skillGroupName.toLowerCase() + '_ar_') ) {
            this .arSkGrpInfo = skInfo;
            this .skGrpInfo = this .populateCallInfo(this .arSkGrpInfo, this .skGrpInfo);
          }else if(skInfo.skillName.toLowerCase().startsWith(this .skillGroupName.toLowerCase() + '_en_') ) {
            this .enSkGrpInfo = skInfo;
            this .skGrpInfo = this .populateCallInfo(this .enSkGrpInfo, this .skGrpInfo);
          }else if( (skInfo.skillName.toLowerCase().startsWith('morocco') && this .skillGroupName.toLowerCase()==='morocco') ){
            this .arSkGrpInfo = skInfo;
            this .skGrpInfo = this .populateCallInfo(this .arSkGrpInfo, this .skGrpInfo);
          }
          else if( (skInfo.skillName.toLowerCase().startsWith('jordan') && this .skillGroupName.toLowerCase()==='jordan') ){
            this .arSkGrpInfo = skInfo;
            this .skGrpInfo = this .populateCallInfo(this .arSkGrpInfo, this .skGrpInfo);
          }
        }
      });
    }
    // console.log('Main page data Global- GrpInfo:::' + JSON.stringify(this.skGrpInfo));
    //     console.log('Main page data AR-SkGrpInfo:::' + JSON.stringify(this.skGrpInfo));
    //     console.log('Main page data EN-SkGrpInfo:::' + JSON.stringify(this.enSkGrpInfo));
  }

  populateCallInfo(srcSkGrpInfo: SkillGroupInfo, destSkGrpInfo: SkillGroupInfo): SkillGroupInfo {
    destSkGrpInfo.coff += srcSkGrpInfo.coff;
    destSkGrpInfo.chan += srcSkGrpInfo.chan;
    destSkGrpInfo.cans += srcSkGrpInfo.cans;
    destSkGrpInfo.cabn += srcSkGrpInfo.cabn;
    destSkGrpInfo.cerr += srcSkGrpInfo.cerr;
    destSkGrpInfo.tht += srcSkGrpInfo.tht;
    destSkGrpInfo.ttt += srcSkGrpInfo.ttt;
    destSkGrpInfo.trt += srcSkGrpInfo.trt;
    destSkGrpInfo.pca += srcSkGrpInfo.pca;
    
    destSkGrpInfo.callsreceived += srcSkGrpInfo.callsreceived;

    if( destSkGrpInfo.callInfo && destSkGrpInfo.callInfo.length == 0 ) {
      destSkGrpInfo.callInfo = srcSkGrpInfo.callInfo;
    } else {
      let callInfo: SkillGroupCallInfo[];
      let intCallInfo: SkillGroupCallInfo;
      callInfo = [];

      srcSkGrpInfo.callInfo.forEach( srcCallInfo => {
        destSkGrpInfo.callInfo.forEach( destCallInfo => {
          if( srcCallInfo.intervalDT == destCallInfo.intervalDT ) {
            intCallInfo = new SkillGroupCallInfo();
            intCallInfo.intervalDT = srcCallInfo.intervalDT;
            intCallInfo.coff = destCallInfo.coff + srcCallInfo.coff;
            intCallInfo.chan = destCallInfo.chan + srcCallInfo.chan;
            intCallInfo.cans = destCallInfo.cans + srcCallInfo.cans;
            intCallInfo.cabn = destCallInfo.cabn + srcCallInfo.cabn;
            intCallInfo.cerr = destCallInfo.cerr + srcCallInfo.cerr;
            intCallInfo.foff = destCallInfo.foff + srcCallInfo.foff;
            intCallInfo.tht = destCallInfo.tht + srcCallInfo.tht;
            intCallInfo.ttt = destCallInfo.ttt + srcCallInfo.ttt;
            intCallInfo.trt = destCallInfo.trt + srcCallInfo.trt;
            //intCallInfo.pca = destCallInfo.pca + srcCallInfo.pca;
            intCallInfo.callsreceived = destCallInfo.callsreceived + srcCallInfo.callsreceived;    
            this.pca = Math.round((intCallInfo.cans * 100 / intCallInfo.callsreceived)).toString();
           if (this.pca ==="NaN")
           intCallInfo.pca = 0;
           else
           intCallInfo.pca = Number(this.pca);                
            callInfo.push( intCallInfo );
          }
        });
      });

      destSkGrpInfo.callInfo = callInfo;
      
    }
    this.pca = Math.round((destSkGrpInfo.cans *100 / destSkGrpInfo.callsreceived)).toString();
    if (this.pca ==="NaN")
    destSkGrpInfo.pca = 0;
    else
    destSkGrpInfo.pca = Number(this.pca)

    destSkGrpInfo.pca = destSkGrpInfo.pca;
    return destSkGrpInfo;
  }

}

