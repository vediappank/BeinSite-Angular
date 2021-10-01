import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SkillGroupInfo } from '../model/skill-group-info.model';

@ Injectable({
  providedIn: 'root'
})
export class SkillGroupService {
  private  baseUrls = environment.baseUrl;
  private static baseUrl = environment.baseChartServiceUrl;
  // private static serviceUrl = SkillGroupService.baseUrl + '/Services/SkillGroupService.svc/';

  private skGrpInfo = new BehaviorSubject< SkillGroupInfo[] >(null);
  public skGrpInfo$ = this .skGrpInfo.asObservable();

  constructor(private http: HttpClient) {}

  populateSkGrpInfo(dateStr: string) {
    if( ! dateStr ) {
      dateStr = Date.now().toLocaleString();
      dateStr = this .dateAsYYYYMMDDHHNNSS(new Date());
    }
    console.log('Current Date: '+ dateStr);
    this .getSkGrpInfo(dateStr).subscribe(skGrpsInfo => {
      
      if (skGrpsInfo) {
          this .skGrpInfo.next( skGrpsInfo );
          // console.log('Received Skill Group Info:: ' + JSON.stringify(this .skGrpInfo.source, null, 4));
      }
    });
  }

  getSkGrpInfo(dateStr: string): Observable< any > {
    return this .http.get< any >(this.baseUrls + '/api/FlashReports/getSkillGroupInfo?dateStr=' + dateStr);
  }

  dateAsYYYYMMDDHHNNSS(date): string {
    return date.getFullYear()
              + '-' + this .leftpad(date.getMonth() + 1, 2)
              + '-' + this .leftpad(date.getDate(), 2);
  }

  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }

}
