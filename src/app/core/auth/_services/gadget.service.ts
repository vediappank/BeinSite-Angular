import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../../_base/crud';
import { NavigationEnd, Router } from '@angular/router';
// import { TicketDetail } from '../model/ticket-detail.model';
// import { FDContact } from '../model/fdcontact.model';
// import { environment } from '../../../../environments/environment';
// import { LastCallDetail } from '../model/last-call-detail.model';
// import { FDAgent } from '../model/fdagent.model';
// import { AniInfo } from '../model/ani-info.model';
// import { SmartCardDetail } from '../model/smart-card-detail.model';
import { ReportingTicketFilter } from '../_models/reportingticketfilter.model';
import { AlertMessage } from '../_models/alert-message.model';
import { environment } from '../../../../environments/environment';
import { FDAgent } from '../_models/fdagent.model';
import { FDGroup } from '../_models/fdgroup.model';
import { FDRole } from '../_models/fdrole.model';
import { AWDBAgent } from '../_models/awdbagent.model';
import { TicketCustomFields } from '../_models/ticket-custom-fields.model';
import { TicketTrblIssue } from '../_models/ticket-trbl-issue.model';
import { TicketDetail } from '../_models/ticket-detail.model';
import { BeinUser } from '../_models/bein-user.model';
import { AniInfo } from '../_models/ani-info.model';
import { FDContact } from '../_models/fdcontact.model';
import { TicketConversation } from '../_models/ticketconversation.model';


@Injectable()
export class GadgetService {

    private static baseUrl = environment.baseUrl;

    private static serviceUrl = GadgetService.baseUrl + '/api/BeINMaximus/';

    public static finAgentId: number;
    public static finCallKeyCallId: number;
    public static finCallKeyPrefix: number;
    public static finDialogId: number;
    public static finAniOrg: string;
    public static finAni: string;
    public static finCallType: string;
    public static finLang: string;
    public static finSCardNo: number;
    public static gadgetInit = true;
    public static gadgetRepTicketInit = true;

    public static finAniInfo: AniInfo;
    public static fdAgents: FDAgent[];
    public static ticketProduct: any;
    public static fdGroups: any;
    public static ticketCFCSItem: any;
    public static ticketCFCSCategory: any;
    public static ticketCFCSSubCategory: any;
    public static ticketSOPItem: any;
    public static ticketSOPCategory: any;
    public static ticketSOPSubCategory: any;
    public static ticketRETItem: any;
    public static ticketRETCategory: any;
    public static ticketRETSubCategory: any;
    public static ticketREPItem: any;
    public static ticketREPCategory: any;
    public static ticketREPSubCategory: any;

    public static ticketWFOItem: any;
    public static ticketWFOCategory: any;
    public static ticketWFOSubCategory: any;

    public static ticketCustomerOf: any;
    public static ticketLocation: any;
    public static ticketPriority: any;
    public static ticketSource: any;
    public static ticketStatus: any;
    public static ticketType: any;

    // public static LastCallDetails: LastCallDetail[];

    private currTicketDetail = new BehaviorSubject<TicketDetail>(null);
    public currTicketDetail$ = this.currTicketDetail.asObservable();

    // private lastCallDetails = new BehaviorSubject<LastCallDetail[]>(null);
    // public lastCallDetails$ = this.lastCallDetails.asObservable();

    // private smartCardInfo = new BehaviorSubject<SmartCardDetail>(null);
    // public smartCardInfo$ = this.smartCardInfo.asObservable();

    private awdbAgent = new BehaviorSubject<AWDBAgent>(null);
    public awdbAgent$ = this.awdbAgent.asObservable();

    private gadgetAgent = new BehaviorSubject<AWDBAgent>(null);
    public gadgetAgent$ = this.gadgetAgent.asObservable();

    private currRepTicketDetail = new BehaviorSubject<TicketDetail>(null);
    public currRepTicketDetail$ = this.currRepTicketDetail.asObservable();
    public isTokenFlag: boolean = false;
    public Token: any;
    public PostToken: any;
    public static httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
            //,'Access-Control-Allow-Headers':'X-PINGOTHER,Token,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization'
        })
    };

    public static readonly AppDateTimeFormat: string = 'YYYY-MM-DDTHH:mm:ss.SSS';

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService, private router: Router) {
        this.newTicket();
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
    populateValues(): void {

        // this.getAniInfo().subscribe(finAniInfo => GadgetService.finAniInfo = finAniInfo);

        this.getAllFDAgents().subscribe(fdAgents => {
            GadgetService.fdAgents = fdAgents;
            //console.log('Retrieved Fresh Desk Agents:' + GadgetService.fdAgents);
        });

        this.getAllFDGroups().subscribe(fdGroups => GadgetService.fdGroups = fdGroups);

        // this.getAllTicketCFCSCategory().subscribe(ticketCFCSCategory => GadgetService.ticketCFCSCategory = ticketCFCSCategory);

        // this.getAllTicketCFCSSubCategory()
        //     .subscribe(ticketCFCSSubCategory => GadgetService.ticketCFCSSubCategory = ticketCFCSSubCategory );

        // this.getAllTicketCFCSItem().subscribe(ticketCFCSItem => GadgetService.ticketCFCSItem = ticketCFCSItem);

        this.getAllTicketCustomerOf().subscribe(ticketCustomerOf => GadgetService.ticketCustomerOf = ticketCustomerOf);

        this.getAllTicketLocation().subscribe(ticketLocation => GadgetService.ticketLocation = ticketLocation);

        this.getAllTicketPriority().subscribe(ticketPriority => GadgetService.ticketPriority = ticketPriority);

        this.getAllTicketProduct().subscribe(ticketProduct => GadgetService.ticketProduct = ticketProduct);

        this.getAllTicketSource().subscribe(ticketSource => GadgetService.ticketSource = ticketSource);

        this.getAllTicketStatus().subscribe(ticketStatus => GadgetService.ticketStatus = ticketStatus);

        this.getAllTicketType().subscribe(ticketType => GadgetService.ticketType = ticketType);
    }

    newTicket(): void {
        let newTicketDetail: TicketDetail;
        newTicketDetail = new TicketDetail();
        newTicketDetail.priority = 1;
        newTicketDetail.resolvedStatus = false;
        newTicketDetail.connToNet = false;
        newTicketDetail.description = '';
        newTicketDetail.custom_fields.cf_template = 'Customer Service';
        // newTicketDetail.callRating = 1;
        // newTicketDetail.customerRating = 1;
        newTicketDetail.newCustomer = false;
        if (GadgetService.finCallType) {
            if (GadgetService.finCallType === 'INBOUND' || GadgetService.finCallType === 'BackOffice') {
                newTicketDetail.source = 3;
            } else if (GadgetService.finCallType === 'OUT' || GadgetService.finCallType.indexOf('OUTBOUND') !== -1) {
                newTicketDetail.source = 8;
                // newTicketDetail.source = 10;
            } else if (GadgetService.finCallType === 'Twitter') {
                newTicketDetail.source = 8;
            } else if (GadgetService.finCallType === 'Chat') {
                newTicketDetail.source = 7;
            }
        } else {
            newTicketDetail.source = 3;
        }
        this.currTicketDetail.next(newTicketDetail);
    }
    // newRepTicket(): void {
    //     let newTicketDetail: TicketDetail;
    //     newTicketDetail = new TicketDetail();
    //     newTicketDetail.call_key_call_id = GadgetService.finCallKeyCallId;
    //     newTicketDetail.call_key_prefix = GadgetService.finCallKeyPrefix;
    //     newTicketDetail.dialog_id = GadgetService.finDialogId;
    //     newTicketDetail.agent_login_id = GadgetService.finAgentId;
    //     newTicketDetail.language = GadgetService.finLang;
    //     newTicketDetail.priority = 1;
    //     newTicketDetail.resolvedStatus = false;
    //     newTicketDetail.connToNet = false;
    //     newTicketDetail.description = '';

    //     newTicketDetail.newCustomer = false;
    //     newTicketDetail.source = 3;
    //     this.currRepTicketDetail.next(newTicketDetail);
    // }
    getFDAgent(agent_login_id: number): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getFDAgent?agentLoginId=' + agent_login_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 1
    getAllFDAgents(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllFDAgents', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    // 2
    getAllFDGroups(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllFDGroups', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 3
    getAllTicketREPCategory(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketREPCategory', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    //4
    getAllTicketREPSubCategory(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketREPSubCategory', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 5
    getAllTicketREPItem(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketREPItem', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 6
    getAllTicketCustomerOf(): Observable<any> {

        return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketCustomerOf', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 7
    getAllTicketLocation(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketLocation', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 8
    getAllTicketPriority(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketPriority', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 9
    getAllTicketProduct(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketProduct', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 10
    getAllTicketSource(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketSource', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 11
    getAllTicketStatus(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketStatus', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 12
    getAllTicketType(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketType', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 13
    getAllTicketWFOCategory(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketWFOCategory', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    //14
    getAllTicketWFOSubCategory(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketWFOSubCategory', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    // 15
    getAllTicketWFOItem(): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'getAllTicketWFOItem', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    GetAllFDTickets(ticketFilter: ReportingTicketFilter): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.post<any>(GadgetService.serviceUrl + 'GetAllFDTickets', ticketFilter, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    RefreshTickets(ticketFilter: ReportingTicketFilter): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.post<any>(GadgetService.serviceUrl + 'RefreshTickets',ticketFilter, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetTicketDetailsByTicketId(TicketId: number): Observable<any> {

        if (this.hasTokenProperty())
            return this.http.get<any>(GadgetService.serviceUrl + 'GetTicketDetailsByTicketId?ticketId=' + TicketId, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    createTicket(res: any): Observable<any> {

        if (this.hasPostTokenProperty())
            return this.http.post<any>(GadgetService.serviceUrl + 'addFDTicket', res, this.PostToken).pipe(catchError(this.handleError));
    }

    createTicketWithAttachment(res: FormData): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'multipart/form-data'
            })
        }
        if (this.hasPostTokenProperty())
            return this.http.post<any>(GadgetService.serviceUrl + 'AddFDTicketWithAttachment', res, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    updateTicket(res: any): Observable<any> {

        if (this.hasPostTokenProperty())
            return this.http.post<any>(GadgetService.serviceUrl + 'updateFDTicket',resizeTo, this.PostToken).pipe(catchError(this.handleError));
    }
    createEscalationTicketConv(escalationTicketConv: TicketConversation): Observable<any> {
        if (this.hasPostTokenProperty())
        return this.http.post<any>(GadgetService.serviceUrl + 'InsertEscalationTicketConversation', escalationTicketConv, this.PostToken).pipe(catchError(this.handleError));
    }
    // searchTicketById(ticketno: string): Observable<any>  {
    //     return this.http.get<any>(GadgetService.serviceUrl + 'getFDTicketById?agentId=' + GadgetService.finAgentId
    //         + '&ticketId=' + ticketno);
    // }


    // setTicket(ticketDet: TicketDetail) {
    //     let ticketContact: FDContact.Contact;

    //     if ( ticketDet.requester_id && (!ticketDet.name || !ticketDet.phone || !ticketDet.email) ) {
    //         this.getContactById(ticketDet.requester_id).subscribe(contact => {
    //             if ( contact ) {
    //                 ticketContact = contact;
    //                 ticketDet.name = ticketContact.name;
    //                 ticketDet.phone = ticketContact.phone;
    //                 ticketDet.email = ticketContact.email;
    //             }
    //             if( ticketDet.custom_fields.cf_template === 'Reporting' || ticketDet.custom_fields.cf_template === 'WFO' ){
    //                 this.currRepTicketDetail.next(ticketDet);
    //             }else{
    //                 this.currTicketDetail.next(ticketDet);
    //             }
    //         });
    //     } else {
    //         this.currTicketDetail.next(ticketDet);
    //     }
    // }

    sendAlertMessage(alert: AlertMessage): void {
        window.parent.postMessage({
            'msgFor': alert.msgFor, 'dialogId': alert.dialogId, 'operation': alert.operation,
            'operationId': alert.operationId, 'msg': alert.msg, 'canClose': alert.canClose,
            'errExists': alert.errExists
        }, '*');
    }

}

