// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { ReportsComponent } from './reports.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import { MatTreeModule } from '@angular/material/tree';

// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatListModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {
  usersReducer,
  UserEffects
} from '../../../core/auth';
import { AgentRatioReportComponent } from './agent-ratio-report/agent-ratio-report.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { AgentActivityReportComponent } from './agent-activity-report/agent-activity-report.component';
import { AgentHirringReportComponent } from './agent-hirring-report/agent-hirring-report.component';
import { AgentAttritionReportComponent } from './agent-attrition-report/agent-attrition-report.component';
import { CallmetricsreportComponent } from './callmetricsreport/callmetricsreport.component';
import { ManualoutboundreportComponent } from './manualoutboundreport/manualoutboundreport.component';
import { WhatsupreportComponent } from './whatsupreport/whatsupreport.component';
import { AbsentiesreportComponent } from './absentiesreport/absentiesreport.component';
import { FinancereportComponent } from './financereport/financereport.component';
import { NgxScreenfullModule } from '@ngx-extensions/screenfull';
import { TicketlogaccuracyreportComponent } from './ticketlogaccuracyreport/ticketlogaccuracyreport.component';
import { ReportslistComponent } from './reportslist/reportslist.component';
import { AgentinforeportComponent } from './agentinforeport/agentinforeport.component';
import { SupervisorinforeportComponent } from './supervisorinforeport/supervisorinforeport.component';
import { QualityreportComponent } from './qualityreport/qualityreport.component';
import { UserActivityReportComponent } from './user-activity-report/user-activity-report.component';
import { UserCcroleReportComponent } from './user-ccrole-report/user-ccrole-report.component';
import { UserOrganizationReportComponent } from './user-organization-report/user-organization-report.component';
import { UserRoleReportComponent } from './user-role-report/user-role-report.component';
import { UserSupervisorReportComponent } from './user-supervisor-report/user-supervisor-report.component';
import { UserCCRoleRequest } from './_models/userccrolerequest.model';
import { AbsentiesdetailsreportComponent } from './absentiesdetailsreport/absentiesdetailsreport.component';
import { AbsentiessummaryreportComponent } from './absentiessummaryreport/absentiessummaryreport.component';
import { AssementformaveragereportComponent } from './assementformaveragereport/assementformaveragereport.component';
import { AssementformdetailreportComponent } from './assementformdetailreport/assementformdetailreport.component';
import { AgentskillgroupmappingreportComponent } from './agentskillgroupmappingreport/agentskillgroupmappingreport.component';
import { AgentcallinfoComponent } from './agentcallinfo/agentcallinfo.component';






const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full'
      },
      {
        path: 'reportslist',
        component: ReportslistComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'agentratioreport',
        component: AgentRatioReportComponent
      },
      {
        path: 'agentactivityreport',
        component: AgentActivityReportComponent
      },
      {
        path: 'agenthirringreport',
        component: AgentHirringReportComponent
      },
      {
        path: 'agentattritionreport',
        component: AgentAttritionReportComponent
      },
      {
        path: 'callmetricsreport',
        component: CallmetricsreportComponent
      },
      {
        path: 'manualoutboundreport',
        component: ManualoutboundreportComponent
      },
      {
        path: 'whatsupreport',
        component: WhatsupreportComponent
      },
      {
        path: 'absentiesreport',
        component: AbsentiesreportComponent
      },
      {
        path: 'financereport',
        component: FinancereportComponent
      },
      {
        path: 'ticketlogaccuracyreport',
        component: TicketlogaccuracyreportComponent
      },
      {
        path: 'agentinforeport',
        component: AgentinforeportComponent
      },
      {
        path: 'supervisorinforeport',
        component: SupervisorinforeportComponent
      },
      {
        path: 'qualityreport',
        component: QualityreportComponent
      },
      {
        path: 'useractivityreport',
        component: UserActivityReportComponent
      },
      {
        path: 'userccrolereport',
        component: UserCcroleReportComponent
      },
      {
        path: 'userorganizationreport',
        component: UserOrganizationReportComponent
      },
      {
        path: 'userrolereport',
        component: UserRoleReportComponent
      },
      {
        path: 'usersupervisorreport',
        component: UserSupervisorReportComponent
      },
      {
        path: 'agentabsentiesdetailsreport',
        component: AbsentiesdetailsreportComponent
      },
      {
        path: 'agentabsentiessummaryreport',
        component: AbsentiessummaryreportComponent
      }
      ,
      {
        path: 'assessmentformaveragereport',
        component: AssementformaveragereportComponent
      } ,
      {
        path: 'assessmentformdetailsreport',
        component: AssementformdetailreportComponent
      } ,
      {
        path: 'agentskillgroupmappingreport',
        component: AgentskillgroupmappingreportComponent
      } ,
      {
        path: 'agentcallinfo',
        component: AgentcallinfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    FormsModule,
    MatTreeModule,
    TreetableModule,
    NgbModule,
    RouterModule.forChild(routes),
    NgxDaterangepickerMd.forRoot(),
    BsDatepickerModule.forRoot(),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    NgxDaterangepickerMd,
    AgGridModule.withComponents([
      AgentRatioReportComponent

    ]),
    NgxScreenfullModule
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent
  ],
  declarations: [
    ReportsComponent,
    AgentRatioReportComponent,
    AgentActivityReportComponent,
    AgentHirringReportComponent,
    AgentAttritionReportComponent,
    CallmetricsreportComponent,
    ManualoutboundreportComponent,
    WhatsupreportComponent,
    AbsentiesreportComponent,
    FinancereportComponent,
    TicketlogaccuracyreportComponent,
    ReportslistComponent,
    AgentinforeportComponent,
    SupervisorinforeportComponent,
    QualityreportComponent,
    UserActivityReportComponent,
    UserCcroleReportComponent,
    UserOrganizationReportComponent,
    UserRoleReportComponent,
    UserSupervisorReportComponent,
    AbsentiesdetailsreportComponent,
    AbsentiessummaryreportComponent,
    AssementformaveragereportComponent,
    AssementformdetailreportComponent,
    AgentskillgroupmappingreportComponent,
    AgentcallinfoComponent,
    ]
})
export class ReportsModule { }
