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
import { AgentforecastComponent } from './agentforecast/agentforecast.component';
import { ForecastComponent } from './forecast.component';
const routes: Routes = [
  {
    path: '',
    component: ForecastComponent,
    children: [
      {
        path: '',
        redirectTo: 'forecast',
        pathMatch: 'full'
      },
      {
        path: 'agentforecast',
        component: AgentforecastComponent
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
    ForecastComponent,
    AgentforecastComponent
  ],
  declarations: [
    ForecastComponent, AgentforecastComponent        

  ]
})export class ForecastModule { }
