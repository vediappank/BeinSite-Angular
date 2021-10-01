import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, } from '@angular/material';
import { CoreModule } from '../../../../core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Datatable
import { DataTableComponent } from './general/data-table/data-table.component';
// Ng2 Charts
import { ChartsModule } from 'ng2-charts';
// General widgets
import { Widget1Component } from './widget1/widget1.component';
import { Widget4Component } from './widget4/widget4.component';
import { Widget5Component } from './widget5/widget5.component';
import { Widget12Component } from './widget12/widget12.component';
import { Widget14Component } from './widget14/widget14.component';
import { Widget26Component } from './widget26/widget26.component';
import { Timeline2Component } from './timeline2/timeline2.component';
import { BChartOneDSWidgetComponent } from './bchart-one-ds-widget/bchart-one-ds-widget.component';
import { BChartOneDSCurrWidgetComponent } from './bchart-one-dscurr-widget/bchart-one-dscurr-widget.component';
import { BChartTwoDSStackWidgetComponent } from './bchart-two-dsstack-widget/bchart-two-dsstack-widget.component';
import { PieChartWidgetComponent } from './pie-chart-widget/pie-chart-widget.component';
import { DoughnutChartWidgetComponent } from './doughnut-chart-widget/doughnut-chart-widget.component';
import { LineChartWidgetComponent } from './line-chart-widget/line-chart-widget.component';
import { TimemgtWidgetComponent } from './timemgt-widget/timemgt-widget.component';

import { VariableRadiusPieWidgetComponent } from './variable-radius-pie-widget/variable-radius-pie-widget.component';
import { BarLineMixedChartJSWidgetComponent } from './bar-line-mixed-chartjs-widget/bar-line-mixed-chartjs-widget.component';
import { MultiAxisBarchartWidgetComponent } from './multi-axis-barchart-widget/multi-axis-barchart-widget.component';
import { BarLineChartWidgetComponent } from './bar-line-chart-widget/bar-line-chart-widget.component';
import { BarDetailwidgetComponent } from './bar-detail-widget/bar-detail-widget.component';
import { SelectDuallistWidgetComponent } from './select-duallist-widget/select-duallist-widget.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule } from '@angular/forms';
import { BarChartWidgetComponent } from './bar-chart-widget/bar-chart-widget.component';
import { FinanceBarLineWidgetComponent } from './finance-bar-line-widget/finance-bar-line-widget.component';

import { MultibarLineHiringChartsComponent } from './multibar-line-hiring-charts/multibar-line-hiring-charts.component';
import { MultibarLineCallMetricsChartsComponent } from './multibar-line-call-metrics-charts/multibar-line-call-metrics-charts.component';
import { CallSummaryWidgetComponent } from './call-summary-widget/call-summary-widget.component';

@NgModule({
  declarations: [
    DataTableComponent,
    // Widgets
    Widget1Component,
    Widget4Component,
    Widget5Component,
    Widget12Component,
    Widget14Component,
    Widget26Component,
    Timeline2Component,
    BChartOneDSWidgetComponent,
    BChartOneDSCurrWidgetComponent,
    BChartTwoDSStackWidgetComponent,
    PieChartWidgetComponent,
    DoughnutChartWidgetComponent,
    LineChartWidgetComponent,
    TimemgtWidgetComponent,    
    VariableRadiusPieWidgetComponent,
    BarLineMixedChartJSWidgetComponent,
    MultiAxisBarchartWidgetComponent,
    BarLineChartWidgetComponent,
    BarDetailwidgetComponent,
    SelectDuallistWidgetComponent,
    BarChartWidgetComponent,
    FinanceBarLineWidgetComponent,    
    MultibarLineHiringChartsComponent,
    MultibarLineCallMetricsChartsComponent,
    CallSummaryWidgetComponent
  ],
  entryComponents: [
    BarDetailwidgetComponent
  ],
  exports: [
    DataTableComponent,
    // Widgets
    Widget1Component,
    Widget4Component,
    Widget5Component,
    Widget12Component,
    Widget14Component,
    Widget26Component,
    Timeline2Component,
    BChartOneDSWidgetComponent,
    BChartOneDSCurrWidgetComponent,
    BChartTwoDSStackWidgetComponent,
    PieChartWidgetComponent,
    DoughnutChartWidgetComponent,
    LineChartWidgetComponent,
    TimemgtWidgetComponent,
    VariableRadiusPieWidgetComponent,
    BarLineMixedChartJSWidgetComponent,
    MultiAxisBarchartWidgetComponent,
    BarLineChartWidgetComponent,
    BarDetailwidgetComponent,
    SelectDuallistWidgetComponent,
    BarChartWidgetComponent,
    FinanceBarLineWidgetComponent,
    MultibarLineHiringChartsComponent,
    MultibarLineCallMetricsChartsComponent,
    CallSummaryWidgetComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    MatTableModule,
    CoreModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    ChartsModule,
    AngularDualListBoxModule,
    FormsModule
  ]
})
export class WidgetModule {
}
