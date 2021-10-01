// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('../app/views/pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'user-management',
        loadChildren: () => import('../app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
      },
      {
        path: 'forecast',
        loadChildren: () => import('../app/views/pages/forecast/forecast.module').then(m => m.ForecastModule)
      },
      {
        path: 'userprofile',
        loadChildren: () => import('../app/views/pages/userprofile/userprofile.module').then(m => m.UserProfileModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../app/views/pages/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'rt-dashboard',
        loadChildren: () => import('../app/views/pages/rt-dashboard/rt-dashboard.module').then(m => m.RTDashboardModule)
      },
      {
        path: 'meeting',
        loadChildren: () => import('../app/views/pages/meeting/meeting.module').then(m => m.MeetingModule)
      },
      {
        path:'flashreports',        
        loadChildren:() => import('../app/views/pages/flashreports/flashreports.module').then(m => m.FlashreportsModule)
      },
      {
        path:'operations',        
        loadChildren:() => import('../app/views/pages/operations/operations.module').then(m => m.OperationsModule)
      },
      {
        path:'vouchers',        
        loadChildren:() => import('../app/views/pages/vouchers/vouchers.module').then(m => m.VouchersModule)
      },
      {
        path: 'error/403',
        component: ErrorPageComponent,
        data: {
          type: 'error-v6',
          code: 403,
          title: '403... Access forbidden',
          desc: 'Looks like you don\'t have permission to access for requested page.<br>Please, contact administrator'
        }
      },
      { path: 'error/:type', component: ErrorPageComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
  { path: '', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, enableTracing: false, paramsInheritanceStrategy: 'always' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
