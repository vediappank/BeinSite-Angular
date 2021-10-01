export class History {
    activitynamehistory: string;
    activitystartdatehistory: string;
    activiryenddatehistory: string;
    rolenamehistory: string;
    rolestartdatehistory: string;
    roleenddatehistory: string;
    ccrolenamehistory: string;
    ccrolestartdatehistory: string;
    ccroleenddatehistory: string;
    
    clear(): void {
        this.activitynamehistory = '';
        this.activitystartdatehistory = '';
        this.activiryenddatehistory = '';
        this.rolenamehistory = '';
        this.rolestartdatehistory = '';
        this.roleenddatehistory = '';
        this.ccrolenamehistory = '';
        this.ccrolestartdatehistory = '';
        this.ccroleenddatehistory = '';
	}
}
