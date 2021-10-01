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
// Models
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { CCKpi } from '../_models/cckpi.model';
import { MeetingModel } from '../_models/meeting.model';
import { ActionTracker } from '../_models/actiontracker.model';
import { ActionTrackerTopicNames } from '../_models/actiontrackertopicnames.model';
import { ActionTrackerTopicStatus } from '../_models/actiontrackertopicstatus.model';
import { ActionTrackerTopicPriority } from '../_models/actiontrackertopicpriority.model';
import { ActionTrackerTopic } from '../_models/actiontrackertopic.model';
import { ActionTrackerTopicConversation } from '../_models/actiontrackertopicconversation.model';

import { privilege } from '../_models/privilege.model';
import { CCRole } from '../_models/ccrole.model';
import { CallCenter } from '../_models/callcenter.model';
import { CCActivity } from '../_models/ccactivity.model';
import { AgentActivityRequest } from '../../../views/pages/reports/_models/agentactivityrequest.model';
import { AgentAttritionRequest } from '../_models/agentattritionrequest.model';
import { AgentHirringRequest } from '../_models/agenthirringrequest.model';
import { AgentRatioRequest } from '../_models/agentratiorequest.model';
import { CallMetricsRequest } from '../_models/callmetricsreports.model';
import { ManualOutboundRequest } from '../_models/maualoutboundrequest.model';
import { WhatsUpRequest } from '../_models/whatsuprequest.model';
import { AbsentiesRequest } from '../../../views/pages/reports/_models/absentiesreuest.model';
import { History } from '../_models/history.model';
import { FinanceRequest } from '../../../views/pages/reports/_models/financerequest.model';
import { TicketLogAccuracyRequest } from '../_models/ticketlogaccuracyreport.model';
import { AgentInfoRequest } from '../_models/agentinforequest.model';
import { SupervisorInfoRequest } from '../../../views/pages/reports/_models/SupervisorInfo.model';
import { QualityRequest } from '../_models/qualityrequest.model';
import { ChangePasswordModel } from '../../../views/pages/userprofile/_model/changepasswordrequest.model';

import { CCRatioDetailRequest } from '../_models/ccratiodetailrequest.model';
import { CCDashboardRequest } from '../../../views/pages/dashboard/_models/ccdashboardrequest.model';
import { InputRequest } from '../../../views/pages/dashboard/_models/inputrequest.model';
import { ActivityWidgetRequest } from '../../../views/pages/dashboard/_models/activitywidgetrequest.model';
import { CCAbsentiesRequest } from '../../../views/pages/dashboard/_models/ccabsentiesrequest.model';
import { CCBillingRequest } from '../../../views/pages/dashboard/_models/billing.model';
import { CCOutBoundRequest } from '../../../views/pages/dashboard/_models/ccoutboundrequest.model';
import { CCInboundRequest } from '../../../views/pages/dashboard/_models/ccinboundrequest.model';
import { CCCUSTEXPRequest } from '../../../views/pages/dashboard/_models/cccustexprequest.model';
import { CCWhatsAppRequest } from '../../../views/pages/dashboard/_models/ccwhatsapprequest.model';
import { CCTimeMgtDetailRequest } from '../../../views/pages/dashboard/_models/cctimemgtdetail.model';
import { CCFinanceRequest } from '../../../views/pages/dashboard/_models/ccfinancerequest.model';
import { CCHiringRequest } from '../../../views/pages/dashboard/_models/cchiringrequest.model';
import { FDGroupModel } from '../_models/fdgroups.model';
import { AgentForecastModel } from '../../../views/pages/forecast/model/agentforecast.model';
import { AgentForeCastRequestModel } from '../../../views/pages/forecast/model/agentforecastrequest.model';
import { UserActivateModel } from '../../../views/pages/user-management/users/_model/useractivate.model';
import { UserDeActivateModel } from '../../../views/pages/user-management/users/_model/userdeactivate.model';
import { CCCallMetricsRequest } from '../../../views/pages/dashboard/_models/cccallmetricsrequest.model';
import { OutboundDashboard } from '../../../views/pages/dashboard/_models/outbounddashboard.model';

//User Activity Models
import { UserActivityRequest } from '../../../views/pages/reports/_models/useractivityrequest.model';
import { UserCCRoleRequest } from '../../../views/pages/reports/_models/userccrolerequest.model';
import { UserOrganizationRequest } from '../../../views/pages/reports/_models/userorganizationrequest.model';
import { UserRoleRequest } from '../../../views/pages/reports/_models/userrolerequest.model';
import { UserSupervisorRequest } from '../../../views/pages/reports/_models/usersupervisorrequest.model';

// Agent Absenties Models
import { AgentAbsentiesDetailsRequest } from '../../../views/pages/reports/_models/agentabsentiesdetailsrequest.model';
import { AgentAbsentiesSummaryRequest } from '../../../views/pages/reports/_models/agentabsentiessummaryrequest.model';
import { MAssessmentFormList } from '../../../views/pages/reports/_models/assessmentformlist.model';
import { AssessmentFormAverageRequest } from '../../../views/pages/reports/_models/assessmentformaveragerequest.model';
import { AssessmentFormDetailsRequest } from '../../../views/pages/reports/_models/assessmentformdetailsrequest.model';
import { ActionTrackerTopicOwner } from '../_models/actiontrackertopicowner.model';
import { CalendarTask } from '../_models/calendartask.model';
import { SaleCallBackTaskFilter } from '../_models/salescallbacktaskfilter.model';
import { SalesCallBackTaskUsers } from '../_models/salescallbacktaskusers.model';
import { SalesCallBackTaskStatus } from '../_models/salescallbacktaskstatus.model';
import { SaleCallBackTaskActivity } from '../_models/salescallbacktaskactivity.model';
import {AgentCallInfoFilter} from '../../../views/pages/reports/_models/agentcallinfofilter.model';

import { Voucher } from '../_models/voucher/voucher.model';
import { UploadVoucherInputRequest } from '../_models/voucher/uploadvoucherrequest.model';
import { VoucherFilter } from '../_models/voucher/VoucherFilter.model';
// ActionTracker Model
// import {ActionTracker} from '../_models/actiontracker.model';
// import {ActionTrackerTopic} from '../_models/actiontrackertopic.model';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

@Injectable()
export class AuthService {
    public loggedIn: boolean;
    public isTokenFlag: boolean = false;
    public Token: any;
    public PostToken: any;
    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService, private router: Router) {

    }


    private _loggedIn: boolean;

    setLogin(item: boolean) {
        this._loggedIn = item;
    }

    getLogin(): boolean {
        return this._loggedIn;
    }

    // Authentication/Authorization
    login(username: string, password: string): Observable<User> {
        if (!username || !password) {
            return of(null);
        }
        var data = "grant_type=password&username=" + username + "&password=" + password;
        return this.http.post<User>(this.baseUrl + '/token', data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    }

    refresh_token(refreshToken: string): Observable<User> {
        if (!refreshToken ) {
            return of(null);
        }
        var data = "grant_type=refresh_token&refresh_token=" + refreshToken;
        return this.http.post<User>(this.baseUrl + '/token', data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    }


    verify(): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/Verify', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    getRoleCollection(): Observable<any> {
        if (this.hasTokenProperty()) {
            return this.http.get(this.baseUrl + '/api/BeINMaximus/GetRole', { headers: this.Token }).pipe(catchError(this.handleError));
        }
    }

    // getAllUsers(pagenumber:number,pagesize:number): Observable<User[]> {
    //     if (this.hasTokenProperty())
    //     {           
    //         let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
    //         return this.http.post<User[]>(this.baseUrl + '/api/BeINMaximus/GetAllUser?user_id='+currentUser.agentid+'&pagenumber='+pagenumber+'&pagesize='+pagesize, { headers: this.Token }).pipe(catchError(this.handleError));
    //     }
    // }
    getAllUsers(filter : any): Observable<User[]> {
        if (this.hasTokenProperty())
        {           
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            return this.http.post<User[]>(this.baseUrl + '/api/BeINMaximus/GetAllUser',filter ,{ headers: this.Token }).pipe(catchError(this.handleError));
        }
    }
    getAllCallTypes(): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllCallTypes', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getUserById(userId: number): Observable<User> {
        if (this.hasTokenProperty())
            return this.http.get<User>(this.baseUrl + '/api/BeINMaximus/GetUser?UserId=' + userId, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getUserByOrganization(OrganizationId: Number): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetUserByOrganization?OrganizationId=' + OrganizationId, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    GetAllSupervisosr(): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllSupervisor', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllActivity(): Observable<User[]> {
        if (this.hasTokenProperty())
            return this.http.get<User[]>(this.baseUrl + '/api/BeINMaximus/GetAllActivitys', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllAttrition(): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllAttrition', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllCCRoles(): Observable<User[]> {
        if (this.hasTokenProperty())
            return this.http.get<User[]>(this.baseUrl + '/api/BeINMaximus/GetAllCCRoles', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllCCMasterRoles(): Observable<CCRole[]> {
        if (this.hasTokenProperty())
            return this.http.get<CCRole[]>(this.baseUrl + '/api/BeINMaximus/GetAllCCRoles', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetUserActivityHistory(user_id: number): Observable<History[]> {
        if (this.hasTokenProperty())
            return this.http.get<History[]>(this.baseUrl + '/api/BeINMaximus/GetUserActivityHistory?user_id=' + user_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetUserWorkHistory(user_id: number): Observable<History[]> {
        if (this.hasTokenProperty())
            return this.http.get<History[]>(this.baseUrl + '/api/BeINMaximus/GetUserWorkHistory?user_id=' + user_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetUserRoleHistory(user_id: number): Observable<History[]> {
        if (this.hasTokenProperty())
            return this.http.get<History[]>(this.baseUrl + '/api/BeINMaximus/GetUserRoleHistory?user_id=' + user_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetUserCCRoleHistory(user_id: number): Observable<History[]> {
        if (this.hasTokenProperty())
            return this.http.get<History[]>(this.baseUrl + '/api/BeINMaximus/GetUserCCRoleHistory?user_id=' + user_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetUserSupervisorHistory(user_id: number): Observable<History[]> {
        if (this.hasTokenProperty())
            return this.http.get<History[]>(this.baseUrl + '/api/BeINMaximus/GetUserSupervisorHistory?user_id=' + user_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllOrganizations(): Observable<User[]> {
        if (this.hasTokenProperty())
            return this.http.get<User[]>(this.baseUrl + '/api/BeINMaximus/GetAllOrg?org_id=2', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllOrganizationsByAgentRole(AgentId : number): Observable<User[]> {
        if (this.hasTokenProperty())
            return this.http.get<User[]>(this.baseUrl + '/api/BeINMaximus/GetAllOrganizationsByAgentRole?agentid='+ AgentId, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    // GetAllMainMenu(roleid: number): Observable<any> {
    //     if (this.hasTokenProperty())
    //         return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetAllMainMenu?role_id=' + roleid, { headers: this.Token }).pipe(catchError(this.handleError));
    // }
    GetAllMainMenu(): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetAllMainMenu', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetRoleMenuCollection(role_id : number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetRoleMenuCollection?role_id='+ role_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetOrgTreeConfig(role_id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOrgTreeConfig?roleid=' + role_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllPrivileges(): Observable<privilege[]> {
        if (this.hasTokenProperty())
            return this.http.get<privilege[]>(this.baseUrl + '/api/BeINMaximus/GetAllPrivileges', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetMenuConfig(): Observable<any> {
        
        console.log('Auth Service: GetMenuConfig: Token Property Present:'+ this.hasTokenProperty());
        if (this.hasTokenProperty()) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetMenuConfig?role_id=' + currentUser.role_id, { headers: this.Token }).pipe(catchError(this.handleError));
        }
    }
    GetRoleReportsList(): Observable<any> {
        if (this.hasTokenProperty()) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetRoleReports?role_id=' + currentUser.role_id, { headers: this.Token }).pipe(catchError(this.handleError));
        }
    }
    GetRoleReportsCategory(): Observable<any> {
        if (this.hasTokenProperty()) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetRoleReportsCategory?role_id=' + currentUser.role_id, { headers: this.Token }).pipe(catchError(this.handleError));
        }
    }
    // UPDATE => PUT: update the role on the server
    deleteCCRole(roleid: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteCCRole?role_id=' + roleid, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    GetAllMasterActivity(): Observable<CCActivity[]> {
        if (this.hasTokenProperty())
            return this.http.get<CCActivity[]>(this.baseUrl + '/api/BeINMaximus/GetAllActivitys', { headers: this.Token }).pipe(catchError(this.handleError));

    }
    updateUser(_user: User): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/InsertUser', _user, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    activateUser(_user: UserActivateModel): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/ActivateUser', _user, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    deActivateUser(userid: number, attritionid: number, description: string): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeActivateUser?userid=' + userid + '&attritionid=' + attritionid + '&description=' + description, { headers: this.Token }).pipe(catchError(this.handleError));
    }



    createRole(role: Role): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/RoleMainMenuMappingInsert', role, this.PostToken).pipe(catchError(this.handleError));
    }

    updateRole(role: Role): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/RoleMainMenuMappingUpdate', role, this.PostToken).pipe(catchError(this.handleError));
    }
    deleteRole(role_id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteRole?role_id=' + role_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    createCCRole(role: CCRole): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/InsertCCRole', role, this.PostToken).pipe(catchError(this.handleError));
    }

    updateCCRole(role: CCRole): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/UpdateCCRole', role, this.PostToken).pipe(catchError(this.handleError));
    }


    createCCActivity(Activity: CCActivity): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/InsertCCActivity', Activity, this.PostToken).pipe(catchError(this.handleError));
    }

    updateCCActivity(Activity: CCActivity): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/UpdateCCActivity', Activity, this.PostToken).pipe(catchError(this.handleError));
    }

    deleteCCActivity(Activityid: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteCCActivity?activity_id=' + Activityid, { headers: this.Token }).pipe(catchError(this.handleError));
    }


    // CREATE =>  POST: add a new role to the server
    createCCKpi(cckpi: CCKpi): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/InsertCCKPI', cckpi, this.PostToken).pipe(catchError(this.handleError));
    }
    // UPDATE => PUT: update the role on the server
    updateCCkpi(cckpi: CCKpi): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/UpdateCCKPI', cckpi, this.PostToken).pipe(catchError(this.handleError));
    }
    deleteCCKpi(kpiid: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteCCKPI?kpi_id=' + kpiid, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    // GetAllCallCenter(): Observable<any[]> {
    //     if (this.hasTokenProperty())
    //         return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllCallCenters', { headers: this.Token }).pipe(catchError(this.handleError));
    // }
    GetAllCCKpi(): Observable<CCKpi[]> {
        if (this.hasTokenProperty())
            return this.http.get<CCKpi[]>(this.baseUrl + '/api/BeINMaximus/GetAllCCKpi', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    findCCKpi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls        
        return this.http.get<CCKpi[]>(this.baseUrl + '/api/BeINMaximus/GetAllCCKpi', { headers: this.Token }).pipe(
            mergeMap(res => {
                const result = this.httpUtils.baseFilter(res, queryParams, []);
                return of(result);
            })
        );
    }

    GetAllDashboardModules(role_id: number): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllDashboardModules?role_id=' + role_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllModulePermission(role_id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/GetAllModulePermission?role_id=' + role_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    //Meetings

    createMeeting(meeting: MeetingModel): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/InsertMeeting', meeting, this.PostToken).pipe(catchError(this.handleError));
    }
    // UPDATE => PUT: update the role on the server
    updateMeeting(meeting: MeetingModel): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/UpdateMeeting', meeting, this.PostToken).pipe(catchError(this.handleError));
    }
    ApproveMeeting(meeting: MeetingModel): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/ApproveMeeting', meeting, this.PostToken).pipe(catchError(this.handleError));
    }
    deleteMeeting(meetingid: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteMeeting?meeting_id=' + meetingid, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllMeeting(): Observable<MeetingModel[]> {
        if (this.hasTokenProperty())
            return this.http.get<MeetingModel[]>(this.baseUrl + '/api/BeINMaximus/GetAllMeetings', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    findMeeting(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls        
        return this.http.get<MeetingModel[]>(this.baseUrl + '/api/BeINMaximus/GetAllMeetings', { headers: this.Token }).pipe(
            mergeMap(res => {
                const result = this.httpUtils.baseFilter(res, queryParams, []);
                return of(result);
            })
        );
    }

    //Start Reports Service
    GetAgentActivityReport(req: AgentActivityRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentActivityReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAgentRatioReport(req: AgentRatioRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentRatioReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAgentHirringReport(req: AgentHirringRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentHirringReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAgentAttritionReport(req: AgentAttritionRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentAttritionReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetCallMtricsReport(req: CallMetricsRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCallMtricsReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetManulOutboundReport(req: ManualOutboundRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetManualoutboundReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetWhatsUpReport(req: WhatsUpRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetWhatsUpReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAbsentiesReport(req: AbsentiesRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAbsentiesReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetFinanceReport(req: FinanceRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetFinanceReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetFinance_Detail(req: CCFinanceRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetFinance_Detail', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetTicketLogAccuracyReport(req: TicketLogAccuracyRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetTicketsLogAccuracyReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAgentInfoReport(req: AgentInfoRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentInfoReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAgentCallInfo(req: AgentCallInfoFilter): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAllAgentCallDetails', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetSupervisorInfoReport(req: SupervisorInfoRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetSupervisorInfoReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetQualityReport(req: QualityRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetQualityReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetCCHiringSummary(req: CCHiringRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetHiringSummaryReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetCCCallMetricssummary(req: CCCallMetricsRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCallMetricsSummary', req, this.PostToken).pipe(catchError(this.handleError));
    }


    // user activity reports start
    GetUserActivityReport(req: UserActivityRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetUserActivityReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetUserCCRoleReport(req: UserCCRoleRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetUserCCRoleReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetUserOrganizationReport(req: UserOrganizationRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetUserOrganizationReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetUserRoleReport(req: UserRoleRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetUserRoleReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetUserSupervisorReport(req: UserSupervisorRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetUserSupervisorReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    // user activity reports end

    // Agent Absenties Reports start

    GetAgentAbsentiesSummaryReport(req: AgentAbsentiesSummaryRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentAbsenceSummaryReport', req, this.PostToken).pipe(catchError(this.handleError));
    }
    GetAgentAbsentiesDetailsReport(req: AgentAbsentiesDetailsRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAgentAbsencedetailsReport', req, this.PostToken).pipe(catchError(this.handleError));
    }

    GetAssessmentFormAverageReport(req: AssessmentFormAverageRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAssessmentFormAverageReport', req, this.PostToken).pipe(catchError(this.handleError));
    }

    GetAssessmentFormDetailsReport(req: AssessmentFormDetailsRequest): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAssessmentFormDetailsReport', req, this.PostToken).pipe(catchError(this.handleError));
    }

    // End

    // Assessment Forms average List
    // GetAllAssessmentFormList(): Observable<MAssessmentFormList[]> { 
    //     
    //     console.log('response Data before:::');   
    //    var data= this.http.get<MAssessmentFormList[]>(this.baseUrl + '/api/BeINMaximus/GetAllAssessmentFormList',{ headers: this.PostToken }).pipe(catchError(this.handleError));
    //    console.log('response Data:::'+JSON.stringify(data));
    // return data;
    // }

    GetAllAssessmentFormList(): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetAllAssessmentFormList', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    GetAllAgentSkillGroupMappingList(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetAgentSkillGroupMappingReport', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // findCompany(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
    //     console.log('response Data before findCompany:::');   
    //     // This code imitates server calls
    //     return this.http.get<MAssessmentFormList[]>(this.baseUrl + '/api/Maximus/GetAllAssessmentFormList',{ headers: this.PostToken }).pipe(
    //         mergeMap(res => {

    //             let Companyelectedlist:MAssessmentFormList[];              
    //             // Companyelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());

    //             Companyelectedlist = res;
    //             const result = this.httpUtils.baseFilter(Companyelectedlist, queryParams, []);
    //             return of(result);
    //         })
    //     );
    // }

    //End Reports Service

    //UserProfile
    GetChangePassword(req: ChangePasswordModel): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/ChangePassword', req, this.PostToken).pipe(catchError(this.handleError));
    }
    //UserProfile

    //Dashboard Services
    GetAgentDashboardDetails(): Observable<any> {

        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetAgentDashboardDetails', this.PostToken).pipe(catchError(this.handleError)).pipe(catchError(this.handleError));
    }
    GetCSQDashboardDetails(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetCSQDashboardDetails', this.PostToken).pipe(catchError(this.handleError));
    }
   
    GetDashboardSideBarDetails(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetDashboardSideBarDetails', this.PostToken).pipe(catchError(this.handleError));
    }

    GetOutboundSkillGroupDetails(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOutboundSkillGroupDetails', this.PostToken).pipe(catchError(this.handleError));
    }

    GetOutboundAgentDetails(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOutboundAgentDetails', this.PostToken).pipe(catchError(this.handleError));
    }

    GetOutboundDashboardDetails(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOutboundDashboardDetails', this.PostToken).pipe(catchError(this.handleError));
    }
    GetOutboundDailerDetailSummary(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOutboundDailerDetailSummary', this.PostToken).pipe(catchError(this.handleError));

    }
    GetOutboundSummaryRTDetails(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOutboundSummaryRTDetails', this.PostToken).pipe(catchError(this.handleError));
    }

    GetOutboundCountryContactsInfo(): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/BeINMaximus/GetOutboundCountryContactsInfo', this.PostToken).pipe(catchError(this.handleError));
    }

    GetCCRatioDashboard(req: CCDashboardRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCRatioDashboard', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCCRatioDetailDashboard(req: CCRatioDetailRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCRatioDetail', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCallCenterTimeMgtSummary(req: CCRatioDetailRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCallCenterTimeMgtSummary', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetQualityTOTAVGDetail(req: InputRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetQualityTOTAVGDetail', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetQualityAGTEVALDetail(req: InputRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetQualityTOT_AVG_AGT_Detail', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetQualityNOTEVALDetail(req: InputRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetQualityNOTEVALDetail', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetActivityDetail(req: ActivityWidgetRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetActivityWidgetDetail', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetAbsentiesChartReport(req: CCAbsentiesRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetAbsentiesChartReport', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetBillingChartReport(req: CCBillingRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetBillingChartReport', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCCOutboundSummaryReport(req: CCOutBoundRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCOutboundSummaryReport', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCCInboundSummaryReport(req: CCInboundRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCInboundSummaryReport', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCCWhatsAppSummaryReport(req: CCWhatsAppRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCWhatsAppSummaryReport', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCCCustExpSummaryReport(req: CCCUSTEXPRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCCUSTEXPPerformanceSummaryReport', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }
    GetCCTimeMgtDetail(req: CCTimeMgtDetailRequest): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetCCTimeMgtDetail', req, this.PostToken).pipe(catchError(this.handleError));
        }
    }



    GetFDGroupCollection(): Observable<FDGroupModel[]> {
        if (this.hasTokenProperty())
            return this.http.get<FDGroupModel[]>(this.baseUrl + '/api/BeINMaximus/GetFDGroups', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    //End Dashboard Services

    //Region ForeCast
    createForeCast(forecast: AgentForecastModel): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/InsertForeCast', forecast, this.PostToken).pipe(catchError(this.handleError));
    }

    lockForeCast(forecast: AgentForeCastRequestModel): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/LockForeCast', forecast, this.PostToken).pipe(catchError(this.handleError));
    }

    GetAlllockforeCast(req: AgentForeCastRequestModel): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetLockForeCast', req, this.PostToken).pipe(catchError(this.handleError));
        }

    }

    GetAllforeCast(req: AgentForeCastRequestModel): Observable<any> {
        if (this.hasPostTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/GetForeCast', req, this.PostToken).pipe(catchError(this.handleError));
        }

    }


    register(user: User): Observable<any> {
        user.userroleid = 2; // Manager
        user.refreshToken = 'access-token-' + Math.random();

        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
            .pipe(
                map((res: User) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    requestPassword(email: string): Observable<any> {
        return this.http.get(API_USERS_URL).pipe(
            map((users: User[]) => {
                if (users.length <= 0) {
                    return null;
                }
                const user = find(users, function (item: User) {
                    return (item.email.toLowerCase() === email.toLowerCase());
                });
                if (!user) {
                    return null;
                }
                user.password = undefined;
                return user;
            }),
            catchError(this.handleError('forgot-password', []))
        );
    }

    getUserByToken(): Observable<User> {
        
        try {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            // alert('getUserByToken services:::'+ currentUser.token);
            if (!currentUser.token) {
                return of(null);
            }
            return this.getUserById(currentUser.agentid).pipe(
                map((result: User) => {
                    // alert('inside<<<<<<<'+ currentUser.token);
                    return result;
                })
            );
        }
        catch (ex) {
            // alert('exception:::'+ ex);
        }
    }

    // Users

    // CREATE =>  POST: add a new user to the server
    createUser(user: User): Observable<User> {
        const httpHeaders = new HttpHeaders();
        // Note: Add headers if needed (tokens/bearer)
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders });
    }

    // READ




    // DELETE => delete the user from the server
    deleteUser(userId: number) {
        const url = `${API_USERS_URL}/${userId}`;
        return this.http.delete(url);
    }



    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const filter: any = {};
		filter.ID = undefined;
		filter.UserName = '';
		filter.CallCenter = '';
		filter.LastName = '';
		filter.FirstName = '';
		filter.UserRole = '';
		filter.CCRole = '';
        filter.Status = '';
        filter.PageNumber = 0;
        filter.PageSize= 0;
        return this.getAllUsers(filter).pipe(
            mergeMap((response: User[]) => {
                const result = this.httpUtils.baseFilter(response, queryParams, []);
                return of(result);
            })
        );
    }

    // Permissions
    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        const allRolesRequest = this.http.get<Permission[]>(API_PERMISSION_URL);
        const roleRequest = roleId ? this.getRoleById(roleId) : of(null);
        return forkJoin(allRolesRequest, roleRequest).pipe(
            map(res => {
                const _allPermissions: Permission[] = res[0];
                const _role: Role = res[1];
                if (!_allPermissions || _allPermissions.length === 0) {
                    return [];
                }

                const _rolePermission = _role ? _role.permissions : [];
                //const result: Permission[] = this.getRolePermissionsTree(_allPermissions, _rolePermission);
                return;
            })
        );
    }

    private getRolePermissionsTree(_allPermission: Permission[] = [], _rolePermissionIds: number[] = []): Permission[] {
        const result: Permission[] = [];
        const _root: Permission[] = filter(_allPermission, (item: Permission) => !item.parentId);
        each(_root, (_rootItem: Permission) => {
            _rootItem._children = [];
            _rootItem._children = this.collectChildrenPermission(_allPermission, _rootItem.id, _rolePermissionIds);
            _rootItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _rootItem.id));
            result.push(_rootItem);
        });
        return result;
    }

    private collectChildrenPermission(_allPermission: Permission[] = [],
        _parentId: number, _rolePermissionIds: number[] = []): Permission[] {
        const result: Permission[] = [];
        const _children: Permission[] = filter(_allPermission, (item: Permission) => item.parentId === _parentId);
        if (_children.length === 0) {
            return result;
        }

        each(_children, (_childItem: Permission) => {
            _childItem._children = [];
            _childItem._children = this.collectChildrenPermission(_allPermission, _childItem.id, _rolePermissionIds);
            _childItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _childItem.id));
            result.push(_childItem);
        });
        return result;
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        if (this.hasTokenProperty()) {
            return this.http.get<Role[]>(this.baseUrl + '/api/BeINMaximus/GetRole', { headers: this.Token });
            // return this.http.get<Role[]>(API_ROLES_URL);
        }
    }
    //RolesByCallCenter
    RolesByCallCenter(callcenterid:number): Observable<Role[]> {
        if (this.hasTokenProperty()) {
            return this.http.get<Role[]>(this.baseUrl + '/api/BeINMaximus/GetRoleByCallCenter?callcenterid='+callcenterid, { headers: this.Token });
            // return this.http.get<Role[]>(API_ROLES_URL);
        }
    }

    getRoleById(roleId: number): Observable<Role> {
        return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    }
    // DELETE => delete the role from the server
    // deleteRole(roleId: number): Observable<Role> {
    //     const url = `${API_ROLES_URL}/${roleId}`;
    //     return this.http.delete<Role>(url);
    // }

    findCCRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        return this.http.get<CCRole[]>(this.baseUrl + '/api/BeINMaximus/GetAllCCRoles', { headers: this.Token }).pipe(
            mergeMap(res => {
                const result = this.httpUtils.baseFilter(res, queryParams, []);
                return of(result);
            })
        );
    }
    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        if (this.hasTokenProperty()) {
            // This code imitates server calls
            // alert('FindRole');
            return this.http.get<Role[]>(this.baseUrl + '/api/BeINMaximus/GetRole', { headers: this.Token }).pipe(
                mergeMap(res => {
                    const result = this.httpUtils.baseFilter(res, queryParams, []);
                    return of(result);
                })
            );
        }
    }
    findCCActivity(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        return this.http.get<CCActivity[]>(this.baseUrl + '/api/BeINMaximus/GetAllActivitys', { headers: this.Token }).pipe(
            mergeMap(res => {
                
                const result = this.httpUtils.baseFilter(res, queryParams, []);
                return of(result);
            })
        );
    }

    // Check Role Before deletion
    // isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    //     return this.getAllUsers().pipe(
    //         map((users: User[]) => {
    //             if (some(users, (user: User) => some(user.userroleid, (_roleId: number) => _roleId === roleId))) {
    //                 return true;
    //             }

    //             return false;
    //         })
    //     );
    // }


    // ActionTrackers

    // CREATE =>  POST: add a new ActionTracker to the server
    createActionTracker(ActionTracker: ActionTracker): Observable<any> {
        const httpHeaders = new HttpHeaders();
        // Note: Add headers if needed (tokens/bearer)
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/InsertActionTracker', ActionTracker, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // Update 
    updateActionTracker(_ActionTracker: ActionTracker): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/UpdateActionTracker', _ActionTracker, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // DELETE => delete the ActionTracker from the server

    deleteActionTracker(ActionTrackerId: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteActionTracker?id=' + ActionTrackerId, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // READ
    getAllActionTrackers(): Observable<ActionTracker[]> {
        let roleid = JSON.parse(localStorage.getItem('currentUser')).role_id;
        
        if (this.hasTokenProperty())
            return this.http.get<ActionTracker[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTracker?roleid=' + roleid, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findActionTrackers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        return this.getAllActionTrackers().pipe(
            mergeMap((response: ActionTracker[]) => {
                const result = this.httpUtils.baseFilter(response, queryParams, []);
                return of(result);
            })
        );
    }


    // ActionTrackerTopics

    // CREATE =>  POST: add a new ActionTrackerTopic to the server
    createActionTrackerTopic(ActionTrackerTopic: ActionTrackerTopic): Observable<any> {
        const httpHeaders = new HttpHeaders();
        // Note: Add headers if needed (tokens/bearer)
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/InsertActionTrackerTopic', ActionTrackerTopic, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // Update 
    updateActionTrackerTopic(_ActionTrackerTopic: ActionTrackerTopic): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/UpdateActionTrackerTopic', _ActionTrackerTopic, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // DELETE => delete the ActionTrackerTopic from the server
    deleteActionTrackerTopic(ActionTrackerTopicId: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteActionTracker?id=' + ActionTrackerTopicId, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // READ
    getAllActionTrackerTopics(): Observable<ActionTrackerTopic[]> {
        let actiontrackerid = localStorage.getItem('actiontrackerid');
        let isarchive = localStorage.getItem('isarchive');
        if (this.hasTokenProperty())
            return this.http.get<ActionTrackerTopic[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTrackerTopic?actiontrackerid=' + actiontrackerid + '&isarchive=' + isarchive.toString(), { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findActionTrackerTopics(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls

        return this.getAllActionTrackerTopics().pipe(
            mergeMap((response: ActionTrackerTopic[]) => {
                const result = this.httpUtils.baseFilter(response, queryParams, []);
                return of(result);
            })
        );
    }
    getAllActionTrackerTopicNames(): Observable<ActionTrackerTopicNames[]> {
        if (this.hasTokenProperty())
            return this.http.get<ActionTrackerTopicNames[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTrackerTopicNames', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getAllActionTrackerTopicStatus(): Observable<ActionTrackerTopicStatus[]> {
        if (this.hasTokenProperty())
            return this.http.get<ActionTrackerTopicStatus[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTrackerTopicStatus', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getAllActionTrackerTopicPriority(): Observable<ActionTrackerTopicPriority[]> {
        if (this.hasTokenProperty())
            return this.http.get<ActionTrackerTopicPriority[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTrackerPriority', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getAllActionTrackerTopicOwner(actiontrackerid: number): Observable<ActionTrackerTopicOwner[]> {
        if (this.hasTokenProperty())
            return this.http.get<ActionTrackerTopicOwner[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTrackerTopicOwner?actiontrackerid=' + actiontrackerid, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    createActionTrackerTopicConv(ActionTrackerTopicConv: ActionTrackerTopicConversation): Observable<any> {
        const httpHeaders = new HttpHeaders();
        // Note: Add headers if needed (tokens/bearer)
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/InsertActionTrackerTopicConversation', ActionTrackerTopicConv, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }

    updateActionTrackerTopicConversation(ActionTrackerTopicConv: ActionTrackerTopicConversation): Observable<any> {
        const httpHeaders = new HttpHeaders();
        // Note: Add headers if needed (tokens/bearer)
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/InsertActionTrackerTopicConversation', ActionTrackerTopicConv, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // DELETE => delete the ActionTrackerTopic from the server
    deleteActionTrackerTopicConversation(Id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteActionTrackerTopicConversation?id=' + Id, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // READ
    getAllActionTrackerTopicsConversation(): Observable<ActionTrackerTopicConversation[]> {
        if (this.hasTokenProperty())
            return this.http.get<ActionTrackerTopicConversation[]>(this.baseUrl + '/api/BeINMaximus/GetAllActionTrackerTopicConversation', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findActionTrackerTopicsConversation(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls

        return this.getAllActionTrackerTopicsConversation().pipe(
            mergeMap((response: ActionTrackerTopicConversation[]) => {
                const result = this.httpUtils.baseFilter(response, queryParams, []);
                return of(result);
            })
        );
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

    // CREATE =>  POST: add a new CalendarTask to the server
    createCalendarTask(_calendartask: CalendarTask): Observable<any> {
        const httpHeaders = new HttpHeaders();
        // Note: Add headers if needed (tokens/bearer)
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/InsertSalesCallbackTask', _calendartask, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // Update 
    updateCalendarTask(_calendartask: CalendarTask): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/UpdateSalesCallbackTask', _calendartask, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // DELETE => delete the CalendarTask from the server

    deleteCalendarTask(Id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeletSalesCallbackTask?id=' + Id, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // READ
    getAllCalendarTask(_salecallbacktaskFilters: SaleCallBackTaskFilter): Observable<CalendarTask[]> {

        if (this.hasTokenProperty())
            return this.http.post<CalendarTask[]>(this.baseUrl + '/api/BeINMaximus/GetAllSalesCallbackTask', _salecallbacktaskFilters, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    getAllSalesCallBackTaskUsers(Role_Id: number): Observable<SalesCallBackTaskUsers[]> {
        if (this.hasTokenProperty())
             return this.http.get<SalesCallBackTaskUsers[]>(this.baseUrl + '/api/BeINMaximus/GetAllSalesCallbackTaskUsers?Role_Id=' + Role_Id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getAllSalesCallBackTaskActivity(SalesCallBackTaskId: number): Observable<SaleCallBackTaskActivity[]> {
        if (this.hasTokenProperty())
             return this.http.get<SaleCallBackTaskActivity[]>(this.baseUrl + '/api/BeINMaximus/GetAllSalesCallbackTaskActivity?salescallbacktaskid=' + SalesCallBackTaskId, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getAllSalesCallBackTaskStatus(): Observable<SalesCallBackTaskStatus[]> {
        if (this.hasTokenProperty())
            return this.http.get<SalesCallBackTaskStatus[]>(this.baseUrl + '/api/BeINMaximus/GetAllSalesCallbackTaskStatus', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetHomeChangePassword(req: ChangePasswordModel): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/BeINMaximus/HomeChangePassword', req, this.PostToken).pipe(catchError(this.handleError));
    }
    /* Call Centre*/

    deleteCallCenter(id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/BeINMaximus/DeleteCallCenter?id=' + id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    createCallCenter(CallCenter: CallCenter): Observable<any> {
        //
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/InsertCallCenter', CallCenter, this.PostToken).pipe(catchError(this.handleError));
    }

    updateCallCenter(CallCenter: CallCenter): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/BeINMaximus/UpdateCallCenter', CallCenter, this.PostToken).pipe(catchError(this.handleError));
    }

    GetAllCallCenters(): Observable<CallCenter[]> {
        if (this.hasTokenProperty())
            return this.http.get<CallCenter[]>(this.baseUrl + '/api/BeINMaximus/GetAllCallCenters', { headers: this.Token }).pipe(catchError(this.handleError));
    }
   
    // GetAllMasterCallCenter(): Observable<CallCenter[]> {
    //     if (this.hasTokenProperty())
    //         return this.http.get<CallCenter[]>(this.baseUrl + '/api/BeINMaximus/GetAllCallCenters', { headers: this.Token }).pipe(catchError(this.handleError));
    // }

    GetCallCentersByRole(roleid:number): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/BeINMaximus/GetCallCentersByRole?roleid='+roleid, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // GetCallCenter(): Observable<CallCenter[]> {
    //     if (this.hasTokenProperty())
    //         return this.http.get<CallCenter[]>(this.baseUrl + '/api/BeINMaximus/GetCallCenters', { headers: this.Token }).pipe(catchError(this.handleError));
    // }

    findCallCenters(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        return this.http.get<CallCenter[]>(this.baseUrl + '/api/BeINMaximus/GetAllCallCenters', { headers: this.Token }).pipe(
            mergeMap(res => {
                
                const result = this.httpUtils.baseFilter(res, queryParams, []);
                return of(result);
            })
        );
    }

    submitVocher(req: FormData): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'multipart/form-data'
            })
        }
        if (this.hasTokenProperty()) {
            return this.http.post<any>(this.baseUrl + '/api/Voucher/InsertVocuher', req, { headers: this.Token });
        }
    }

    GetVoucher(inputRequest:VoucherFilter): Observable<Voucher[]> {
        // if (this.hasTokenProperty())
        //     return this.http.get<Voucher[]>(this.baseUrl + '/api/Voucher/GetAllVocuhers', { headers: this.Token }).pipe(catchError(this.handleError));

    if (this.hasTokenProperty())        
            return this.http.post<Voucher[]>(this.baseUrl + '/api/Voucher/GetAllVocuhers',inputRequest ,{ headers: this.Token }).pipe(catchError(this.handleError));
       
    }



    // logout() {
    //     localStorage.removeItem('currentUser');
    //     this.router.navigate(['/auth/login']);
    //   }

    //   refreshToken() : Observable<User> {
    //     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     let refreshToken = currentUser.refreshToken;        
    //     var data = "grant_type=refresh_token&refresh_token="+refreshToken;
    //     return this.http.post<User>(this.baseUrl + '/token',data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
    //       .pipe(
    //         map(user => {  
    //             const time_to_login = Date.now() + 3600000; // 30 min						
    //             localStorage.setItem('currentUser', JSON.stringify({ 'fullName': user.username, 'agentid' :user.id, 'token': user.access_token, 'email': user.email, 'expires_in': user.expires_in, 'TokenType': user.token_type, 'time_to_login': time_to_login, 'role_id': user.roleid, 'refreshToken': user.refreshToken,'profile_img': user.profile_img }));

    //           return <User>user;
    //       }));
    //   }

    //   getAuthToken() : string {
    //     let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    //     if(currentUser != null) {
    //       return currentUser.token;
    //     }
    //     return '';
    //   }



}
