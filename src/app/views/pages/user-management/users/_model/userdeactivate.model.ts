

export class UserDeActivateModel {  
    id: number;    
    attritionid: number; 
    description:string;
    clear(): void {
        this.id = undefined;
        this.attritionid = undefined;
        this.description='';
    }
}

