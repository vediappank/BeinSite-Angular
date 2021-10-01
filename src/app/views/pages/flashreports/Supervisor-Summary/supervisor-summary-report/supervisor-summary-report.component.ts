import { Component, OnInit, OnDestroy } from '@angular/core';
import { AWDBAgent } from '../../model/awdbagent.model';
import { Subscription } from 'rxjs';
import { AdminService } from '../../_services/admin.service';
import { AgentService } from '../../_services/agent.service';
import * as moment from 'moment';
import { BeinUser } from '../..//model/bein-user.model';
import { AgentStatistics } from '../../model/agent-statistics.model';
import { Supervisorsummary } from '../../model/supervisorsummary.model';
import 'ag-grid-enterprise';


@Component({
  selector: 'app-supervisor-summary-report',
  templateUrl: './supervisor-summary-report.component.html',
  styleUrls: ['./supervisor-summary-report.component.scss']
})
export class SupervisorSummaryReportComponent implements OnInit, OnDestroy {
  public NewCount:number=0;
  public AssignedCount:number=0;
  public PendingCount:number=0;
  public ResolvedCount:number=0;
  public barchart: any;  
  public SupervisorWiseTaskCountsList :any;
  public awdbAgent: AWDBAgent;
  public beINUser: BeinUser;
  public reportRange: any;
  public inputreportDateRanges: any[];
  public SupervisorWiseTicketList:any = [];

  // For Bar Chart
  public chartOptions :any;
  public chartData : any;
  public colors : any;
  public labels :any;

  public chartOptions1 :any;
  public chartData1 : any;
  public colors1 : any;
  public labels1 :any;

  public gridSummaryData: any;
  public getGridRowStyle: any;
  public rowData : any;
  public columnDefs: any;

  public reportDateRanges: any = {
    // 'Today': [moment().startOf('day'), moment().add(1, 'days').startOf('day')],
    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().startOf('day')],
    'This Week': [moment().startOf('week'), moment().endOf('week')],
    'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'This Year': [moment().startOf('year'), moment().endOf('year')],
    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
  }
  
  public Supervisorsummary : Supervisorsummary;  
  public SupervisorsummaryList : Supervisorsummary[];  
  public SupervisorNameWisesummaryList : Supervisorsummary[];
  public agentData: AgentStatistics[]; 
  public chartTheme: string;
  private awdbAgentSub: Subscription;
  private beINUserSub: Subscription;
  public userId: string;

  constructor(private adminService: AdminService, private agentService: AgentService) {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userId = JSON.parse(localStorage.getItem('currentUser')).agentid;
     }
    this .awdbAgentSub = adminService.awdbAgent$.subscribe(data => {
      this .awdbAgent = data;
    });
    this .beINUserSub = adminService.currBeinUser$.subscribe(data => {
      this .beINUser = data;
    });
  }

  ngOnInit() {    
    if ( ! this .chartTheme || this .chartTheme === '' ) {
      this .chartTheme = 'bein-theme';
    }
    this .reportRange = {
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    }; 
    this.getReportData();
    
    //Reports Data
    this.columnDefs = [
      { headerName: 'Name', field: 'Name',width: 300 },
      { headerName: 'New Count', field: 'NewCount',width: 110 },
      { headerName: 'Assingned Count', field: 'AssignedCount',width: 140 },
      { headerName: 'Pending Count', field: 'PendingCount',width: 140 },
      { headerName: 'Resolved Count', field: 'ResolvedCount',width: 140 }
    ];
  }

  ngOnDestroy() {
    this .awdbAgentSub.unsubscribe();
    this .beINUserSub.unsubscribe();    
  }

  //start  
    // CHART CLICK EVENT.
    onChartClick(event) {
      console.log(event);
    }
  //end

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  getReportData() 
  {   
    if( this .reportRange.startDate && this .reportRange.endDate) {
      
      var stDateTime,edDateTime ;      
      stDateTime= moment( this .reportRange.startDate );
      console.log('StartDateTime: ' + this .reportRange.startDate + ':::::' + stDateTime.format('YYYY-MM-DDTHH:mm:ss') );      
      edDateTime = moment( this .reportRange.endDate );      
      console.log('EndDateTime: ' + this .reportRange.endDate + ':::::' + edDateTime.format('YYYY-MM-DDTHH:mm:ss') );
      const req: Supervisorsummary = {
        startDateTime: stDateTime.format('YYYY-MM-DDTHH:mm:ss') + 'Z' ,
        endDateTime: edDateTime.format('YYYY-MM-DDTHH:mm:ss') + 'Z',
        startDateTime_str: stDateTime.format('YYYY-MM-DDTHH:mm:ss') + 'Z' ,
        endDateTime_str: edDateTime.format('YYYY-MM-DDTHH:mm:ss') + 'Z',
        Name:"", NewCount: 0,AssignedCount:0,PendingCount: 0,ResolvedCount: 0
      }      
      
      this.adminService.getSupervisorCallSummary(req).subscribe(SupervisorData => {
        
        this.SupervisorsummaryList = SupervisorData;          
        console.log('SupervisorsummaryList Return Result:'+ JSON.stringify(this.SupervisorsummaryList));
        let lableArry: string [];    
        if(SupervisorData.length)
        {
        this.NewCount=SupervisorData[0].NewCount;
        this.AssignedCount=SupervisorData[0].AssignedCount;
        this.PendingCount=SupervisorData[0].PendingCount;
        this.ResolvedCount = SupervisorData[0].ResolvedCount;
        lableArry =[ "New",  "Assigned",  "Pending", "Resolved"]; 
      }
      else
      {
        this.NewCount=0;
        this.AssignedCount=0;
        this.PendingCount=0;
        this.ResolvedCount = 0;
        lableArry =[];
      }
              //start Supervisor summary Chart         
                    this.chartOptions = {
                      responsive: true,  // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).    
                      scales: {  
                          xAxes: [{ 
                              gridLines: { display: false},                                 
                              barThickness : 50,
                              display: true  
                            }],  
                          yAxes: [{  
                            display: true,
                            ticks: {
                                suggestedMin: 0,                                
                                beginAtZero: true   
                                }
                          }],  
                      },
                      legend: {  
                        labels: {
                          usePointStyle: true
                        },
                        display: false  
                      }  
                    },  
                    this.labels = lableArry;
                    this.chartData = [
                      {
                        label: 'Call Summary',
                        data: [this.NewCount, this.AssignedCount, this.PendingCount, this.ResolvedCount] 
                      }
                    ];
                    // CHART COLOR.
                    this.colors = [
                      { 
                        backgroundColor: ['Blue','Yellow','Orange','Green'],
                      }                   
                    ]
              //end
                 
      });
// SupervisorWiseTaskCounts Reports      
      this.adminService.getSupervisorWiseTaskCounts(req).subscribe(data1 => {
      
        this.SupervisorWiseTaskCountsList = data1;        
        this.SupervisorWiseTaskCountsList= JSON.stringify(data1);           
        console.log('getSupervisorWiseTaskCounts Return Result:'+ JSON.stringify(this.SupervisorWiseTaskCountsList));        
        
        let NameList:any = [];
        let ValueList:any = [];
        let colorList:any = [];
        for(var i = 0; i < data1.length; i++) {
          NameList.push(data1[i].Name);
          ValueList.push(data1[i].TaskTotalcount);  
          colorList.push(this.getRandomColor() );                
        }

        //start Supervisor summary Chart         
        this.chartOptions1 = {
          responsive: true,  // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).    
          scales: {  
              xAxes: [{ 
                  gridLines: { display: false},  
                  isFixedWidth:false,                                                 
                  barWidth:40,
                  display: true 
                }],  
              yAxes: [{  
                display: true,
                ticks: {
                    suggestedMin: 0,                  
                    beginAtZero: true
                    }
              }],  
          },
          legend1: {  
            labels: {
              usePointStyle: false
            },
            display: false  
          }  
        },  
        this.labels1=  NameList; 
        this.chartData1 = [
          {
            label: 'Call Count',
            data: ValueList   
          }
        ];        
        this.colors1 = [
          { 
            backgroundColor: colorList,
          }                   
        ]        
        console.log('SupervisorNameList:'+ NameList);
          console.log('SupervisorTaskList:'+ ValueList);
        });
//Supervisor wise Task summary
      this. rowData = this.adminService.getSupervisorTaskSummary(req);
      this. rowData.subscribe(data => {
        this.SupervisorNameWisesummaryList = data; 
        this.gridSummaryData =  data;
        var SupervisorTaskSummaryData = JSON.stringify(data);         
        console.log('getSupervisorTaskSummary Return Result:'+ JSON.stringify(SupervisorTaskSummaryData));
      });
    } 
  }
}
