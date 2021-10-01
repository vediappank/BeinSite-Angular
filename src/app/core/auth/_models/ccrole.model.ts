import { BaseModel } from '../../_base/crud';

export class CCRole extends BaseModel {
    id: number;
    RoleName: string;
    RoleShortName: string;
    permissions: any[];
    isCoreRole: boolean = false;
    privilegeid:number;
    mainmenuid:number;
    roleid:number;
   
    
    clear(): void {
        this.id = undefined;
        this.RoleName = '';
        this.RoleShortName = '';
        this.permissions = [];
        this.isCoreRole = false;
        this.privilegeid=undefined;
        this.mainmenuid=undefined;
        this.roleid=undefined;
      
	}
}
