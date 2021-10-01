

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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import { MatTreeModule } from '@angular/material/tree';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

//ng2 charts for cancas
import { ChartsModule } from 'ng2-charts';

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
  MatTooltipModule,



} from '@angular/material';
import {
  usersReducer,
  UserEffects
} from '../../../core/auth';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { NgxScreenfullModule } from '@ngx-extensions/screenfull';
import { FlashreportsComponent } from './flashreports.component';

// Floor Performance Report
import { FloorPerformanceTemplateComponent } from './floorperformance/floor-performance-template/floor-performance-template.component';
import { FloorPerformanceDetailComponent } from './floorperformance/floor-performance-detail/floor-performance-detail.component';
import { FloorPerformanceReportComponent } from './floorperformance/floor-performance-report/floor-performance-report.component';

// Call Activity Report
import { CallActivityReportComponent } from './call-activity-chart/call-activity-report/call-activity-report.component';
import { GlobalCallActivityReportComponent } from './call-activity-chart/global-call-activity-report/global-call-activity-report.component';
import { SkillGroupCallActivityReportComponent } from './call-activity-chart/skill-group-call-activity-report/skill-group-call-activity-report.component';
import { SkillGroupCallInfoDialogComponent } from './call-activity-chart/skill-group-call-info-dialog/skill-group-call-info-dialog.component';
import { SkillGroupChildChartComponent } from './call-activity-chart/skill-group-child-chart/skill-group-child-chart.component';
import { SkillGroupMainChartComponent } from './call-activity-chart/skill-group-main-chart/skill-group-main-chart.component';

//Agent Statistics Report
import { AgentStatisticsReportComponent } from './agent-statistics/agent-statistics-report/agent-statistics-report.component';
import { SecondsToTimeComponent } from './helper-classes/ag-grid/cell-renderers/seconds-to-time.component';

// Supervisor summary report
import { SupervisorSummaryReportComponent } from './Supervisor-Summary/supervisor-summary-report/supervisor-summary-report.component';

//whatsapp call activity
import { WhatsappActivityReportComponent } from './whatsapp-activity/whatsapp-activity-report/whatsapp-activity-report.component';
import { WhatsappChatInfoDialogComponent } from './whatsapp-activity/whatsapp-chat-info-dialog/whatsapp-chat-info-dialog.component';

//My Performance - My Activity Reports
import { ActivityTemplateComponent } from './my-activity/activity-template/activity-template.component';
import { AgentActivityReportComponent } from './my-activity/agent-activity-report/agent-activity-report.component';
import { MyActivityReportComponent } from './my-activity/my-activity-report/my-activity-report.component';
import { StatsDetailComponent } from './my-activity/stats-detail/stats-detail.component';


import { TrueFalseComponent } from './helper-classes/ag-grid/cell-renderers/true-false.component';
import { PercentageComponent } from './helper-classes/ag-grid/cell-renderers/percentage.component';
import { DollarComponent } from './helper-classes/ag-grid/cell-renderers/dollar.component';
import { StringUtilPipe } from './helper-classes/pipes/string-util.pipe';
import { StringUtilComponent } from './helper-classes/string-util.component';

import { NoticeComponent } from '../../partials/content/general/notice/notice.component';



const routes: Routes = [
  {
    path: '',
    component: FlashreportsComponent,
    children: [
      {
        path: '',
        redirectTo: 'floorperformancereport',
        component: FloorPerformanceReportComponent
        // pathMatch: 'full'
      },
      {
        path: 'floorperformancereport',
        component: FloorPerformanceReportComponent
      },
      {
        path: 'callactivityreport',
        component: CallActivityReportComponent
      },
      {
        path: 'agentstatisticsreport',
        component: AgentStatisticsReportComponent
      },
      {
        path: 'supervisorsummaryreport',
        component: SupervisorSummaryReportComponent
      },
      {
        path: 'whatsappcallactivityreport',
        component: WhatsappActivityReportComponent
      }
      ,
      {
        path: 'agentperformance',
        component: AgentActivityReportComponent
      }  ,
      {
        path: 'myperformance',
        component: MyActivityReportComponent
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
    MatCardModule,
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
    NgSelectModule,
    NgOptionHighlightModule,
    ChartsModule,
    
    AgGridModule.withComponents([
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
    ActionNotificationComponent,
    FloorPerformanceReportComponent,
    FloorPerformanceDetailComponent,
    FloorPerformanceTemplateComponent,
    FlashreportsComponent,
    CallActivityReportComponent,
    GlobalCallActivityReportComponent,
    SkillGroupCallActivityReportComponent,
    SkillGroupCallInfoDialogComponent,
    SkillGroupChildChartComponent,
    SkillGroupMainChartComponent,
    AgentStatisticsReportComponent,
    SecondsToTimeComponent,
    TrueFalseComponent,
    PercentageComponent,
    DollarComponent,
    SupervisorSummaryReportComponent,
    WhatsappActivityReportComponent,
    WhatsappChatInfoDialogComponent,
    ActivityTemplateComponent,
    AgentActivityReportComponent,
    MyActivityReportComponent,
    StatsDetailComponent
  ],
  declarations: [
    FlashreportsComponent,
    FloorPerformanceReportComponent,
    FloorPerformanceDetailComponent,
    FloorPerformanceTemplateComponent,
    CallActivityReportComponent,
    GlobalCallActivityReportComponent,
    SkillGroupCallActivityReportComponent,
    SkillGroupCallInfoDialogComponent,
    SkillGroupChildChartComponent,
    SkillGroupMainChartComponent,
    AgentStatisticsReportComponent, SecondsToTimeComponent,
    TrueFalseComponent,
    PercentageComponent,
    DollarComponent,
    SupervisorSummaryReportComponent,
    WhatsappActivityReportComponent,
    WhatsappChatInfoDialogComponent,
    ActivityTemplateComponent,
    AgentActivityReportComponent,
    MyActivityReportComponent,
    StatsDetailComponent,
    StringUtilComponent,
    StringUtilPipe
  ],
  
}) export class FlashreportsModule { }
