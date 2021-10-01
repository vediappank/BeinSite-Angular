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
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { OperationsComponent } from './operations.component';

import { NgCircleProgressModule } from 'ng-circle-progress';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import { MatTreeModule } from '@angular/material/tree';
import { NgxTimelineModule } from 'ngx-timeline';
// import { NgVerticalTimelineModule  } from 'ng-vertical-timeline';

import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';



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
	MatStepperModule,
	MatSliderModule,
	MatSlideToggleModule,
} from '@angular/material';
import {
	usersReducer,
	UserEffects
} from '../../../core/auth';
import { OverlayModule } from '@angular/cdk/overlay';


import { CampaignuploadjobsComponent } from './campaignuploadjobs/campaignuploadjobs.component';
import { CampaignuploadjobDetailsComponent } from './campaignuploadjob-details/campaignuploadjob-details.component';
import { ReskillingskillgroupsComponent } from './reskillingskillgroups/reskillingskillgroups.component';
import { ProgressbarComponent } from './reskillingskillgroups/progressbar.component';
import { ReskillingskillgroupsEditComponent } from './reskillingskillgroupsbyagent/reskillingskillgroups-edit/reskillingskillgroups-edit.component';
import { ButtonRendererComponent } from './reskillingskillgroups/button-renderer.component';
import { ReskillingskilgroupsbyagentlistComponent } from './reskillingskillgroupsbyagent/reskillingskilgroupsbyagentlist/reskillingskilgroupsbyagentlist.component';
import { CampaignuploadComponent } from './campaignupload/campaignupload.component';
import { SaveButtonRendererComponent } from './custom-ag-grid-buttons/save-button-renderer.component';
import { CancelButtonRendererComponent } from './custom-ag-grid-buttons/cancel-button-renderer.component';
import { DetailButtonRendererComponent } from './custom-ag-grid-buttons/detail-button-renderer.component';
import { ActiontrackerlistComponent } from './actiontracker/actiontrackerlist/actiontrackerlist.component';
import { ActiontrackertopiclistComponent } from './actiontracker/actiontrackertopiclist/actiontrackertopiclist.component';
import { ActiontrackereditComponent } from './actiontracker/actiontrackeredit/actiontrackeredit.component';
import { ActiontrackertopiceditComponent } from './actiontracker/actiontrackertopicedit/actiontrackertopicedit.component';
import { ActionTrackerTopicConversationComponent } from './actiontracker/actiontrackertopicconversation/actiontrackertopicconversation.component';
import { ActiontrackerarchivedtopiclistComponent } from './actiontracker/actiontrackerarchivedtopiclist/actiontrackerarchivedtopiclist.component';
import { ActiontrackerAgentSelectionWidgetComponent } from './actiontracker/actiontracker-agent-selection-widget/actiontracker-agent-selection-widget.component';
// Sales Callbackss
import { CalendarComponent } from './salescallbacktask/calendar/calendar.component';
import { CalendarEventComponent } from './salescallbacktask/calendar-event/calendar-event.component';
import { CalendarDashboardComponent } from './salescallbacktask/calendar-dashboard/calendar-dashboard.component';
import { SalescallbacktaskdialogueComponent } from './salescallbacktask/salescallbacktaskdialogue/salescallbacktaskdialogue.component';

// Escalation Tickets
import { CreateReportingTicketComponent } from './create-ticket/create-reporting-ticket/create-reporting-ticket.component';
import { CreateTicketDashboardComponent } from './create-ticket/create-ticket-dashboard/create-ticket-dashboard.component';
import { TicketlistComponent } from './create-ticket/ticketlist/ticketlist.component';
import { ProgressBarSpinnerComponent } from './progress-bar-spinner/progress-bar-spinner.component';

const routes: Routes = [
	{
		path: '',
		component: OperationsComponent,
		children: [
			{
				path: '',
				redirectTo: 'campaignjobs',
				pathMatch: 'full'
			},
			{
				path: 'campaignjobs',
				component: CampaignuploadjobsComponent
			},
			{
				path: 'reskillingskillgroups',
				component: ReskillingskillgroupsComponent
			},
			{
				path: 'reskillingskillgroupsbyagent',
				component: ReskillingskilgroupsbyagentlistComponent
			},
			{
				path: 'campaignupload',
				component: CampaignuploadComponent
			},
			{
				path: 'actiontracker',
				component: ActiontrackerlistComponent
			}
			,
			{
				path: 'actiontracker/add',
				component: ActiontrackereditComponent
			},
			{
				path: 'actiontracker/add:id',
				component: ActiontrackereditComponent
			},
			{
				path: 'actiontracker/edit',
				component: ActiontrackereditComponent
			},
			{
				path: 'actiontracker/edit/:id',
				component: ActiontrackereditComponent
			},
			{
				path: 'actiontrackertopic',
				component: ActiontrackertopiclistComponent
			},
			{
				path: 'salescallbacks',
				component: CalendarDashboardComponent
			},
			{
				path: 'escalationtickets',
				component: TicketlistComponent
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
		MatStepperModule,
		MatSliderModule,
		MatSlideToggleModule,
		AgGridModule,
		NgxTimelineModule,
		NgCircleProgressModule,
		AgGridModule.withComponents([
			CalendarComponent
		]),
		FlatpickrModule.forRoot(),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory,
		}),
		OverlayModule
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
				width: '1000px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		CampaignuploadjobsComponent,
		CampaignuploadjobDetailsComponent,
		ProgressbarComponent,
		ButtonRendererComponent,
		ReskillingskillgroupsEditComponent,
		ReskillingskilgroupsbyagentlistComponent,
		CampaignuploadComponent,
		SaveButtonRendererComponent,
		CancelButtonRendererComponent,
		DetailButtonRendererComponent,
		ActiontrackereditComponent,
		ActiontrackertopiceditComponent,
		ActiontrackerlistComponent,
		ActiontrackertopiclistComponent,
		ActionTrackerTopicConversationComponent,
		ActiontrackerarchivedtopiclistComponent,
		SalescallbacktaskdialogueComponent,
		CreateReportingTicketComponent,
		CreateTicketDashboardComponent,
		TicketlistComponent

	],
	declarations: [
		OperationsComponent,
		CampaignuploadjobsComponent,
		CampaignuploadjobDetailsComponent,
		ReskillingskillgroupsComponent,
		ProgressbarComponent,
		ReskillingskillgroupsEditComponent,
		ButtonRendererComponent,
		ReskillingskilgroupsbyagentlistComponent,
		CampaignuploadComponent,
		SaveButtonRendererComponent,
		CancelButtonRendererComponent,
		DetailButtonRendererComponent,
		ActiontrackereditComponent,
		ActiontrackertopiceditComponent,
		ActiontrackerlistComponent,
		ActiontrackertopiclistComponent,
		ActionTrackerTopicConversationComponent,
		ActiontrackerarchivedtopiclistComponent,
		ActiontrackerAgentSelectionWidgetComponent,
		CalendarComponent, CalendarEventComponent, CalendarDashboardComponent,
		SalescallbacktaskdialogueComponent, CreateReportingTicketComponent, CreateTicketDashboardComponent, TicketlistComponent, ProgressBarSpinnerComponent

	]
})
export class OperationsModule { }
