import { BaseModel } from '../../_base/crud';

export class Role extends BaseModel {
    id: number;
    RoleName: string;
    RoleShortName: string;
    permissions: any[];
    DashboardModulePermission: ModuleModel[];
    orgpermissions: any[];
    isCoreRole: boolean = false;
    privilegeid:number;
    mainmenuid:number;
    roleid:number;
    TeamMeetingApprover:boolean;
    OnetoOneMeetingApprover:boolean;
    TrainingMeetingApprover:boolean;
    ForecastApprover:boolean;
    ActionTrackerApprover:boolean;
    call_center_ids : string;
    clear(): void {
        this.id = undefined;
        this.RoleName = '';
        this.RoleShortName = '';
        this.permissions = [];
        this.orgpermissions=[];
        this.DashboardModulePermission=[];
        this.isCoreRole = false;
        this.privilegeid=undefined;
        this.mainmenuid=undefined;
        this.roleid=undefined;
    this.TeamMeetingApprover=false;
    this.OnetoOneMeetingApprover=false;
    this.TrainingMeetingApprover=false;
    this.ForecastApprover=false;
this.ActionTrackerApprover=false;
this.call_center_ids ='';
      
	}
}

export class ModuleModel extends BaseModel {
    DashboardID: number;
    DashboardName: string;
    ModuleID: number;
    ModuleName: string;
    Checked: number;
    clear(): void {
        this.DashboardID = undefined;
        this.DashboardName = '';
        this.ModuleID = undefined;
        this.ModuleName = '';
        this.Checked=undefined;
	}
}
