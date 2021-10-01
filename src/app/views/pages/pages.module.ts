// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { UserProfileModule } from './userprofile/userprofile.module';
import { OperationsModule } from './operations/operations.module';
import { ReportsModule } from './reports/reports.module';


import { RTDashboardModule } from './rt-dashboard/rt-dashboard.module';
import { MyPageComponent } from './my-page/my-page.component';
import { HomeModule } from './home/home.module';
import { VouchersModule } from './vouchers/vouchers.module';

// import {ProgressbarComponent} from './user-management/reskillingskillgroups/progressbar.component';






@NgModule({
	declarations: [MyPageComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MailModule,
		ECommerceModule,
		ReportsModule,
		HomeModule,
		RTDashboardModule,
		UserManagementModule,
		UserProfileModule,
		OperationsModule,
		VouchersModule
	],
	providers: []
})
export class PagesModule {
}
