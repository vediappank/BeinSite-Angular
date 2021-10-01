import { BaseModel } from '../../_base/crud';

export class CallCenter extends BaseModel {
    cc_id: number;
    cc_name: string;  
    cc_shortname: string;  
    isactive: boolean;
    selectedRoles:string;
    isCoreRole:boolean;
    clear(): void {
        this.cc_id = undefined;
        this.cc_name = '';
        this.cc_shortname = '';
        this.isactive = false;
        this.isCoreRole = false;
        this.selectedRoles='';
	}
}
