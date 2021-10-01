import moment from 'moment';


export class MeetingModel {  
    meetingids: number[];
    id: number;
    Meeting_Type: string;    
    Approved_By: string;    
    Approved_Datetime: string;    
    Schedule_Start_Datetime: string;
    Schedule_End_Datetime: string;
    StartTime:string;
    EndTime:string;
    Close_Datetime: string;
    Supervisor_ID: number[];
    usersupervisorid:number;
    Status: string;
    Subject: string;
    Description: string;
    Meeting_Summary: string;
    Created_By:number
    Duration:string
    SelectedAgentList:string;
    SelectedAgentNameList:any;
    ApproverName:string;
    clear(): void {
        this.id =undefined;
        this.Meeting_Type='';    
        this.Approved_By=undefined;          
        this.Close_Datetime='';
        this.Supervisor_ID=undefined;
        this.Status='';
        this.Subject='';
        this.Description='';
        this.Meeting_Summary='';
        this.Created_By=undefined;
        let currenttime = moment();
        this.StartTime=moment(currenttime).format("HH:mm");
        this.EndTime=moment(currenttime).add(30,'minutes').format("HH:mm");
        this.Duration='';
        this.SelectedAgentList= '';
        this.SelectedAgentNameList =undefined;
        this.ApproverName='';
	}
}

