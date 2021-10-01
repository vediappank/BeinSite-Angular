

export class UserActivateModel {  
    id: number;    
    roleid: number;
    ccroleid: number; 
    activityid:number;
    supervisorid:number;
    
    clear(): void {
        this.id = undefined;
        this.roleid = undefined;
        this.ccroleid = undefined;
        this.activityid= undefined;    
        this.supervisorid= undefined;     
    }
}

