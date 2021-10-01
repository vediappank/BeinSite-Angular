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
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import {MatTreeModule} from '@angular/material/tree';

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
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import {LicenseManager} from "ag-grid-enterprise";
LicenseManager.setLicenseKey("Bein_Media_Group_Bein_Media_Group_single_1_Devs__11_September_2020_[v2]_MTU5OTc4MjQwMDAwMA==81b2092e3c967a0a47c97abecc7d1c89")

import { NgxScreenfullModule } from '@ngx-extensions/screenfull';
import { RtIvrDashboardComponent } from './rt-ivr-dashboard/rt-ivr-dashboard.component';
import { RtDashboardComponent } from './rt-dashboard.component';
import { SideBarDetailComponent } from './side-bar-detail/side-bar-detail.component';


const routes: Routes = [
	{
		path: '',
		component: RtDashboardComponent,
		children: [
			{
				path: '',
				redirectTo: 'rt-dashboard',
                pathMatch: 'full'
            },			
			{
				path: 'rtivrdashboard',
				component:RtIvrDashboardComponent
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
			
	],
	declarations: [
        RtDashboardComponent,        
        RtIvrDashboardComponent, SideBarDetailComponent,
	]
})
export class RTDashboardModule {}
