import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';
import { string } from '@amcharts/amcharts4/core';

export class User extends BaseModel {
    id: number;
    username: string;
    password: string;
    email: string;
    expires_in: string;
    access_token: string;
    token_type: string;
    refreshToken: string;
   
    useractivityid: number[];
    usersupervisorid: number[];

    // userroleid: number[];
    // userccroleid: number[];
    // Callcenterid: number[];

    userroleid: number;
    userccroleid: number;
    Callcenterid: number;

    userorganizationid: number[];
    roleid: number;
    ccroleid: number;
    fullname: string;
    firstname: string;
    lastname: string;
    callcenterid: number;
    callcenter: string;
    activityid: number;
    useractivitystartdate: string;
    useractivityenddate: string;
    userrolestartdate: string;
    userroleenddate: string;
    supervisorid: number;
    userccrolename: string;
    userorganizationname: string;
    orgid: number;
    profile_img: string;
    usertype: string;
    cc_name: string;
    cc_role_name: string;
    SelectedFDGroups: string[];
    selected_fd_groups: string;
    usersupervisorname: string;
    teammeetingapprover: boolean;
    onetoonemeetingapprover: boolean;
    trainingmeetingapprover: boolean;
    forecastapprover: boolean;
    actiontrackerapprover: boolean;
    login_fail_attempts:number;
    beinsight_access_flag: string;
    active_flag : string;
    userrolename : string;
    clear(): void {
        this.id = undefined;
        this.username = '';
        this.password = '';
        this.email = '';
        this.userroleid = undefined;
        this.fullname = '';
        this.firstname = '';
        this.lastname = '';
        this.callcenter = '';
        this.usersupervisorid = [];
        this.userorganizationid = [];
        this.supervisorid = undefined;
        this.refreshToken = 'access-token-' + Math.random();
        this.useractivityid = [];
        this.activityid = undefined;
        this.useractivitystartdate = '';
        this.useractivityenddate = '';
        this.userroleenddate = '';
        this.userrolestartdate = '';
        this.profile_img = '';
        this.teammeetingapprover = false;
        this.onetoonemeetingapprover = false;
        this.trainingmeetingapprover = false;
        this.actiontrackerapprover = false;
        this.forecastapprover = false;
        this.cc_name = '';
        this.SelectedFDGroups = undefined;
        this.selected_fd_groups = '';
        this.usersupervisorname = '';
        this.usertype = '';
        this.cc_role_name = '';
        this.login_fail_attempts=undefined;
        this.beinsight_access_flag ='';
        this.active_flag = '';
        this.userrolename = '';
        
    }
}





