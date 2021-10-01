import { Component, OnInit, ViewChild, EventEmitter, Output, Inject, ElementRef } from '@angular/core';

import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import {
  FDAgent, AWDBAgent, TicketDetail, BeinUser, AuthService, GadgetService, AdminService, ReportingTicketFilter,
  AlertMessage
} from '../../../../../core/auth';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Subscription, BehaviorSubject } from 'rxjs';
// import { GadgetService } from '../_services/gadget.service';
import { ActivatedRoute, Router, UrlSegmentGroup, PRIMARY_OUTLET } from '@angular/router';
// import { ModalService } from '../_services/modal.service';
// import { AdminService } from '../_services/admin.service';
import { Location } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kt-create-reporting-ticket',
  templateUrl: './create-reporting-ticket.component.html'
})
export class CreateReportingTicketComponent implements OnInit {

  @ViewChild('myfile',{static: false}) myfile: ElementRef;
  public finAgentId: number; public finCallKeyCallId: number; public finCallKeyPrefix: number; public finDialogId: number;
  public finAni: string; public finSCardNo: number; public saveMsg: string; public getCardReqType: string;
  public finCallType: string; public finLang: string;
  public fdAgent: FDAgent;
  // public awdbAgent: AWDBAgent;
  public ticketDetail: TicketDetail;
  public reportingTicketFilter: ReportingTicketFilter;
  TicketList: TicketDetail[];
  public responseTicketDetails: TicketDetail;
  public ticCreateError: boolean;
  public formSubmitted = false;
  public gadgetTicOper: string;
  hasFormErrors: boolean = false;
  ErrorMessage: string;
  /* tags Chips Related*/
  readonly tagSepKeysCodes: number[] = [ENTER, COMMA];
  public tagsVisible = true;
  public tagsSelectable = true;
  public tagsRemovable = true;
  public tagsAddOnBlur = true;

  public langOptions = ['ARB', 'ENG'];
  displayedColumns: string[] = ['Updated_At', 'Body'];

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
  events: any[];
  public Events$ = new BehaviorSubject<any[]>(this.events);
  agentName: string;
  agentEmail: string;
  ticketCustomerOf: any;
  ticketLocation: any;
  ticketPriority: any;
  ticketSource: any;
  ticketStatus: any;
  ticketType: any;
  public beinUser: BeinUser;
  updated_at: Date;
  private repTicketDetailSub: Subscription;


  public ckEditor24Conf: any = {
    'toolbar': [
      {
        name: 'document', groups: ['mode', 'document', 'doctools'],
        items: ['Source', '-', 'Preview', '-', 'Templates']
      },
      {
        name: 'clipboard', groups: ['clipboard', 'undo'],
        items: ['Cut', 'Copy', 'Paste', 'PasteFromWord', '-', 'Undo']
      },
      {
        name: 'editing', groups: ['find', 'selection'],
        items: ['Find', 'Replace', '-', 'SelectAll']
      },
      {
        name: 'basicstyles', groups: ['basicstyles', 'cleanup'],
        items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat']
      },
      {
        name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
        items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote',
          'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
      },
      '/',
      { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      { name: 'insert', items: ['Table', 'HorizontalRule', 'SpecialChar'] },
      { name: 'tools', items: ['Maximize'] }
    ]
  };

  csvFile: FormData = new FormData();
  public headersArray = [];
  fileSizeAlert: string;
  fileSizeAlertFlag: boolean = false;
  public constructor(private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateReportingTicketComponent>,
    private matDialog: MatDialog, public auth: AuthService, public gadgetService: GadgetService,
    public adminService: AdminService, private layoutUtilsService: LayoutUtilsService,
    private location: Location, private router: Router) {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.finAgentId = JSON.parse(localStorage.getItem('currentUser')).agentid;
      this.agentName = JSON.parse(localStorage.getItem('currentUser')).lastname + '-' + JSON.parse(localStorage.getItem('currentUser')).firstname;
      this.agentEmail = JSON.parse(localStorage.getItem('currentUser')).email;
      // this.RoleId = JSON.parse(localStorage.getItem('currentUser')).role_id;
      // this.cc_role_name = JSON.parse(localStorage.getItem('currentUser')).cc_role_name;
    }
    this.generateInitialTicketDetails();
  }

  generateInitialTicketDetails() {
    this.repTicketDetailSub = this.gadgetService.currTicketDetail$.subscribe(data => {
      if (data) {
        this.ticketDetail = data;
        this.ticketDetail.name = this.agentName;
        this.ticketDetail.email = this.agentEmail;
        this.ticketDetail.group_id = 9000168745;
        this.ticketDetail.custom_fields.cf_template = 'Reporting';
        this.gadgetTicOper = 'New';
        this.setTicketTemplateList();
      }
    });
  }

  ngOnInit() {
    this.gadgetService.getFDAgent(this.finAgentId).subscribe(fdAgent => {
      if (fdAgent) {
        this.fdAgent = fdAgent;
        this.populateValues();
        this.ticketDetail = new TicketDetail();
        debugger
        this.ticketDetail = this.data.res;

        if (!this.data.id) {
          this.ticketDetail.call_key_call_id = GadgetService.finCallKeyCallId;
          this.ticketDetail.call_key_prefix = GadgetService.finCallKeyPrefix;
          this.ticketDetail.dialog_id = GadgetService.finDialogId;
          this.ticketDetail.agent_login_id = GadgetService.finAgentId;
          this.ticketDetail.language = GadgetService.finLang;
          //this.ticketDetail.priority = 1;
          this.ticketDetail.resolvedStatus = false;
          this.ticketDetail.connToNet = false;
          this.ticketDetail.description = '';
          this.ticketDetail.newCustomer = false;
          this.ticketDetail.source = 3;
          this.ticketDetail.id = undefined;
          this.ticketDetail.custom_fields.cf_template = 'Reporting';
          this.ticketDetail.name = this.agentName;
          this.ticketDetail.email = this.agentEmail;
          this.ticketDetail.group_id = 9000168745;
          this.ticketDetail.status = 2;
        }
        else {
          this.events = [];
          if (this.ticketDetail.fdticketconversation.length > 0) {
            for (let i = 0; i < this.ticketDetail.fdticketconversation.length; i++) {
              // this.createddate = this.actiontrackertopicconversationsconvResult[i].cdate.toString();
              this.events.push({
                "updated_at": this.ticketDetail.fdticketconversation[i].updated_at,
                "created_at": this.ticketDetail.fdticketconversation[i].created_at,
                "body": this.ticketDetail.fdticketconversation[i].body,
                "id": this.ticketDetail.fdticketconversation[i].id
              })
            }
            this.Events$.next(this.events);
          }
        }
        console.log('RepTicket Init Flag: ' + GadgetService.gadgetRepTicketInit);
      }
    });

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.repTicketDetailSub.unsubscribe();

  }
  changeListener(files: FileList) {
    let csv: string;
    debugger
    this.hasFormErrors = false;
    this.ErrorMessage = "";

    console.log(files);
    if (files && files.length > 0) {
      let fileSize = 0;
      debugger
      if (files.length <= 5) {
        for (let i = 0; i < files.length; i++) {
          let file: File = files.item(i);
          this.csvFile.append('file' + i, file, file.name);
          fileSize += file.size;
          if (fileSize > 10485760) { // 10 MB in bytes ( 10485760 binary ) -- 10 MB = 10*1024*1024
            this.hasFormErrors = true;
            this.ErrorMessage = "Files size maximum 10 MB can be allowed";
            break;
          }
        }
      }
      else{
        this.hasFormErrors = true;
        this.ErrorMessage = "Maximum 5 files can be allowed";
        this.myfile.nativeElement.value = null;
      }
    }
  }
  onFileSizeAlertClose($event) {
		this.fileSizeAlertFlag = false;
	}
  saveTicket() {
debugger
    this.formSubmitted = true;
    if (this.ticketDetail.responder_id === 0) {
      this.ticketDetail.responder_id = null;
    }
    console.log('RepTicket Responder After Check: ' + this.ticketDetail.responder_id);
    if (this.gadgetTicOper === 'New') {
      this.ticketDetail.custom_fields.cf_created_by = this.agentName;
      this.ticketDetail.custom_fields.cf_last_updated_by = this.agentName;
      this.ticketDetail.ani = this.finAni;
      this.ticketDetail.callType = this.finCallType;
      this.ticketDetail.agent_login_id = this.finAgentId;

      let tickets: any = JSON.stringify(this.ticketDetail);
      this.csvFile.append("TicketDetails", tickets);

      console.log('RepTicket Submiting New:: ' + JSON.stringify(this.ticketDetail, null, 4));
      this.gadgetService.createTicketWithAttachment(this.csvFile)
        .subscribe(data => {
          debugger;
          this.responseTicketDetails = data;
          if (data.id == null) {
            this.ErrorMessage = data;
            this.hasFormErrors = true;
            return;
          } else {
            this.saveMsg = 'Ticket Created';
            this.ticketDetail.id = data.id;
            this.hasFormErrors = false;
            this.ErrorMessage = '';
            this.ngOnInit();
            const alert: AlertMessage = {
              msgFor: 'beINCCGadget', operation: 'REP_TICKET_ALERT',
              msg: 'Reporting Ticket Created with Id: ' + data.id, canClose: true, errExists: false,
              dialogId: GadgetService.finDialogId, operationId: data.id
            };
            const _messageType = this.ticketDetail.id ? MessageType.Update : MessageType.Create;
            this.myfile.nativeElement.value = null;
            let ticketDetails: TicketDetail;
            ticketDetails = this.ticketDetail;
            this.dialogRef.close({
              ticketDetails,
              isEdit: false,
              result: alert.msg
            });
            // this.layoutUtilsService.showActionNotification(alert.msg, _messageType, 10000, true, true);

          }
        },
          err => {
            this.saveMsg = 'Error occured';
            this.ticCreateError = true;
            this.formSubmitted = false;
          });

    } else {
      if (this.agentName) {
        this.ticketDetail.custom_fields.cf_last_updated_by = this.agentName;
      }
      console.log('RepTicket Submiting Update:: ' + JSON.stringify(this.ticketDetail, null, 4));
      this.gadgetService.updateTicket(this.ticketDetail)
        .subscribe(data => {
          this.responseTicketDetails = data;
          if (data.id == null) {
            this.ErrorMessage = data.description;
            this.hasFormErrors = true;
          } else {
            this.saveMsg = 'Ticket Updated';
            this.ticketDetail.id = data.id;
            this.ticCreateError = false;

            const alert: AlertMessage = {
              msgFor: 'beINCCGadget', operation: 'REP_TICKET_ALERT',
              msg: 'Reporting Ticket Updated with Id: ' + data.id, canClose: true, errExists: false,
              dialogId: GadgetService.finDialogId, operationId: data.id
            };
            const _messageType = this.ticketDetail.id ? MessageType.Update : MessageType.Create;
            let ticketDetails: TicketDetail;
            ticketDetails = this.ticketDetail;
            this.dialogRef.close({
              ticketDetails,
              isEdit: false,
              result: data
            });

          }

        },
          err => {
            this.saveMsg = 'Error occured';
            this.ticCreateError = true;
            this.formSubmitted = false;
          });

    }
  }

  populateValues(): void {

    this.gadgetService.getAllFDAgents().subscribe(fdAgents => {

      this.fdAgents = fdAgents;
      GadgetService.fdAgents = fdAgents;
      this.onGroupChange();
    });

    this.gadgetService.getAllFDGroups().subscribe(fdGroups => {
      this.fdGroups = fdGroups;
      GadgetService.fdGroups = fdGroups;
    });

    //Reporting Dropdown Lists
    this.gadgetService.getAllTicketREPCategory().subscribe(ticketREPCategory => {
      this.ticketREPCategory = ticketREPCategory;
      GadgetService.ticketREPCategory = ticketREPCategory;
    });

    this.gadgetService.getAllTicketREPSubCategory().subscribe(ticketREPSubCategory => {
      this.ticketREPSubCategory = ticketREPSubCategory;
      GadgetService.ticketREPSubCategory = ticketREPSubCategory;
    });

    this.gadgetService.getAllTicketREPItem().subscribe(ticketREPItem => {
      this.ticketREPItem = ticketREPItem;
      GadgetService.ticketREPItem = ticketREPItem;
    });

    //WFO Dropdown Lists
    this.gadgetService.getAllTicketWFOCategory().subscribe(ticketWFOCategory => {
      this.ticketWFOCategory = ticketWFOCategory;
      GadgetService.ticketWFOCategory = ticketWFOCategory;
    });

    this.gadgetService.getAllTicketWFOSubCategory().subscribe(ticketWFOSubCategory => {
      this.ticketWFOSubCategory = ticketWFOSubCategory;
      GadgetService.ticketWFOSubCategory = ticketWFOSubCategory;
    });

    this.gadgetService.getAllTicketWFOItem().subscribe(ticketWFOItem => {
      this.ticketWFOItem = ticketWFOItem;
      GadgetService.ticketWFOItem = ticketWFOItem;
    });

    this.gadgetService.getAllTicketCustomerOf().subscribe(ticketCustomerOf => {
      this.ticketCustomerOf = ticketCustomerOf;
      GadgetService.ticketCustomerOf = ticketCustomerOf;
    });

    this.gadgetService.getAllTicketLocation().subscribe(ticketLocation => {
      this.ticketLocation = ticketLocation;
      GadgetService.ticketLocation = ticketLocation;
    });

    this.gadgetService.getAllTicketPriority().subscribe(ticketPriority => {
      this.ticketPriority = ticketPriority;
      GadgetService.ticketPriority = ticketPriority;
    });

    this.gadgetService.getAllTicketProduct().subscribe(ticketProduct => {
      this.ticketProduct = ticketProduct;
      GadgetService.ticketProduct = ticketProduct;
    });

    this.gadgetService.getAllTicketSource().subscribe(ticketSource => {
      this.ticketSource = ticketSource;
      GadgetService.ticketSource = ticketSource;
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

  setTicketTemplateList(): void {
    if (this.agentName) {
      this.cfTemplateList = [
        { id: 'Reporting', value: 'Reporting' },
        { id: 'WFO', value: 'WFO' }
      ];
      if (this.ticketDetail) {
        if (this.beinUser) {
          this.ticketDetail.name = this.beinUser.lastName + "-" + this.beinUser.firstName;
          this.ticketDetail.email = this.beinUser.email;
        }
      }
    }
  }

  onREPTemplateChange() {
    if (this.ticketDetail) {
      if (this.ticketDetail.custom_fields.cf_template === 'Reporting') {
        this.ticketDetail.group_id = 9000168745;
      } else if (this.ticketDetail.custom_fields.cf_template === 'WFO') {
        this.ticketDetail.group_id = 9000170674;
      }
    }
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

  filterREPSubById(category: string) {
    if (this.ticketREPSubCategory)
      this.ticketREPSubCategorys = this.ticketREPSubCategory.filter(item => item.categoryName === category);
    else
      this.ticketREPSubCategorys = [];

    this.filterREPItemById(category, this.ticketDetail.custom_fields.subcategory)
  }

  filterREPItemById(category: string, subCategory: string) {
    if (this.ticketREPItem)
      this.ticketREPItems = this.ticketREPItem.filter(item => (item.categoryName === category && item.subCategoryName === subCategory));
    else
      this.ticketREPItems = [];
  }

  onREPCategoryChange(category: string) {
    this.ticketDetail.custom_fields.subcategory = null;
    this.ticketDetail.custom_fields.items = null;

    this.ticketDetail.custom_fields.cf_wfo_sub = null;
    this.ticketDetail.custom_fields.cf_wfo_items = null;
  }

  onREPSubCategoryChange(subCategory: string) {
    this.ticketDetail.custom_fields.items = null;
  }

  filterWFOSubById(category: string) {
    if (this.ticketWFOSubCategory)
      this.ticketWFOSubCategorys = this.ticketWFOSubCategory.filter(item => item.categoryName === category);
    else
      this.ticketWFOSubCategorys = [];

    this.filterWFOItemById(category, this.ticketDetail.custom_fields.cf_wfo_sub);
  }

  filterWFOItemById(category: string, subCategory: string) {
    //debugger;
    if (this.ticketWFOItem)
      this.ticketWFOItems = this.ticketWFOItem.filter(item => (item.categoryName === category && item.subCategoryName === subCategory));
    else
      this.ticketWFOItems = [];
  }

  onWFOCategoryChange(wfocategory: string) {
    this.ticketDetail.custom_fields.cf_wfo_sub = null;
    this.ticketDetail.custom_fields.cf_wfo_items = null;
    this.ticketDetail.custom_fields.subcategory = null;
    this.ticketDetail.custom_fields.items = null;
  }

  onWFOSubCategoryChange(wfosubCategory: string) {
    this.ticketDetail.custom_fields.cf_wfo_items = null;
  }

  notifyCopied(payload: string) {
    // Might want to notify the user that something has been pushed to the clipboard
    console.info(`'${payload}' has been copied to clipboard`);
  }

  isTitleValid(): boolean {
    console.log('Validating Ticket: ' + JSON.stringify(this.ticketDetail, null, 8));
    return (this.ticketDetail
      && this.ticketDetail.custom_fields.cf_template && this.ticketDetail.custom_fields.cf_template.length > 0
      && this.ticketDetail.name && this.ticketDetail.name.length > 0
      && this.ticketDetail.email && this.ticketDetail.email.length > 0
      && this.ticketDetail.priority && this.ticketDetail.priority > 0
      && this.ticketDetail.custom_fields.location && this.ticketDetail.custom_fields.location.length > 0
      && this.ticketDetail.subject && this.ticketDetail.subject.length > 0
      && this.ticketDetail.description && this.ticketDetail.description.length > 0
    );
  }

  onTicketTemplateChange() {
    if (this.ticketDetail) {
      if (this.ticketDetail.custom_fields.cf_template === 'Reporting') {
        this.ticketDetail.group_id = 9000168745;
      } else if (this.ticketDetail.custom_fields.cf_template === 'WFO') {
        this.ticketDetail.group_id = 9000170674;
      }
      this.ticketDetail.custom_fields.reporting_escalation_categorize = null;
      this.ticketDetail.custom_fields.cf_wfo_category = null;
      this.ticketDetail.custom_fields.cf_wfo_sub = null;
      this.ticketDetail.custom_fields.cf_wfo_items = null;
      this.ticketDetail.custom_fields.subcategory = null;
      this.ticketDetail.custom_fields.items = null;
    }
  }

  /*newTicketInitialize() {
    this.ticketDetail = new TicketDetail;
    this.ticketDetail.custom_fields.cf_template == 'Reporting';
    this.ticketDetail.priority = undefined;
    this.ticketDetail.status = 2;
    this.ticketDetail.group_id = 9000168745;
    this.ticketDetail.agent_login_id = undefined;
    this.ticketDetail.custom_fields.location = '';
    this.ticketDetail.id = undefined;
    this.ticketDetail.custom_fields.reporting_escalation_categorize = undefined;
    this.ticketDetail.custom_fields.subcategory = undefined;
    this.ticketDetail.custom_fields.items = undefined;
    this.ticketDetail.custom_fields.cf_wfo_category = undefined;
    this.ticketDetail.custom_fields.cf_wfo_sub = undefined;
    this.ticketDetail.custom_fields.cf_wfo_items = undefined;
    this.ticketDetail.description = '';
    this.ticketDetail.subject = '';
    this.generateInitialTicketDetails();
  }*/

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getAllTickets() {
    this.loadReportingTickets();
  }
  getTitle(): string {
    if (this.ticketDetail && this.ticketDetail.id && this.data.flag == 'edit') {
      // tslint:disable-next-line:no-string-throw
      return `Add Ticket`;
    }
    else if (this.ticketDetail && this.ticketDetail.id && this.data.flag == 'view') {
      return `View Ticket - ${this.ticketDetail.id}`;
    }
    // tslint:disable-next-line:no-string-throw
    return `Add Ticket`;
  }

  loadReportingTickets() {
    this.reportingTicketFilter = new ReportingTicketFilter();
    this.reportingTicketFilter.PageNo = 1;
    this.reportingTicketFilter.PageSize = 15;
    this.reportingTicketFilter.AgentId = this.finAgentId;
    this.gadgetService.GetAllFDTickets(this.reportingTicketFilter).subscribe((_res: any) => {
      this.TicketList = _res;
      this.dialogRef.close({
        data: this.TicketList,
        isEdit: false,
      });
    });
  }

}
