// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';

// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
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
  MatTooltipModule,
  MatSidenavModule, MatToolbarModule
} from '@angular/material';



// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { ChartsModule } from 'ng2-charts';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxScreenfullModule } from '@ngx-extensions/screenfull';
import { DatePipe } from '@angular/common'
import { DashboardComponent } from './dashboard.component';
import { BusinessreviewdashboardComponent } from './businessreviewdashboard/businessreviewdashboard.component';
import { TestDashboardComponent } from './test-dashboard/test-dashboard.component';
import { CBRDashboardComponent } from './cbrdashboard/cbrdashboard.component';
import { RatioDetailComponent } from './ratio-detail/ratio-detail.component';
import { ActivityWidgetComponent } from './activity-widget/activity-widget.component';
import { FinanceWidgetComponent } from './finance-widget/finance-widget.component';
import { QualityWidgetComponent } from './quality-widget/quality-widget.component';
import { AuxCodesWidgetComponent } from './aux-codes-widget/aux-codes-widget.component';
import { QualityDetailComponent } from './quality-detail/quality-detail.component';
import { AgtTimeWidgetComponent } from './agt-time-widget/agt-time-widget.component';
import { AbsentiesWidgetComponent } from './absenties-widget/absenties-widget.component';
import { ActivityWidgetDetailComponent } from './activity-widget-detail/activity-widget-detail.component';
import { AbsentiesDetailComponent } from './absenties-detail/absenties-detail.component';
import { AgtTimeMgtWidgetComponent } from './agt-time-mgt-widget/agt-time-mgt-widget.component';
import { BillableDetailComponent } from './billable-detail/billable-detail.component';
import { InboundPerformanceWidgetComponent } from './inbound-performance-widget/inbound-performance-widget.component';
import { OutboundPerformanceWidgetComponent } from './outbound-performance-widget/outbound-performance-widget.component';
import { WhatsappPerformanceWidgetComponent } from './whatsapp-performance-widget/whatsapp-performance-widget.component';
import { CustomerExprienceWidgetComponent } from './customer-exprience-widget/customer-exprience-widget.component';
import { CoachingPerformanceWidgetComponent } from './coaching-performance-widget/coaching-performance-widget.component';
import { AgtTimeMgtWidgetDetailComponent } from './agt-time-mgt-widget-detail/agt-time-mgt-widget-detail.component';
import { InboundPerformanceDetailComponent } from './inbound-performance-detail/inbound-performance-detail.component';
import { WhatsappPerformanceDetailComponent } from './whatsapp-performance-detail/whatsapp-performance-detail.component';
import { OutboundPerformanceDetailComponent } from './outbound-performance-detail/outbound-performance-detail.component';
import { CustomerExprienceDetailComponent } from './customer-exprience-detail/customer-exprience-detail.component';
import { FinanceSummaryDetailComponent } from './finance-summary-detail/finance-summary-detail.component';
import { OutboundDashboardComponent } from './outbound-dashboard/outbound-dashboard.component';
import { OutboundSidebarDetailsComponent } from './outbound-sidebar-details/outbound-sidebar-details.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: BusinessreviewdashboardComponent
      },
      {
        path: 'ccratiodashboard',
        component: BusinessreviewdashboardComponent
      },
      {
        path: 'cbrdashboard',
        component: CBRDashboardComponent
      },
      {
        path: 'testdashboard',
        component: TestDashboardComponent
      },
      {
        path: 'outbounddashboard',
        component: OutboundDashboardComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AngularFontAwesomeModule,
    PartialsModule,
    CoreModule,
    HttpClientModule,
    PartialsModule,
    FormsModule,
    MatTreeModule,
    TreetableModule,
    NgbModule,
    RouterModule.forChild(routes),
    NgxDaterangepickerMd.forRoot(),
    BsDatepickerModule.forRoot(),
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
    MatSidenavModule, MatToolbarModule,
    MatDialogModule,
    NgxDaterangepickerMd,
    AgGridModule.withComponents([
      BusinessreviewdashboardComponent,
      
    ]),
    NgxScreenfullModule,
    ChartsModule
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
    LayoutUtilsService,
    [DatePipe]
  ],
  entryComponents: [
    ActionNotificationComponent,
    RatioDetailComponent,
    QualityDetailComponent,    
    ActivityWidgetDetailComponent,
    AbsentiesDetailComponent,
    BillableDetailComponent,
    AgtTimeMgtWidgetDetailComponent,
    InboundPerformanceDetailComponent,
    WhatsappPerformanceDetailComponent,
    OutboundPerformanceDetailComponent,
    CustomerExprienceDetailComponent,
    FinanceSummaryDetailComponent,
    OutboundDashboardComponent
   
  ],
  declarations: [
    DashboardComponent,
    BusinessreviewdashboardComponent,
    TestDashboardComponent,
    CBRDashboardComponent,
    RatioDetailComponent,
    ActivityWidgetComponent,
    FinanceWidgetComponent,
    QualityWidgetComponent,
    AuxCodesWidgetComponent,
    QualityDetailComponent,
    AgtTimeWidgetComponent,    
    AbsentiesWidgetComponent,
    ActivityWidgetDetailComponent,
    AbsentiesDetailComponent,
    AgtTimeMgtWidgetComponent,
    BillableDetailComponent,
    InboundPerformanceWidgetComponent,
    OutboundPerformanceWidgetComponent,
    WhatsappPerformanceWidgetComponent,
    CustomerExprienceWidgetComponent,
    CoachingPerformanceWidgetComponent,
    AgtTimeMgtWidgetDetailComponent,
    InboundPerformanceDetailComponent,
    WhatsappPerformanceDetailComponent,
    OutboundPerformanceDetailComponent,
    CustomerExprienceDetailComponent,    
    FinanceSummaryDetailComponent, OutboundDashboardComponent, OutboundSidebarDetailsComponent
  ]
})
export class DashboardModule {
}


