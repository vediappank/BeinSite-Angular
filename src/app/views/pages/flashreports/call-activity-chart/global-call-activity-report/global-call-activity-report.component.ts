import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { SkillGroupCallInfo } from '../../model/skill-group-call-info.model';
import { SkillGroupInfo } from '../../model/skill-group-info.model';
import { SkillGroupService } from '../../_services/skill-group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-call-activity-report',
  templateUrl: './global-call-activity-report.component.html',
  styleUrls: ['./global-call-activity-report.component.scss']
})
export class GlobalCallActivityReportComponent implements OnInit, OnChanges, OnDestroy {

  public skGrpInfo: SkillGroupInfo;
  public arSkGrpInfo: SkillGroupInfo;
  public enSkGrpInfo: SkillGroupInfo;
  pca: string;
  public title1 = 'be<b>IN</b> Global';
  public title2 = 'be<b>IN</b> Global - AR';
  public title3 = 'be<b>IN</b> Global - EN';

  private skGrpsInfo: SkillGroupInfo[];
  private skGrpInfoSub: Subscription;

  constructor(private skGrpService: SkillGroupService) {
    this.skGrpInfoSub = this.skGrpService.skGrpInfo$.subscribe(skGrpsInfo => {
      this.skGrpsInfo = skGrpsInfo;
      
      this.calculateInfo();
    });
  }

  ngOnInit() {
    // console.log('Got Skill Group Name: '+this .skillGroupName);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Got Change Skill Group Name: '+this .skillGroupName);
    this.calculateInfo();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.skGrpInfoSub.unsubscribe();
  }

  calculateInfo() {
    
    // console.log('Skill Group Name: '+this .skillGroupName);
    if (this.skGrpsInfo) {
      this.skGrpInfo = new SkillGroupInfo();
      this.arSkGrpInfo = new SkillGroupInfo();
      this.enSkGrpInfo = new SkillGroupInfo();
      this.skGrpInfo.skillName = this.title1;
      this.arSkGrpInfo.skillName = this.title2;
      this.enSkGrpInfo.skillName = this.title3;

      this.skGrpsInfo.forEach(skInfo => {
        if (skInfo.skillName) {
          if (skInfo.skillName.toLowerCase().indexOf('_ar_') != -1) {
            this.arSkGrpInfo = this.populateCallInfo(skInfo, this.arSkGrpInfo);
          } else if (skInfo.skillName.toLowerCase().indexOf('_en_') != -1) {
            this.enSkGrpInfo = this.populateCallInfo(skInfo, this.enSkGrpInfo);
          } else if (skInfo.skillName.toLowerCase().indexOf('morocco') != -1) {
            this.arSkGrpInfo = this.populateCallInfo(skInfo, this.arSkGrpInfo);
          }
          this.skGrpInfo = this.populateCallInfo(skInfo, this.skGrpInfo);
        }
      });
    }
  }

  populateCallInfo(srcSkGrpInfo: SkillGroupInfo, destSkGrpInfo: SkillGroupInfo): SkillGroupInfo {

    // console.log('Source Call Info Length: '+ srcSkGrpInfo.skillName+'::'+srcSkGrpInfo.callInfo.length);
    destSkGrpInfo.coff += srcSkGrpInfo.coff;
    destSkGrpInfo.chan += srcSkGrpInfo.chan;
    destSkGrpInfo.cans += srcSkGrpInfo.cans;
    destSkGrpInfo.cabn += srcSkGrpInfo.cabn;
    destSkGrpInfo.cerr += srcSkGrpInfo.cerr;
    destSkGrpInfo.tht += srcSkGrpInfo.tht;
    destSkGrpInfo.ttt += srcSkGrpInfo.ttt;
    destSkGrpInfo.trt += srcSkGrpInfo.trt;
    destSkGrpInfo.callsreceived += srcSkGrpInfo.callsreceived;

    

    if (destSkGrpInfo.callInfo && destSkGrpInfo.callInfo.length == 0) {
      destSkGrpInfo.callInfo = srcSkGrpInfo.callInfo;
    } else {
      let callInfo: SkillGroupCallInfo[];
      let srcCallInfo: SkillGroupCallInfo; let destCallInfo: SkillGroupCallInfo; let intCallInfo: SkillGroupCallInfo;
      callInfo = [];

      let maxCallInfoLen = 48;
      if (destSkGrpInfo.callInfo.length > srcSkGrpInfo.callInfo.length) {
        maxCallInfoLen = destSkGrpInfo.callInfo.length;
      } else {
        maxCallInfoLen = srcSkGrpInfo.callInfo.length;
      }

      for (var i = 0; i < maxCallInfoLen; i++) {
        srcCallInfo = srcSkGrpInfo.callInfo[i];
        destCallInfo = destSkGrpInfo.callInfo[i];
        if (srcCallInfo && destCallInfo) {
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
          intCallInfo.callsreceived = destCallInfo.callsreceived + srcCallInfo.callsreceived;
          this.pca = Math.round((intCallInfo.cans * 100 / intCallInfo.callsreceived)).toString();
           if (this.pca ==="NaN")
           intCallInfo.pca = 0;
           else
             intCallInfo.pca = Number(this.pca)
          callInfo.push(intCallInfo);
        } else if (srcCallInfo) {
           this.pca = Math.round((srcCallInfo.cans * 100 / srcCallInfo.callsreceived)).toString();
           if (this.pca ==="NaN")
           srcCallInfo.pca = 0;
           else
           srcCallInfo.pca = Number(this.pca);

          callInfo.push(srcCallInfo);
        } else if (destCallInfo) {

           this.pca = Math.round((destCallInfo.cans * 100 / destCallInfo.callsreceived)).toString();
           if (this.pca ==="NaN")
           destCallInfo.pca = 0;
           else
           destCallInfo.pca = Number(this.pca);
         
          callInfo.push(destCallInfo);
        }
      }
      
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
