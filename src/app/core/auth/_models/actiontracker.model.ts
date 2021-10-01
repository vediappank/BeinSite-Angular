export class ActionTracker {
    id: number;
    name: string;
    description: string;
    orgids: number[];
    userorganizationname: string;
    comments: string;
    orgid: number;
    cid:number;
    cname : string;
    SelectedAgentList:string;
    SelectedAgentNameList:any;
    clear() {
        this.id =undefined;
        this.name = '';
        this.description = '';
        this.orgids = [];
        this.userorganizationname= '';
        this.comments = '';
        this.orgid=undefined;
        this.cid=undefined;
        this.cname='';
        this.SelectedAgentList='';
        this.SelectedAgentNameList=undefined;
    }
}
