

import { BaseModel } from '../../../../core/_base/crud';

export class MAssessmentFormList extends BaseModel {
    id: number;  
     
    value:string;
   
    
    clear(): void {
        this.id= undefined;
      
        this.value= '';
     
	}
}