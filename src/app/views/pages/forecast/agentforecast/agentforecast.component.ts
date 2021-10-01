import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AgentActivityReportVO } from '../../reports/_models/agent-activity-report-vo.model';
import { AgentActivityRequest } from '../../reports/_models/agentactivityrequest.model';
import { CCActivity, selectActivityById } from '../../../../core/auth';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../core/auth';
import { string } from '@amcharts/amcharts4/core';
import { AgentForecastModel } from '../model/agentforecast.model';

import { SubheaderService } from '../../../../core/_base/layout';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { AgentForeCastRequestModel } from '../model/agentforecastrequest.model';

import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { Failure } from 'fp-ts/lib/Validation';




@Component({
  selector: 'kt-agentforecast',
  templateUrl: './agentforecast.component.html',
  styleUrls: ['./agentforecast.component.scss']
})
export class AgentforecastComponent implements OnInit {
  loadingAfterSubmit: boolean = false;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;


  public forecaseModel: AgentForecastModel;
  ELEMENT_DATA: any[] = [];
  AllIds: any[] = [];
  public agentactivityinputReq: AgentActivityRequest;
  public agentActData: CCActivity[];
  public filterActivityid: CCActivity[];
  public forecastListModel: AgentForecastModel[] = [];
  public forecastInfo: AgentForecastModel[];
  //public foreCaseData$ = new BehaviorSubject<AgentForecastModel[]>(this.forecastInfo);
  public forecastModel: AgentForecastModel;
  public forecastRequest: AgentForeCastRequestModel;
  public ForcastData: String[] = [];
  public agentActData$ = new BehaviorSubject<CCActivity[]>(this.agentActData);

  Dateduration: Array<any> = [];
  DurationCollection: Array<any> = [];
  WCollection: Array<any> = [];
  selectedYearly: string;
  public RoleID: number;

  public CallCenterList: any[] = [];
  public lockForecastList: any[] = [];
  public selctedCallCenter: string;
  selectedDurationCollection: Array<any> = [];
  public defaultYear = moment().startOf('year').format('YYYY');
  currentWeek = moment().isoWeek().toString();
  public aInfo: Array<any> = [];
  ErrorMessage: string;
  rowWeekDisableFlag: boolean = false;
  eintDataflag: boolean = false;
  eintflag: boolean = false;
  UserID: any;
  public icon: string;
  isForecastApprover: string;
  cCenterList: any;
  addFlag: boolean = true;
  deleteFlag: boolean = true;
  viewFlag: boolean = true;
  editFlag: boolean = true;
  forecastApproverFlag: boolean = true;

  constructor(private auth: AuthService, private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService,) {

    this.AllIds = [];
  }

  ngOnInit() {

    let value = localStorage.getItem('Forecast');
    for (let i = 0; i < value.toString().split(',').length; i++) {
      var permissionName = value.toString().split(',')[i].toLowerCase().trim();
      if (permissionName == "add")
        this.addFlag = false;
      else if (permissionName == "edit")
        this.editFlag = false;
      else if (permissionName == "delete")
        this.deleteFlag = false;
      else if (permissionName == "view")
        this.viewFlag = false;
      else if (permissionName == "forecastapprover")
        this.forecastApproverFlag = false;

    }
    
    console.log('ReSkilling Agent Menu Permission:::' + value);

    this.subheaderService.setTitle('Agent ForeCasting');
    this.eintDataflag = true;
    this.AllIds = [];
    this.resetalltxtvalue();
    this.getCallcenter();
    this.getYear();
    this.onChangeDuration();
    this.GetActivityInfo();
    //this.GetAgentForeCast();
    //this.GetlockForeCast();
    if (localStorage.hasOwnProperty('currentUser')) {
      this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
    }
  }

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  //selection = new SelectionModel<any>(true, []);
  public selection: Array<any> = [];


  /** The label for the checkbox on the passed row */
  checkboxLabel(e, chkboxid: string) {
    if (e.target.checked) {
      this.hasFormErrors = false;
      this.selection.push(chkboxid);
    }
    else {
      var index = this.selection.indexOf(chkboxid);
      if (index !== -1) this.selection.splice(index, 1);
    }
    console.log('CheckSelected Values::::' + JSON.stringify(this.selection));
  }

  lockUnLockEvent(e, chkboxid: string, lockstatus: string) {
    try {

      //chkboxid = this.returnlockid(chkboxid);
      console.log('Issue in lockUnLockEvent fucntion:::::' + chkboxid);
      this.rowWeekDisableFlag = true;
      let selectedWeek = chkboxid.match(/\d+/);
      let lstatus: number;
      let _saveMessage: string;
      if (lockstatus == 'lock') {
        lstatus = 1;
        //  selected checkbox removed from selection while lock the week  
        // if (this.selection.length > 0) {
        if (document.getElementById(chkboxid.toString().replace('lock', 'chk')) != null) {
          (document.getElementById(chkboxid.toString().replace('lock', 'chk')) as HTMLInputElement).checked = false;
          var index = this.selection.indexOf(chkboxid.toString().replace('lock', 'chk'));
          if (index !== -1)
            this.selection.splice(index, 1);
        }
        // }
        _saveMessage = 'Week' + selectedWeek + ' locked successfully';
      }
      else {
        lstatus = 0;
        _saveMessage = 'Week' + selectedWeek + ' unlocked successfully';
      }
      this.forecastRequest = {
        year: this.defaultYear, callcenterid: this.selctedCallCenter, week: Number(selectedWeek[0]), lockunlockstatus: lstatus
      }
      this.auth.lockForeCast(this.forecastRequest).subscribe(res => {
        if (res) {
          this.GetAgentForeCast();
          //this.GetlockForeCast();
          const _messageType = chkboxid ? MessageType.Update : null;
          this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
        }
      });
    } catch (ex) {
      console.log('Issue in lockUnLockEvent fucntion:::::' + ex);
    }
    e.stopPropagation();
  }

  GetActivityInfo() {
    this.auth.GetAllMasterActivity().subscribe(activitybarList => {
      console.log('Agent Activity Reports Data Response Came::::' + JSON.stringify(activitybarList));
      this.agentActData = activitybarList;
      this.agentActData$.next(this.agentActData);

      if (this.agentActData.length > 0)
        for (let i = 0; i < this.agentActData.length; i++) {
          if (i == 0) {
            this.displayedColumns.push('Week');
            this.displayedColumns.push('Lock/UnLock');
            this.displayedColumns.push(this.agentActData[i].name);
          }
          else
            this.displayedColumns.push(this.agentActData[i].name);
        }
    });
  }

  GetlockForeCast() {

    //this.selection = [];
    this.forecastRequest = {
      year: this.defaultYear, callcenterid: this.selctedCallCenter.toString(), week: 0, lockunlockstatus: 0
    }
    this.auth.GetAlllockforeCast(this.forecastRequest).subscribe(lockforecastList => {
      this.lockForecastList = [];
      this.lockForecastList = lockforecastList;
      let filterdata: any;
      for (let i = 1; i <= 53; i++) {
        filterdata = this.lockForecastList.find(x => x.weekid.toString() == i.toString());
        if (filterdata != undefined) {
          if (filterdata.weekid > 0) {
            console.log('LockWeek ID- block::::' + 'lockWeek' + i);
            console.log('unlockWeek ID- none::::' + 'unlockWeek' + i);
            if (document.getElementById('lockWeek' + i) != null) {
              (document.getElementById('lockWeek' + i) as HTMLInputElement).style.display = "block";
              //(document.getElementById('lockWeek' + i) as HTMLInputElement).disabled = false;
              //(document.getElementById('lockWeek' + i) as HTMLInputElement).removeAttribute('disabled');
            }

            if (document.getElementById('unlockWeek' + i) != null) {
              (document.getElementById('unlockWeek' + i) as HTMLInputElement).style.display = "none";
              //(document.getElementById('unlockWeek' + i) as HTMLInputElement).disabled = true;
              //(document.getElementById('lockWeek' + i) as HTMLInputElement).removeAttribute('disabled')
            }

            if (document.getElementById('chkWeek' + i) != null)
              (document.getElementById('chkWeek' + i) as HTMLInputElement).disabled = false;
          }
        }
        else {
          console.log('LockWeek ID- none::::' + 'lockWeek' + i);
          console.log('unlockWeek ID- block::::' + 'unlockWeek' + i);
          if (document.getElementById('lockWeek' + i) != null) {
            (document.getElementById('lockWeek' + i) as HTMLInputElement).style.display = "none";
            //(document.getElementById('lockWeek' + i) as HTMLInputElement).disabled = true;
            //(document.getElementById('lockWeek' + i) as HTMLInputElement).removeAttribute('disabled')
          }

          if (document.getElementById('unlockWeek' + i) != null) {
            (document.getElementById('unlockWeek' + i) as HTMLInputElement).style.display = "block";
            //(document.getElementById('unlockWeek' + i) as HTMLInputElement).disabled = false;
            //(document.getElementById('lockWeek' + i) as HTMLInputElement).removeAttribute('disabled')
          }

          if (document.getElementById('chkWeek' + i) != null)
            (document.getElementById('chkWeek' + i) as HTMLInputElement).disabled = true;
        }
        console.log('GetlockForeCast Response info::::' + JSON.stringify(this.lockForecastList));
      }
      this.ischeckForecastApprover();
    });

  }

  ischeckForecastApprover() {
    //Checking the user have valid permission to lock the forcast
    if (localStorage.hasOwnProperty('currentUser'))
      this.isForecastApprover = JSON.parse(localStorage.getItem('currentUser')).forecastapprover;
    if (this.isForecastApprover == "False") {
      //This is for remove the onclick event from the lock/unlock
      for (let i = 1; i <= 53; i++) {
        if (document.getElementById('lockWeek' + i) != null)
          (document.getElementById('lockWeek' + i) as HTMLInputElement).disabled = true;
        //(document.getElementById('lockWeek' + i) as HTMLInputElement).removeAttribute('disabled')
        if (document.getElementById('unlockWeek' + i) != null)
          (document.getElementById('unlockWeek' + i) as HTMLInputElement).disabled = true;
        //(document.getElementById('lockWeek' + i) as HTMLInputElement).removeAttribute('disabled')
      }
    }
  }


  GetAgentForeCast() {
    this.forecastRequest = {
      year: this.defaultYear, callcenterid: this.selctedCallCenter.toString(), week: 0, lockunlockstatus: 0
    }
    this.resetalltxtvalue();
    this.auth.GetAllforeCast(this.forecastRequest).subscribe(forecastList => {
      this.forecastInfo = [];
      this.forecastInfo = forecastList;
      console.log('ForeCast Data Response info::::' + JSON.stringify(this.forecastInfo));
      if (this.forecastInfo.length > 0) {
        if (this.AllIds.length > 0) {
          for (let j = 0; j < this.forecastInfo.length; j++) {
            if (Number(this.forecastInfo[j].forecastvalue) >= 0)
              if (document.getElementById(this.forecastInfo[j].forecastid) != null)
                (document.getElementById(this.forecastInfo[j].forecastid) as HTMLInputElement).value = this.forecastInfo[j].forecastvalue;
          }
        }
      }
      else {
        this.resetalltxtvalue();
      }
    });
    this.GetlockForeCast()
  }
  // resetforecastValue()
  // {
  //   for (let j = 0; j < this.AllIds.length; j++) {
  //     (document.getElementById(this.AllIds[j]) as HTMLInputElement).value = "";
  //   }
  // }

  onsubmit() {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.UserID = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }
    this.loadingAfterSubmit = false;
    this.ForcastData = [];
    this.forecastModel = new AgentForecastModel;
    this.forecastModel.year = this.defaultYear;
    this.forecastModel.callcenterid = this.selctedCallCenter;
    if (this.selection.length > 0) {
      this.hasFormErrors = false;
      for (let k = 0; k < this.selection.length; k++) {
        //GetSeletedWeek
        let selectedWeek = this.defaultYear + '-' + this.selection[k].match(/\d+/);
        let selectedColl: Array<any> = [];
        for (let j = 0; j < this.AllIds.length; j++) {
          let forecastID = this.AllIds[j].split('-')[0] + '-' + this.AllIds[j].split('-')[1];
          if (forecastID == selectedWeek) {
            var forecastValue = (document.getElementById(this.AllIds[j]) as HTMLInputElement).value;
            if (forecastValue != '')
              selectedColl.push(this.AllIds[j] + '-' + forecastValue);
            else
              selectedColl.push(this.AllIds[j] + '-' + 0);

            //Disable all the textbox and border color
            //  (document.getElementById(this.AllIds[j]) as HTMLInputElement).disabled = true;
            // (document.getElementById(this.AllIds[j]) as HTMLInputElement).className = "selectedtext";
          }
        }
        this.ForcastData.push(selectedColl.toString());
      }
      this.forecastModel.forecastData = this.ForcastData.toString();
      this.forecastModel.userid = this.UserID.toString();
      // this.createForeCast(this.forecastModel);
      console.log('Insert Forecast Data::::' + JSON.stringify(this.forecastModel));
      this.loadingAfterSubmit = true;
      this.viewLoading = true;
      this.auth.createForeCast(this.forecastModel).subscribe(data => {
        if (data == 'SUCCESS') {
          const _saveMessage = `Agent ForeCasting Updated Successfully `;
          const _messageType = this.forecastModel.callcenterid ? MessageType.Update : null;
          this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 1000, true, true);
          this.selection = [];
          this.resetchkBox();
          this.viewLoading = false;
          this.GetAgentForeCast();
          this.resetchkBox();
          // this.GetlockForeCast();
        }
      });
    }
    else {
      this.hasFormErrors = true;
      this.ErrorMessage = "Please select the weeks, Which you want to update the agent forecast.";
      return this.ErrorMessage;
    }
  }

  getYear() {
    let arrayList: any[] = [2, 1, 0];
    for (var i = 0; i < arrayList.length; i++) {
      let startDate = moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY-MM-DD');
      let endDate = moment().subtract(arrayList[i], 'years').endOf('year').format('YYYY-MM-DD');
      this.Dateduration.push({ startDate: startDate, endDate: endDate, Duration: moment().subtract(arrayList[i], 'years').startOf('year').format('YYYY') });
    }
    console.log('GetYears::::' + JSON.stringify(this.Dateduration));
    return this.Dateduration;
  }

  // getCallcenter() {
  //   if (localStorage.hasOwnProperty("currentUser")) {
  //     this.selctedCallCenter = JSON.parse(localStorage.getItem('currentUser')).callcenter;
  //     if (this.selctedCallCenter == 'Rabat') {
  //       this.CallCenterList.push({ id: 'RAB', name: 'Rabat' });
  //       this.selctedCallCenter = 'RAB';
  //     }
  //     else if (this.selctedCallCenter == 'Egypt') {
  //       this.CallCenterList.push({ id: 'EGY', name: 'Egypt' });
  //       this.selctedCallCenter = 'EGY';
  //     }
  //     else if (this.selctedCallCenter == 'Tunisia') {
  //       this.CallCenterList.push({ id: 'TUN', name: 'TUN' });
  //       this.selctedCallCenter = 'TUN';
  //     }
  //     else if (this.selctedCallCenter == 'Head Quarters') {
  //       // this.CallCenterList.push({ id: 'ALL', name: 'ALL' });
  //       this.CallCenterList.push({ id: 'RAB', name: 'Rabat' });
  //       this.CallCenterList.push({ id: 'HQ', name: 'HQ' });
  //       this.CallCenterList.push({ id: 'EGY', name: 'Egypt' });
  //       this.selctedCallCenter = 'HQ'
  //       //this.CallCenterList = [, {id: 'TUN',name: 'TUN'}
  //     }

  //   }

  // }

  getCallcenter() {
    if (localStorage.hasOwnProperty("CallCenterCollection")) {
      this.cCenterList = JSON.parse(localStorage.getItem('CallCenterCollection'));
    }
    if (localStorage.hasOwnProperty("currentUser")) {
      this.selctedCallCenter = JSON.parse(localStorage.getItem('currentUser')).callcenter;
      if (this.selctedCallCenter == 'Head Quarters' || this.selctedCallCenter == 'Mannai') {
        this.CallCenterList = this.cCenterList;
        //this.CallCenterList.push({ cc_id: 'ALL', cc_name: 'ALL', description: 'ALL', cc_shortname: 'ALL' });
        this.selctedCallCenter = this.CallCenterList[0].cc_shortname;
      }
      else {
        if (this.cCenterList)
          this.CallCenterList = this.cCenterList.filter(row => row.cc_name == this.selctedCallCenter);

        this.selctedCallCenter = this.CallCenterList[0].cc_shortname;
      }

    }
  }

  onChangeDuration() {
    this.rowWeekDisableFlag = false;
    this.AllIds = [];
    this.DurationCollection = [];
    this.WCollection = [];
    //this.ELEMENT_DATA=[];
    var m = moment(this.defaultYear);
    for (var i = 1; i <= 53; i++) {
      let CurrentDate: any;
      CurrentDate = getDateRangeOfWeek(i, this.defaultYear);
      this.DurationCollection.push({ startDate: CurrentDate[0], endDate: CurrentDate[1], Duration: 'Week' + i + '-' + this.defaultYear });
      this.WCollection.push('Week' + i + '-' + this.defaultYear);
      this.ELEMENT_DATA.push({ WeeksActivity: 'Week ' + i, startDate: CurrentDate[0], endDate: CurrentDate[1], lockunlockstatus: '' })
    }
    this.GetAgentForeCast();
    this.resetchkBox();
    //this.GetlockForeCast();
    return this.DurationCollection;
  }

  resetchkBox() {
    for (var i = 0; i < document.getElementsByTagName('input').length; i++) {

      if (document.getElementsByTagName('input')[i].type == 'checkbox') {
        document.getElementsByTagName('input')[i].checked = false;
      }
    }
  }

  resetalltxtvalue() {
    for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
      if (document.getElementsByTagName('input')[i].type == 'number') {
        document.getElementsByTagName('input')[i].value = "";
        //if (!this.rowWeekDisableFlag)
        //document.getElementsByTagName('input')[i].disabled = true;
        //document.getElementsByTagName('input')[i].className = "Normaltext";
      }
    }
  }

  returnforecastid(id: string): string {
    let activityid = id.split('-');
    this.filterActivityid = this.agentActData.filter(row => row.name === activityid[1])
    let returnvalue: string;
    if (activityid[0].length <= 6) {
      returnvalue = this.defaultYear + '-' + activityid[0].substr(activityid[0].length - 1) + '-' + this.filterActivityid[0].id;
    }
    else {
      returnvalue = this.defaultYear + '-' + activityid[0].substr(activityid[0].length - 2) + '-' + this.filterActivityid[0].id;
    }
    if (!this.AllIds.includes(returnvalue))
      this.AllIds.push(returnvalue);
    let actid = this.agentActData[this.agentActData.length - 1].id;
    if (returnvalue == this.defaultYear + '-53-' + actid && this.eintDataflag) {
      this.GetAgentForeCast();
      //  this.GetlockForeCast();
      this.eintDataflag = false;
    }
    return returnvalue;
  }

  returnchkboxid(id: string): string {
    return 'chk' + id.replace(/\s/g, "");
  }

  returnunlockid(id: string): string {
    let weekid = id.replace(/\s/g, "");
    // if (weekid == 'Week53' && this.eintDataflag) {
    //   this.eintDataflag = false;
    //   this.GetlockForeCast();
    // }
    return 'unlock' + weekid;
  }
  returnlockid(id: string): string {
    let weekid = id.replace(/\s/g, "");
    // if (weekid == 'Week53' && this.eintDataflag) {
    //   this.eintDataflag = false;
    //   this.GetlockForeCast();
    // }
    return 'lock' + weekid;
  }



  /**
   * Close alert
   *
   * @param $event: Event
   */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  // onlyNumberKey(evt) { 


  //   var ASCIICode = (evt.which) ? evt.which : evt.keyCode 
  //   if (ASCIICode== 8 || ASCIICode == 46
  //    || ASCIICode == 37 || ASCIICode == 39) {
  //       return true;
  //   }
  //   else if ( ASCIICode < 48 || ASCIICode > 57 ) {
  //       return false;
  //   }
  //   else return true;
  // }
}

// Returns the ISO week of the date.
function getWeekNumber(dateVal) {
  var date = new Date(dateVal.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.

  // alert(1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7));
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function getDateRangeOfWeek(weekNo, y) {
  var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
  d1 = new Date('' + y + '');
  numOfdaysPastSinceLastMonday = d1.getDay() - 1;
  d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
  d1.setDate(d1.getDate() + (7 * (weekNo - getWeekNumber(d1))));
  // alert(d1.getWeek());
  rangeIsFrom = (d1.getMonth() + 1) + '-' + (d1.getDate() - 1) + '-' + d1.getFullYear();
  d1.setDate(d1.getDate() + 5);
  rangeIsTo = (d1.getMonth() + 1) + '-' + d1.getDate() + '-' + d1.getFullYear();
  // console.log('getDateRangeOfWeek Custom:::' + rangeIsFrom + ' to ' + rangeIsTo);
  //return rangeIsFrom + ' to ' + rangeIsTo;
  return [rangeIsFrom, rangeIsTo];
};


