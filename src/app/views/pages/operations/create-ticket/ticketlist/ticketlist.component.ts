import {
  Component,
  ChangeDetectionStrategy,
  ViewChild, ElementRef,
  TemplateRef, OnInit, ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject, of, BehaviorSubject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Lodash
import { each, find, some, remove } from 'lodash';
import {
  FDAgent, AWDBAgent, TicketDetail, BeinUser, AuthService, GadgetService, AdminService,
  AlertMessage, ReportingTicketFilter, TicketConversation
} from '../../../../../core/auth';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { round } from 'lodash';
import { Sort } from '@angular/material/sort';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// Component
import { CreateReportingTicketComponent } from '../create-reporting-ticket/create-reporting-ticket.component';

@Component({
  selector: 'kt-ticketlist',
  templateUrl: './ticketlist.component.html',
  styleUrls: ['./ticketlist.component.scss']
})
export class TicketlistComponent implements OnInit {

  TicketList: TicketDetail[]=[];
  role_id: number;
  public pagesize: number = 15;
  public pagenumber: number;
  public totalRecords: number;
  public TicketList$ = new BehaviorSubject<TicketDetail[]>(this.TicketList);
  isSupervisor: boolean = false;
  usertype: string;
  cc_role_name: string;
  currentDateTime: any = new Date();
  // 'Template','Category','SubCategory','Item',
  displayedColumns: string[] = ['Id', 'Template', 'Category', 'SubCategory', 'Item', 'Priority', 'Subject','Status','Created_At', 'Action'];
  dataSource = new MatTableDataSource<TicketDetail>([]);
  private subscriptions: Subscription[] = [];
  public ticketConversation: TicketConversation;
  public cfTemplateList: any = [
    { id: 'Reporting', value: 'Reporting' },
    { id: 'WFO', value: 'WFO' }
  ]
  fdAgents: FDAgent[];
  ticketProduct: any;
  fdGroups: any;
  fdGroupAgents: FDAgent[];
  ticketREPCategory: any;
  ticketREPSubCategory: any;
  ticketREPItem: any;
  ticketWFOCategory: any;
  ticketWFOSubCategory: any;
  ticketWFOItem: any;

  ticketREPSubCategorys: any;
  ticketREPItems: any;

  ticketWFOSubCategorys: any;
  ticketWFOItems: any;

  agentName: string;
  agentEmail: string;
  ticketCustomerOf: any;
  ticketLocation: any;
  ticketPriority: any;
  ticketSource: any;
  ticketStatus: any;
  ticketType: any;
  public beinUser: BeinUser;

  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;
  public approveFlag: Boolean = false;
  public cancelFlag: Boolean = false;

  public fdAgent: FDAgent;
  public reportingTicketFilter: ReportingTicketFilter;
  public ticketDetail: TicketDetail;
  public responseTicketDetails: TicketDetail;
  public ticCreateError: boolean;
  public formSubmitted = false;
  public gadgetTicOper: string;
  hasFormErrors: boolean = false;
  ErrorMessage: string;
  userid: number;

  private repTicketDetailSub: Subscription;

  sortedData: TicketDetail[];

  isLoading: boolean = false;
  userEmail: string;

  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  displayProgressSpinner: boolean;

  constructor(private modal: NgbModal, public auth: AuthService, public gadgetService: GadgetService,
    public adminService: AdminService, private layoutUtilsService: LayoutUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef, public dialog: MatDialog) {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userid = JSON.parse(localStorage.getItem('currentUser')).agentid;
      this.role_id = JSON.parse(localStorage.getItem('currentUser')).role_id;
      this.cc_role_name = JSON.parse(localStorage.getItem('currentUser')).cc_role_name;
      this.userEmail = JSON.parse(localStorage.getItem('currentUser')).email;
    }
  }
  ngOnInit() {
    if (localStorage.hasOwnProperty('Escalation Tickets')) {
      let value = localStorage.getItem('Escalation Tickets');
      for (let i = 0; i < value.toString().split(',').length; i++) {

        var permissionName = value.toString().split(',')[i].toLowerCase();
        if (permissionName == "add")
          this.addFlag = false;
        else if (permissionName == "edit")
          this.editFlag = false;
        else if (permissionName == "delete")
          this.deleteFlag = false;
        else if (permissionName == "view")
          this.viewFlag = false;
      }
      console.log('Activity Menu Permission:::' + value);
    }

    this.reportingTicketFilter = new ReportingTicketFilter();
    if (this.pagenumber == undefined) {
      this.pagenumber = 1;
    }
    if (this.pagesize == undefined) {
      this.pagesize = 15;
    }
    setText('#lblCurrentPage', this.pagenumber);
    this.populateValues();
    this.loadReportingTickets(this.pagenumber, this.pagesize);
  }
  populateValues(): void {


    this.gadgetService.getAllTicketPriority().subscribe(ticketPriority => {
      this.ticketPriority = ticketPriority;
      GadgetService.ticketPriority = ticketPriority;
    });


    this.gadgetService.getAllTicketStatus().subscribe(ticketStatus => {
      this.ticketStatus = ticketStatus;
      GadgetService.ticketStatus = ticketStatus;
    });

    this.gadgetService.getAllTicketType().subscribe(ticketType => {
      this.ticketType = ticketType;
      GadgetService.ticketType = ticketType;
    });
  }
  onGroupChange() {

    if (this.ticketDetail) {
      if (this.ticketDetail.group_id && this.fdAgents) {
        let selectAgentList: FDAgent[];
        selectAgentList = [];
        this.fdAgents.forEach(fdAgent => {
          if (fdAgent.assignedGroups && fdAgent.active) {
            fdAgent.assignedGroups.forEach(fdAgentGroup => {
              if (fdAgentGroup.id === this.ticketDetail.group_id) {
                selectAgentList.push(fdAgent);
              }
            });
          }
        });
        this.fdGroupAgents = selectAgentList;
      } else {
      }
    }
  }
  // Dynamic Sorting
  sortData(sort: Sort) {

    const data = this.TicketList.slice();
    if (sort.direction === '')
      sort.direction = 'asc';
    // if (!sort.active || sort.direction === '') {
    //   this.sortedData = data;
    //   return;
    // } Id','Template','Category','SubCategory','Item','Priority', 'Status','Group','Subject'

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Id': return compare(a.id, b.id, isAsc);
        case 'Template': return compare(a.custom_fields.cf_template, b.custom_fields.cf_template, isAsc);
        case 'Category': if (a.custom_fields.cf_template == 'Reporting') { return compare((a.custom_fields.reporting_escalation_categorize), (b.custom_fields.reporting_escalation_categorize), isAsc) }
        else { return compare((a.custom_fields.cf_wfo_category), (b.custom_fields.cf_wfo_category), isAsc) };
        case 'SubCategory': if (a.custom_fields.cf_template == 'Reporting') { return compare((a.custom_fields.subcategory), (b.custom_fields.subcategory), isAsc) }
        else { return compare((a.custom_fields.cf_wfo_sub), (b.custom_fields.cf_wfo_sub), isAsc) };
        case 'Item': if (a.custom_fields.cf_template == 'Reporting') { return compare((a.custom_fields.items), (b.custom_fields.items), isAsc) }
        else { return compare((a.custom_fields.cf_wfo_items), (b.custom_fields.cf_wfo_items), isAsc) };
        case 'Priority': return compare(a.priorityname, b.priorityname, isAsc);
        case 'Status': return compare((a.statusname), (b.statusname), isAsc);
        case 'Group': return compare(a.group_id, b.group_id, isAsc);
        case 'Subject': return compare((a.subject), (b.subject), isAsc);
        default: return 0;
      }
    });
    this.TicketList$.next(this.sortedData);
  }

  loadReportingTickets(pagenumber: number, pagesize: number) {

    this.reportingTicketFilter.PageNo = pagenumber;
    this.reportingTicketFilter.PageSize = pagesize;
    this.reportingTicketFilter.AgentId = this.userid;
    this.gadgetService.GetAllFDTickets(this.reportingTicketFilter).subscribe((_res: any) => {

      this.TicketList = _res;
      if (this.TicketList.length > 0) {
        this.totalRecords = _res[0].TotalRecords;
        this.TicketList$.next(this.TicketList);
      }
      else {
        this.totalRecords = 0;
        this.TicketList$.next(this.TicketList);
      }
    });
    setText('#lblCurrentPage', this.pagenumber);
  }
  RefreshTickets() {
    this.reportingTicketFilter = new ReportingTicketFilter();
    this.reportingTicketFilter.PageNo = this.pagenumber;
    this.reportingTicketFilter.PageSize = this.pagesize;
    this.reportingTicketFilter.AgentId = this.userid;
    this.gadgetService.RefreshTickets(this.reportingTicketFilter).subscribe(_res => {

      this.TicketList = _res;
      if (this.TicketList.length > 0) {
        this.totalRecords = _res[0].TotalRecords;
        this.TicketList$.next(this.TicketList);
      }
      else {
        this.totalRecords = 0;
        this.TicketList$.next(this.TicketList);
      }

      console.log('Conversation Saved confirmation from Database: ' + _res)
    });
  }
  clearFilter() {
    this.reportingTicketFilter.PageNo = this.pagenumber;
    this.reportingTicketFilter.PageSize = this.pagesize;
    this.reportingTicketFilter.AgentId = this.userid;
    this.reportingTicketFilter.Status = 0;
    this.reportingTicketFilter.Priority = 0;
    this.reportingTicketFilter.Template = '';
    this.reportingTicketFilter.TicketId = undefined;
    this.loadReportingTickets(this.pagenumber, this.pagesize);
  }
  addTicketReply(viewticketdetail: TicketDetail) {
    const _title: string = 'Reply';
    const _description: string = 'Start Ticket Reply';
    const _waitDesciption: string = 'Ticket Reply...';
    const _deleteMessage = `Ticket Conversation Added`;
    const _buttonType = `Add Reply`;
    const _buttonText = `Ok`;
    const _cancelDescription = ``;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _buttonText, _cancelDescription, _buttonType);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        if (localStorage.hasOwnProperty('currentUser')) {
          let TextedBy: number;
          TextedBy = JSON.parse(localStorage.getItem('currentUser')).agentid.toString();
          this.ticketConversation = new TicketConversation();
          this.ticketConversation.user_id = this.userid;
          this.ticketConversation.body = res.cancelDescription;
          this.ticketConversation.from_email = this.userEmail;
          this.ticketConversation.id = viewticketdetail.id;
        }
        this.gadgetService.createEscalationTicketConv(this.ticketConversation).subscribe(data => {
          console.log('Conversation Saved confirmation from Database: ' + data)
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Read);
          this.clearFilter()
        });
      }
    });
  }
  addTicket(): void {
    const newticket = new TicketDetail();
    let _saveMessage;
    const _messageType = newticket.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(CreateReportingTicketComponent, { data: { id: newticket.id, res: newticket, flag: 'add' } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.clearFilter();
      this.layoutUtilsService.showActionNotification(res.result, _messageType, 10000, true, true);
    });
  }
  ViewTicket(viewticketdetail: TicketDetail): void {
    // this.displayProgressSpinner = true;
    this.responseTicketDetails = undefined;
    this.gadgetService.GetTicketDetailsByTicketId(viewticketdetail.id).subscribe((_res: any) => {
      this.responseTicketDetails = _res;
      const dialogRef = this.dialog.open(CreateReportingTicketComponent, { data: { id: this.responseTicketDetails.id, res: this.responseTicketDetails, flag: 'view' } });

      dialogRef.afterClosed().subscribe(res => {
        // this.displayProgressSpinner = false;  
        if (!res) {
          return;
        }
        this.TicketList = res.data;
        if (this.TicketList.length > 0) {
          this.totalRecords = this.TicketList.length;
          this.TicketList$.next(this.TicketList);
        }
        else {
          this.totalRecords = 0;
          this.TicketList$.next(this.TicketList);
        }
      });
    });
    // this.GetTicketDetailsByTicketId(viewticketdetail.id);
  }

  GetTicketDetailsByTicketId(TicketId: number) {

  }

  onBtFirst() {

    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber = 1;

    this.loadReportingTickets(this.pagenumber, this.pagesize);

    setText('#lblCurrentPage', this.pagenumber);

  }

  onChange() {
    // this.gridApi.paginationGoToFirstPage();
    this.pagenumber = 1;
    this.loadReportingTickets(this.pagenumber, this.pagesize);

  }

  onBtLast() {

    console.log('here');

    this.pagenumber = round(this.totalRecords / this.pagesize) + 1;
    if (this.totalRecords != this.pagesize) {
      if (this.TicketList.length >= this.pagesize) {

        this.loadReportingTickets(this.pagenumber, this.pagesize);
        setText('#lblCurrentPage', this.pagenumber);
      }
    }
  }

  onBtNext() {

    if (this.totalRecords != this.pagesize) {
      if (this.TicketList.length >= this.pagesize) {
        this.pagenumber = this.pagenumber + 1;

        this.loadReportingTickets(this.pagenumber, this.pagesize);

        setText('#lblCurrentPage', this.pagenumber);
      }
    }
    // this.gridApi.paginationGoToNextPage();
  }

  onBtPrevious() {

    if (this.pagenumber > 1) {
      this.pagenumber = this.pagenumber - 1;
      this.loadReportingTickets(this.pagenumber, this.pagesize);
      setText('#lblCurrentPage', this.pagenumber);
    }
  }

}
function setText(selector, text) {
  document.querySelector(selector).innerHTML = text;
}
// For Dynamic Sorting
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}