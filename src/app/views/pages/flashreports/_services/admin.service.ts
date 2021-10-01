import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BeinUser } from '../model/bein-user.model';
import { BeinOrganization } from '../model/bein-organization.model';
import { AWDBAgent } from '../model/awdbagent.model';
import { Supervisorsummary } from '../model/supervisorsummary.model';
import { Router } from '@angular/router';


@ Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  private  baseUrl = environment.baseUrl;
  private static baseChartUrl = environment.baseChartServiceUrl;
 // private static serviceUrl = AdminService.baseUrl + 'Services/GadgetServices.svc/';
 // private static reportActivityServiceUrl = AdminService.baseChartUrl + '/Services/ReportActivityService.svc/';

  public static userId: number;
  public static isSupervisor = false;
  public static isEgypt = false;
  public static currentBeinUser: BeinUser;

  private awdbAgent = new BehaviorSubject< AWDBAgent >(null);
  public awdbAgent$ = this .awdbAgent.asObservable();

  private currBeinUser = new BehaviorSubject< BeinUser >(null);
  public currBeinUser$ = this .currBeinUser.asObservable();

  private currBeinUserOrgs = new BehaviorSubject< BeinOrganization[] >(null);
  public currBeinUserOrgs$ = this .currBeinUserOrgs.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  setUserId(userId: string): void {
    // if (localStorage.hasOwnProperty("currentUser")) {
    //   userId = JSON.parse(localStorage.getItem('currentUser')).agentid;
    // }
    
    AdminService.userId = parseInt(userId, 10);

console.log('Agentuser ::',AdminService.userId);
    this .getAgentInfoById(AdminService.userId).subscribe(ipccAgent => {
      console.log('devipccAgent ::', ipccAgent);
      if (ipccAgent) {
          this .awdbAgent.next( ipccAgent );
          console.log('devawdbAgent ::', this.awdbAgent);
          // console.log('Received AWDB Agent:: ' + JSON.stringify(ipccAgent, null, 4));
          // console.log('Received AWWDB Agent:: ' + JSON.stringify(this.awdbAgent.source, null, 4));
      }
    });

    this .getUser(AdminService.userId).subscribe(beinUser => {
      AdminService.currentBeinUser = beinUser;
      if ( AdminService.currentBeinUser ) {

        if ( AdminService.currentBeinUser && AdminService.currentBeinUser.type &&
          (AdminService.currentBeinUser.type === 'SUPERVISOR' || AdminService.currentBeinUser.type === 'MANAGER'
            || AdminService.currentBeinUser.firstName.startsWith('HQ')) ) {
          AdminService.isSupervisor = true;
          if( AdminService.currentBeinUser.lastName && AdminService.currentBeinUser.lastName.indexOf('EGY')!=-1 ) {
            AdminService.isEgypt = true;
          }else{
            setTimeout(() => {
              // this .router.navigate(['/callActivityReport'], { queryParamsHandling: "merge" });
            }, 1000);
          }
        }

        this .getUserOrgs( AdminService.userId ).subscribe(userOrgs => {
          // AdminService.userOrgs = userOrgs;
          this .currBeinUserOrgs.next( userOrgs );
        });
      }
      this .currBeinUser.next(beinUser);
    });
  }

  getUser(userId: number): Observable< any > {
    return this .http.get< any >(this.baseUrl + '/api/FlashReports/getBeINUser?userId=' + userId);
  }

  getUserOrgs(userId: number): Observable< any >  {
    return this .http.get< any >(this.baseUrl+ '/api/FlashReports/getBeINUserOrgs?userId=' + userId);
  }

  getAgentInfoById(agentId: number): Observable< any > {
    
    console.log('AgentID ::', agentId);
    return this .http.get< any >(this.baseUrl + '/api/FlashReports/getAgentInfoById?id=' + agentId);
  }

  getAllBeINUsers(): Observable< any > {

    return this .http.get< any >(this.baseUrl + '/api/FlashReports/getAllBeINUsers');
  }

  getAgentById(agentId: string): Observable< any > {
    return this .http.get< any >(this.baseUrl + '/api/FlashReports/getAgentById?id=' + agentId);
  }

  getSupervisorCallSummary(req: Supervisorsummary): Observable< any > {    
    var supCallSummReq = { startDateTime: req.startDateTime, endDateTime : req.endDateTime,  startDateTime_str: req.startDateTime,
        endDateTime_str: req.endDateTime}
    console.log('GetSupervisorCallSummary:GetSupervisorCallSummary: Request: '+ JSON.stringify(req, null, 4) );
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    
    return this .http.post< any >(this.baseUrl + '/api/FlashReports/GetSupervisorCallSummary', supCallSummReq, httpOptions);    
  }

  getSupervisorWiseTaskCounts(req: Supervisorsummary): Observable< any > {
    const tasksReq: Supervisorsummary = new Supervisorsummary();
    console.log('SupervisorsummaryService:getSupervisorWiseTaskCounts: Request: '+ JSON.stringify(req, null, 4) );
    tasksReq.startDateTime = req.startDateTime;
    tasksReq.endDateTime = req.endDateTime;
    tasksReq.startDateTime_str= req.startDateTime;
    tasksReq.endDateTime_str= req.endDateTime;
   
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    return this .http.post< any >(this.baseUrl + '/api/FlashReports/GetSupervisorWiseTaskCounts', tasksReq, httpOptions);    
  }

  getSupervisorTaskSummary(req: Supervisorsummary): Observable< any > {
    const tasksReq: Supervisorsummary = new Supervisorsummary();
    console.log('SupervisorsummaryService:GetSupervisorTaskSummary: Request: '+ JSON.stringify(req, null, 4) );
    tasksReq.startDateTime = req.startDateTime;
    tasksReq.endDateTime = req.endDateTime;
    tasksReq.startDateTime_str= req.startDateTime;
    tasksReq.endDateTime_str= req.endDateTime;
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    return this .http.post< any >(this.baseUrl + '/api/FlashReports/GetSupervisorTaskSummary', tasksReq, httpOptions);    
  }

  uploadFiles(req:FormData):Observable< any >{
    return this .http.post< any >(this.baseUrl + '/api/FlashReports/FileUpload', req);    
  }
}
