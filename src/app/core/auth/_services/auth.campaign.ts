// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../../environments/environment';
// CRUD
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../../_base/crud';
import { CampaignModel } from '../_models/campaign/campaign.model';
import { CampaignRequestModel } from '../_models/campaign/campaignrequest.model';
import { ActiveAgentModel } from '../../../views/pages/operations/reskillingskillgroups/Model/activeagentmodel';
import { SkillGroupModel } from '../../../views/pages/operations/reskillingskillgroups/Model/skillgroupmodel';
import { SkillGroupSkillTypeModel } from '../../../views/pages/operations/reskillingskillgroups/Model/skillgroupskilltypemodel'
import { SkillGroupMappingModel } from '../../../views/pages/operations/reskillingskillgroups/Model/skillgroupmappingmodel';
import { SkillGroupMappingFilterModel } from '../../../views/pages/operations/reskillingskillgroups/Model/skillgroupmappingfilter';
import { SkillGroupUpdateModelFilter } from '../../../views/pages/operations/reskillingskillgroups/Model/SkillGroupUpdateModelFilter';
import { SkillGroupEditInboundUpdateModel } from '../../../views/pages/operations/reskillingskillgroups/Model/skillgroupinboundModel';
import { CampaignUploadJobModel } from '../_models/campaign/campaignuploadJob.Model';
import { CampaignUploadJobDetailModel } from '../_models/campaign/campaignuploadjobdetail.model'



@Injectable()
export class AuthCampaignService {

    public isTokenFlag: boolean = false;
    public Token: any;
    public PostToken: any;
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService, private router: Router,) {

    }

    //SkillGroups Methods
      // getAllActiveAgents
      getAllActiveAgents(roleid:string): Observable<ActiveAgentModel[]> {
        if (this.hasTokenProperty()) {
            return this.http.get<ActiveAgentModel[]>(this.baseUrl + '/api/BeINMaximus/GetActiveAgents?roleid='+ roleid, { headers: this.Token });
            // return this.http.get<Role[]>(API_ROLES_URL);
        }
    }
    getAllSkillGroups(): Observable<SkillGroupModel[]> {
        if (this.hasTokenProperty()) {
            return this.http.get<SkillGroupModel[]>(this.baseUrl + '/api/BeINMaximus/GetAllSkillGroups', { headers: this.Token });
            // return this.http.get<Role[]>(API_ROLES_URL);
        }
    }
    getAllSkillGroupsBySkillType(): Observable<SkillGroupSkillTypeModel[]> {
        if (this.hasTokenProperty()) {
            return this.http.get<SkillGroupSkillTypeModel[]>(this.baseUrl + '/api/BeINMaximus/GetAllSkillGroupsBySkillType', { headers: this.Token });
        
        }
    }
    getAllSkillMappings(req: SkillGroupMappingFilterModel): Observable<SkillGroupMappingModel[]> {
        if (this.hasTokenProperty()) {
            return this.http.post<SkillGroupMappingModel[]>(this.baseUrl + '/api/BeINMaximus/GetAllSkillGroupMapping', req, { headers: this.Token });
            
            
        }
    }
    UpdateSkillGroupAgentsAsync(req: SkillGroupUpdateModelFilter): Observable<any> {
        if (this.hasTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/UpdateSkillGroupAgentsAsync', req, { headers: this.Token });
            
            
        }
    }

    getAllSkillMappingsForAgents(req: SkillGroupMappingFilterModel): Observable<any[]> {
        if (this.hasTokenProperty()) {
            return this.http.post<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllSkillGroupMappingForAgent', req, { headers: this.Token });                        
        }
    }

    getAllSkillGroupsByAgent(skill_target_id: any): Observable<any[]> {
        if (this.hasTokenProperty()) {            
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllSkillGroupsByAgent?agent_skill_target_id='+skill_target_id, { headers: this.Token });
        }
    }

    EnableDisableInboundOutboundSkillGroupByAgent(req: SkillGroupEditInboundUpdateModel): Observable<string> {
        if (this.hasTokenProperty()) {
            return this.http.post<string>(this.baseUrl + '/api/BeINMaximus/EnableDisableInboundOutboundSkillGroupByAgent', req, { headers: this.Token });                        
        }
    }

    EditEnableDisableInboundSkillGroupByAgent(req: SkillGroupEditInboundUpdateModel): Observable<string> {
        if (this.hasTokenProperty()) {
            return this.http.post<string>(this.baseUrl + '/api/BeINMaximus/EditEnableDisableInboundSkillGroupByAgent', req, { headers: this.Token });                        
        }
    }

    //Campaign Methods

    getAllCampaign(): Observable<CampaignModel[]> {
        if (this.hasTokenProperty())
            return this.http.get<CampaignModel[]>(this.baseUrl + '/api/Campaign/GetAllCampaign', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    submitCampign(req: FormData): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'multipart/form-data'
            })
        }
        if (this.hasTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/Campaign/InsertCampign', req, { headers: this.Token });
        }
    }

    updateCampignJob(req: CampaignUploadJobModel): Observable<any> {
        if (this.hasTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/Campaign/UpdateCampignUploadJob', req, { headers: this.Token });
        }
    }

    GetAllCampaignUploadJob(pagenumber:number,pagesize:number): Observable<CampaignUploadJobModel[]> {
        if (this.hasTokenProperty())
            return this.http.get<CampaignUploadJobModel[]>(this.baseUrl + '/api/Campaign/GetAllCampaignUploadJob?pagenumber='+pagenumber+'&pagesize='+pagesize, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    GetAllCampaignUploadJobDetail(jobid: number,pagenumber:number,pagesize:number): Observable<CampaignUploadJobDetailModel[]> {
        if (this.hasTokenProperty())
            return this.http.get<CampaignUploadJobDetailModel[]>(this.baseUrl + '/api/Campaign/GetAllCampaignUploadJobDetail?jobid='+ jobid+'&pagenumber='+pagenumber+'&pagesize='+pagesize, { headers: this.Token }).pipe(catchError(this.handleError));
    }  


    hasTokenProperty() {
        if (localStorage.hasOwnProperty('currentUser')) {
            this.Token = { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token };
            this.isTokenFlag = true;
            return this.isTokenFlag;
        }
        return false;
    }

    hasPostTokenProperty() {
        if (localStorage.hasOwnProperty('currentUser')) {
            this.PostToken = {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
                    'Content-Type': 'application/json'
                }
            };
            this.isTokenFlag = true;
            return this.isTokenFlag;
        }
        return false;
    }

    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }

}



