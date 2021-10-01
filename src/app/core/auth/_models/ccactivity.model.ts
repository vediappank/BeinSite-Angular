import { BaseModel } from '../../_base/crud';

export class CCActivity extends BaseModel {
    id: number;
    name:string;
    description:string;
    // Activityid: number;
    // ActivityName: string;
    // ActivityShortName: string; 
    
   
    
    clear(): void {
        this.id= undefined;
        this.name= '';
        this.description=  '';
        // this.Activityid = undefined;
        // this.ActivityName = '';
        // this.ActivityShortName = '';
      
	}
}

