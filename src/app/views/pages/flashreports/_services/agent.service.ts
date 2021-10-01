import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AgentStatisticsRequest } from '../model/agent-statistics-request.model';
import { AgentReportActivity } from '../model/agent-report-activity.model';

@ Injectable({
  providedIn: 'root'
})
export class AgentService {
  private  baseUrls = environment.baseUrl;
  private static baseUrl = environment.baseChartServiceUrl;
  // private static serviceUrl = AgentService.baseUrl + '/Services/AgentService.svc/';
  // private static reportActivityServiceUrl = AgentService.baseUrl + '/Services/ReportActivityService.svc/';

  constructor(private http: HttpClient) { }

  getAgentStatistics(req: AgentStatisticsRequest): Observable< any > {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    };
    return this .http.post< any >(this.baseUrls + '/api/FlashReports/getAgentStatistics/', req, httpOptions);
  }

  getAllAgentStatistics(req: AgentStatisticsRequest): Observable< any > {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    };
    return this .http.post< any >(this.baseUrls + '/api/FlashReports/getAllAgentStatistics/', req, httpOptions);
  }

  getAllAgentSummaryStatistics(req: AgentStatisticsRequest): Observable< any > {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    };
    return this .http.post< any >(this.baseUrls+ '/api/FlashReports/getAllAgentSumStatistics/', req, httpOptions);
  }

  addAgentReportActivity(req: AgentReportActivity): Observable< any > {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    };
    return;
    //this .http.post< any >(this.baseUrls + '/api/FlashReports/addAgRepAct/', req, httpOptions);
  }

  getFloorPerformance(): Observable< any > {
    return this .http.get< any >(this.baseUrls + '/api/FlashReports/getFloorPerformance/');
  }

}
