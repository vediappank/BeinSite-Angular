import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { Widget1Data } from '../../../../views/partials/content/widgets/widget1/widget1.component';
import { StringUtilComponent } from '../../../../helper-classes/string-util.component';
import { FinanceSummaryDetailComponent } from '../finance-summary-detail/finance-summary-detail.component';
import { MatDialog } from '@angular/material';
import { FinanceRequest } from '../../reports/_models/financerequest.model';
import { CCFinanceRequest } from '../_models/ccfinancerequest.model';
import { FiancenBarChartWidgetModel } from '../../../partials/content/widgets/_model/finance-bar-line-char.model';

@Component({
  selector: 'kt-finance-widget',
  templateUrl: './finance-widget.component.html',
  styleUrls: ['./finance-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceWidgetComponent implements OnInit, OnChanges {

  // Public properties
  @Input() public data: any;
  @Input() public inputs: CCFinanceRequest;
  public Detailsinputs: CCFinanceRequest;
  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  
  public chartFiananceTransactionData:FiancenBarChartWidgetModel[]=[];
  public chartFiananceRevenueData:FiancenBarChartWidgetModel[]=[];
  financeChartData: any;
  ChartInputs: CCFinanceRequest;

  public finReptWidgetData: {
    summary?: Widget1Data[];
    transData?: { labels: string[]; datasets: ChartDataSets[], dashboard_inputs: any };
    revData?: { labels: string[]; datasets: ChartDataSets[], dashboard_inputs: any };
  };
  public finReptWidgetData$ = new BehaviorSubject<any>(this.finReptWidgetData);

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    //alert('page called');
    // this.finReptWidgetData = {summary: []};
    // this.finReptWidgetData$.next(this.finReptWidgetData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        const change = changes[propName];
        if (change.currentValue) {
          const finReptData = change.currentValue;
         // console.log('Finance Widget Chart Data Changes in popup::::' + JSON.stringify(change.currentValue));
         // console.log('Finance Widget inputs::::' + JSON.stringify(this.inputs));

          //Chart Data Information
          this.financeChartData = this.data.filter(item =>item.Date !== 'SUMMARY');    
          this.chartFiananceTransactionData=[];  
          this.chartFiananceRevenueData=[];    
          for(let i=0; i<this.financeChartData.length; i++  )
          {
            this.chartFiananceTransactionData.push({CategoryColumn:this.financeChartData[i].WeekORDay,
              ValueCoulmn: this.financeChartData[i].Transactions,
              LineCoulmn: this.financeChartData[i].ConvertionRate+' %' ,
              FromDate:this.financeChartData[i].StartDate,
              ToDate:this.financeChartData[i].EndDate,
              Date:this.financeChartData[i].Date,
              ParentModuleName:'Finance',
              ToolTipHeader:'Transactions',
              ToolTipHeader1:'Convertion Rate',
              BarOverValue:this.financeChartData[i].Transactions
            })
          }
          //console.log('chartQualityEvalData:::'+ JSON.stringify(this.financeChartData));
         
          for(let i=0; i<this.financeChartData.length; i++  )
          {
            this.chartFiananceRevenueData.push({CategoryColumn:this.financeChartData[i].WeekORDay,
              ValueCoulmn: this.financeChartData[i].Revenue,
              LineCoulmn: (Math.floor(this.financeChartData[i].Revenue / this.financeChartData[i].Transactions) >0 ?Math.floor(this.financeChartData[i].Revenue / this.financeChartData[i].Transactions):0)+' $',                
              FromDate:this.financeChartData[i].StartDate,
              ToDate:this.financeChartData[i].EndDate,
              Date:this.financeChartData[i].Date,
              ParentModuleName:'Finance',
              ToolTipHeader:'Revenue',
              ToolTipHeader1:'ARPT ',
              BarOverValue:this.financeChartData[i].Revenue
            })
          }
        
         // console.log('chartFinanceData:::'+ JSON.stringify(this.chartFiananceRevenueData));
          this.ChartInputs = this.inputs; 

          const finSummRec = finReptData.find(x => x.Date === 'SUMMARY');
          this.finReptWidgetData = {};
          this.finReptWidgetData.summary = [
            {
              title: '# Total Transactions', popupIcon: true, desc: '', value: StringUtilComponent.formatNumber(finSummRec.Transactions),
              valueClass: 'kt-font-primary',valueformat:'(#)'
            },
            { title: 'Total Revenue', popupIcon: true, desc: '', value: StringUtilComponent.dollar(finSummRec.Revenue), valueClass: 'kt-font-success' }
          ];
          this.finReptWidgetData.transData = {
            labels: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Date + '~' + item.StartDate
              + '~' + item.EndDate),
            datasets: [
              {
                label: ' Transactions',
                backgroundColor: '#5e2e94', xAxisID: 'x-axis-1', yAxisID: 'y-axis-1',
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Transactions)
              },
              {
                label: 'Convertion Rate',
                backgroundColor: '#5e2e94', fill: false, borderColor: '#5e2e94', type: 'line', xAxisID: 'x-axis-1', yAxisID: 'y-axis-2',
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.ConvertionRate)
              }
            ],
            dashboard_inputs: this.inputs
          };
          this.finReptWidgetData.revData = {
            labels: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Date + '~' + item.StartDate
              + '~' + item.EndDate),
            datasets: [
              {
                label: 'Day\'s Revenue',
                backgroundColor: '#5e2e94', xAxisID: 'x-axis-1', yAxisID: 'y-axis-1',
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => item.Revenue)
              },
              {
                label: 'Avg. Daily Revenue',
                backgroundColor: '#5e2e94', fill: false, borderColor: '#5e2e94', type: 'line', xAxisID: 'x-axis-1', yAxisID: 'y-axis-2',
                data: finReptData.filter(item => item.Date !== 'SUMMARY').map(item => Math.floor(item.Revenue / item.Transactions) >0 ?Math.floor(item.Revenue / item.Transactions):0)
              }
            ],
            dashboard_inputs: this.inputs
          };
          this.finReptWidgetData$.next(this.finReptWidgetData);
        }
      }
    }
  }

  message: any;
  GetPopupInfo($event) {
    // this.message = $event
    // console.log('Finance performance input :::' +this.message );
    // const dialogRef = this.dialog.open(FinanceSummaryDetailComponent, { data: { inputs: this.inputs, repInput: this.message } });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    // });

    this.message = $event
    let GroupBy: string = '';
    let Title: string;
  //  console.log('Quality performance input :::' + JSON.stringify(this.message));
    if (this.message.includes(',')) {
      Title = this.message.split(',')[0];
      GroupBy = this.message.split(',')[1];
      this.Detailsinputs = {
        GroupBy: GroupBy,
        repStartDate: this.inputs.repStartDate,
        repEndDate: this.inputs.repEndDate,
        RoleID: this.inputs.RoleID,
        callcenter: this.inputs.callcenter,
        dayorweek: this.inputs.dayorweek
      }
    }
    else {
      Title = this.message;
      this.Detailsinputs = {
        GroupBy: GroupBy,
        repStartDate: this.inputs.repStartDate,
        repEndDate: this.inputs.repEndDate,
        RoleID: this.inputs.RoleID,
        callcenter: this.inputs.callcenter,
        dayorweek: this.inputs.dayorweek
      }
    }
   // console.log('Finance Detail Reports input :::' + JSON.stringify(this.Detailsinputs));
    const dialogRef = this.dialog.open(FinanceSummaryDetailComponent, { data: { inputs: this.Detailsinputs, repInput: Title } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }
}
