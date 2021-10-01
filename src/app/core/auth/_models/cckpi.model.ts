import { BaseModel } from '../../_base/crud';

export class CCKpi extends BaseModel {
    id: number;
    KPI_Name: string;
    KPI_Thresold: string;
    KPI_Min_Thresold: string;
    KPI_Max_Thresold: string;
    CallCenter_ID:number[];
    CallCenter_Name:string;
    callcenterid: number;
    //Kpi_ID:number;
   
    
    clear(): void {
        //this.id= undefined;
        this.KPI_Name= '';
        this.KPI_Thresold= '';
        this.KPI_Min_Thresold= '';
        this.KPI_Max_Thresold= '';
        this.CallCenter_ID= undefined;
      
	}
}
