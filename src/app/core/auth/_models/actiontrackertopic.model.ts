export class ActionTrackerTopic {
    id: number;
    action_tracker_id: number;
    topic:number;
    Findings_or_issues:string;
    actions:string;
    launch_deadline_datetime:string;
    control_deadline_datetime:string;
    target:string;
    executed_per:number;
    status:number;
    comments: string;
    isarchive:boolean;
    userid:number;
    topicname:number;
    statusname:string;
    topicids:number[];
    statusids:number[];
    owner:number;
    ownerids:number[];

    priorityid:number;
    priorityids:number[];
    priorityname:string;
    statuscolor : string;
    prioritycolor : string;

    clear() {
        this.id =undefined;
        this.action_tracker_id =undefined;
        this.topic =undefined;
        this.Findings_or_issues ='';
        this.actions ='';
        this.owner =undefined;
        this.launch_deadline_datetime ='';
        this.control_deadline_datetime ='';
        this.target ='';
        this.executed_per =undefined;
        this.status =undefined;
        this.statusids =[];
        this.topicids =[];
        this.ownerids =[];
        this.comments = '';
        this.isarchive=false;
        this.userid =undefined;

        this.priorityid =undefined;
        this.priorityids =[];
        this.priorityname = '';
        this.statuscolor ='';
        this.prioritycolor ='';
    }
}
