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
import { UserManagementComponent } from './user-management.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
//import { RoleEditDialogComponent } from './roles/role-edit/role-edit.dialog.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import {MatTreeModule} from '@angular/material/tree';

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
import { CcroleslistComponent } from './ccroles/ccroleslist/ccroleslist.component';
import { CcroleeditComponent } from './ccroles/ccroleedit/ccroleedit.component';

import { ActivitylistComponent } from './activity/activitylist/activitylist.component';
import { ActivityeditComponent } from './activity/activityedit/activityedit.component';
import { KpilistComponent } from './kpi/kpilist/kpilist.component';
import { KpieditComponent } from './kpi/kpiedit/kpiedit.component';
import { UseractivateComponent } from './users/useractivate/useractivate.component';
import { UserdeactivateComponent } from './users/userdeactivate/userdeactivate.component';
import { CallcenterListComponent } from './callcenter/callcenter-list/callcenter-list.component';
import { CallcenterEditComponent } from './callcenter/callcenter-edit/callcenter-edit.component';
import { RoleSelectionWidgetComponent } from './callcenter/role-selection-widget/role-selection-widget.component';

import { RoleEditComponent } from './roles/role-edit/role-edit.component';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
			},
			{
				path: 'roles',
				component: RolesListComponent
			},
			{
				path: 'ccroles',
				component: CcroleslistComponent
			},
			{
				path: 'ccactivity',
				component: ActivitylistComponent
			},
			{
				path: 'users',
				component: UsersListComponent
			},
			
			{
				path: 'callcenter',
				component: CallcenterListComponent
			},
			{
				path: 'users:id',
				component: UsersListComponent
			},
			{
				path: 'users/add',
				component: UserEditComponent
			},
			{
				path: 'users/add:id',
				component: UserEditComponent
			},
			{
				path: 'users/edit',
				component: UserEditComponent
			},
			{
				path: 'users/edit/:id',
				component: UserEditComponent
			},
			{
				path: 'roles:id',
				component: RolesListComponent
			},
			{
				path: 'roles/add',
				component: RoleEditComponent
			},
			{
				path: 'roles/add:id',
				component: RoleEditComponent
			},
			{
				path: 'roles/edit',
				component: RoleEditComponent
			},
			{
				path: 'roles/edit/:id',
				component: RoleEditComponent
			},
			{
				path: 'cckpilist',
				component: KpilistComponent
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
		AgGridModule
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
		RoleEditComponent,	
		//RoleEditDialogComponent,
		CcroleeditComponent,
		ActivityeditComponent,
		KpieditComponent,
		UseractivateComponent,
		UserdeactivateComponent	,
		CallcenterEditComponent
	],
	declarations: [
		UserManagementComponent, 
		UsersListComponent,
		UserEditComponent,
		RolesListComponent,
		RoleEditComponent,		
		//RoleEditDialogComponent,		
		CcroleslistComponent,
		CcroleeditComponent,
		ActivitylistComponent,
		ActivityeditComponent,
		KpilistComponent,
		KpieditComponent,
		UseractivateComponent,
		UserdeactivateComponent,
		CallcenterListComponent,
		CallcenterEditComponent,
		RoleSelectionWidgetComponent,
		RoleEditComponent
		
	]
})
export class UserManagementModule {}
