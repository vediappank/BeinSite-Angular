import { NgxPermissionsModule } from 'ngx-permissions';
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Angular Material


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
// NgBootstrap
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Translation
import { TranslateModule } from '@ngx-translate/core';
// Loading bar
import { LoadingBarModule } from '@ngx-loading-bar/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Ngx DatePicker
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Core Module
import { CoreModule } from '../../core/core.module';
import { HeaderComponent } from './header/header.component';
import { AsideLeftComponent } from './aside/aside-left.component';
import { FooterComponent } from './footer/footer.component';
import { SubheaderComponent } from './subheader/subheader.component';
import { BrandComponent } from './brand/brand.component';
import { TopbarComponent } from './header/topbar/topbar.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { PartialsModule } from '../partials/partials.module';
import { BaseComponent } from './base/base.component';
import { PagesModule } from '../pages/pages.module';
import { HtmlClassService } from './html-class.service';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
import { PermissionEffects, permissionsReducer, RoleEffects, rolesReducer, ActionTrackerEffects,
	 ActionTrackerTopicEffects } from '../../core/auth';
import { CCRoleEffects, ccrolesReducer, CallCenterEffects,CallCenterReducer } from '../../core/auth';
import { ActivityEffects, activityReducer } from '../../core/auth';
import { CCKpiEffects, CCkpiReducer } from '../../core/auth';
import { MeetingEffects, MeetingReducer } from '../../core/auth';
import { ActionTracker, ActionTrackerReducer } from '../../core/auth';
import { ActionTrackerTopicReducer, ActionTrackerTopic,ActionTrackerTopicConversationEffects,
	ActionTrackerTopicConversationReducer } from '../../core/auth';

@NgModule({
	declarations: [
		BaseComponent,
		FooterComponent,

		// headers
		HeaderComponent,
		BrandComponent,
		HeaderMobileComponent,

		// subheader
		SubheaderComponent,

		// topbar components
		TopbarComponent,

		// aside left menu components
		AsideLeftComponent,

		// horizontal menu components
		MenuHorizontalComponent,

		ErrorPageComponent,
	],
	exports: [
		BaseComponent,
		FooterComponent,

		// headers
		HeaderComponent,
		BrandComponent,
		HeaderMobileComponent,

		// subheader
		SubheaderComponent,

		// topbar components
		TopbarComponent,

		// aside left menu components
		AsideLeftComponent,

		// horizontal menu components
		MenuHorizontalComponent,

		ErrorPageComponent,
	],
	providers: [
		HtmlClassService,
	],
	imports: [
		CommonModule,
		RouterModule,
		NgxPermissionsModule.forChild(),
		StoreModule.forFeature('roles', rolesReducer),
		StoreModule.forFeature('ccroles', ccrolesReducer),
		StoreModule.forFeature('callcenters', CallCenterReducer),
		StoreModule.forFeature('CCkpis', CCkpiReducer),
		StoreModule.forFeature('Meeting', MeetingReducer),
		StoreModule.forFeature('activitys', activityReducer),
		StoreModule.forFeature('permissions', permissionsReducer),
		StoreModule.forFeature('ActionTrackers', ActionTrackerReducer),
		StoreModule.forFeature('ActionTrackerTopics', ActionTrackerTopicReducer),
		StoreModule.forFeature('ActionTrackerTopicCovnersation', ActionTrackerTopicConversationReducer),
		EffectsModule.forFeature([PermissionEffects, RoleEffects,CCRoleEffects,CallCenterEffects,
			CCKpiEffects,MeetingEffects,ActivityEffects, ActionTrackerEffects, ActionTrackerTopicEffects,
		ActionTrackerTopicConversationEffects]),		
		//EffectsModule.forFeature([ActivityEffects,ActivityEffects]),
		PagesModule,
		PartialsModule,
		CoreModule,
		PerfectScrollbarModule,
		FormsModule,
		MatProgressBarModule,
		MatTabsModule,
		MatButtonModule,
		MatTooltipModule,
		TranslateModule.forChild(),
		LoadingBarModule,
		NgxDaterangepickerMd,
		InlineSVGModule,
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
		// ng-bootstrap modules
		NgbProgressbarModule,
		NgbTooltipModule,
	]
})
export class ThemeModule {
}
