
export class CCRatioDashboardModel {
   
    RoleName: string;
    CCName: string;
    ActualCount:number;
    ExpectedRatio:number;
    ExpectedCount:number;   
    DeviationCount:number;
    RoleID: number;
    
    clear(): void {        
        this.RoleName = '';
        this.CCName = '';       
        this.ActualCount=undefined;
        this.ExpectedRatio=undefined;
        this.ExpectedCount=undefined;  
        this.DeviationCount=undefined;
	}
}
