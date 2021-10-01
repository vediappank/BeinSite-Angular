import { Component, OnInit, ElementRef } from '@angular/core';
import { VERSION, MatTabGroup } from '@angular/material';
import { AuthService, AuthCampaignService } from '../../../../core/auth';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { FileSelectDirective, FileDropDirective, FileUploadModule, FileUploader } from 'ng2-file-upload';
import { Observable, of, Subscription } from 'rxjs';
import { CampaignModel } from '../.../../../../../core/auth/_models/campaign/campaign.model';
import { CampaignContactModel } from '../.../../../../../core/auth/_models/campaign/campaigncontact.model';
import { CampaignRequestModel } from '../.../../../../../core/auth/_models/campaign/campaignrequest.model';
import { ViewChild } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormControl } from '@angular/forms';
// Services
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
@Component({
  selector: 'kt-campaignupload',
  templateUrl: './campaignupload.component.html',
  styleUrls: ['./campaignupload.component.scss']
})
export class CampaignuploadComponent implements OnInit {
  // @ViewChild('tabs',{static: false}) tabGroup: MatTabGroup;
  public campaigninputRequest: CampaignRequestModel;
  campaignCollection: Array<CampaignModel> = [];
  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });
  public Description: string;
  @ViewChild('myfile', { static: false }) myfile: ElementRef;
  selctedCampaign: string;
  ExcelBulkContacts: CampaignContactModel[] = [];
  public isExpiryDate: Boolean = true;
  public isPostAuto: Boolean = false;
  public isUploadRemove: string = 'upload';
  public isRemoveSalesCallbacks: boolean = true;
  isRemoveContacts: boolean = false;
  isDefaultDate: string;
  AutoPost: string;
  fileName: string;
  agentid: any;
  public conditions: string = '';
  public viewFlag: Boolean = true;
  public addFlag: Boolean = true;
  public editFlag: Boolean = true;
  public deleteFlag: Boolean = true;
  addcommentFlag: Boolean = true;
  isShowUploadRemoveRadio: boolean = false;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  displayProgressSpinner: boolean;
  selectedFilter: string = '';
  csvFile: FormData;

  public headersArray = [];

  constructor(private fb: FormBuilder, public authcampaign: AuthCampaignService, private activatedRoute: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Roles'));

  }



  OnChange(event) {
    if (event.checked)
      this.isExpiryDate = true;
    else
      this.isExpiryDate = false;
  }

  OnPostAutoChange(event) {
    if (event.checked)
      this.isPostAuto = true;
    else
      this.isPostAuto = false;
  }
  OnRemovalContact(event) {
    if (event.checked)
      this.isRemoveSalesCallbacks = true;
    else
      this.isRemoveSalesCallbacks = false;
  }

  /*Converting CSV file to Array*/

  // changeListener(files: FileList) {
  //   let csv: string;
  //   console.log(files);
  //   if (files && files.length > 0) {
  //     let file: File = files.item(0);
  //     console.log(file.name);
  //     this.fileName = file.name;
  //     console.log(file.size);
  //     console.log(file.type);

  //     if (file.name.endsWith('.csv')) {
  //       let reader: FileReader = new FileReader();
  //       reader.readAsText(file);
  //       reader.onload = (e) => {
  //         csv = reader.result as string;

  //         if (csv != undefined) {
  //           var lines = csv.split("\n");
  //           this.ExcelBulkContacts = [];
  //           while (typeof lines[0] !== "undefined" && lines[0] != "") {
  //             var line = lines.shift();
  //             var split = line.split(',')
  //             this.ExcelBulkContacts.push({ AccountNumber: split[0], FirstName: split[1], LastName: split[2], Phone01: split[3] })
  //           }
  //         }
  //         console.log('this.ExcelBulkContacts:::' + JSON.stringify(this.ExcelBulkContacts))
  //       }
  //     }
  //     else {
  //       alert('Please enter the valid Campaign file');
  //       return;
  //     }
  //   }
  // }
  changeListener(files: FileList) {
    debugger;
    let csv: string;
    console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      console.log(file.name);
      this.fileName = file.name;
      console.log(file.size);
      console.log(file.type);

      // if (file.name.endsWith('.csv')) {
      this.csvFile = new FormData();
      this.csvFile.append('file', file, file.name);


      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        csv = reader.result as string;

        if (csv != undefined) {
          let headers = csv.split('\n');
          this.headersArray = headers[0].toLowerCase().split(',');
        }
      }
      //  }
    }
  }

  getAllCampaign() {
    this.authcampaign.getAllCampaign().subscribe((_campaign: CampaignModel[]) => {
      console.log('getAllCampaign collection:: Response::' + JSON.stringify(_campaign));
      this.campaignCollection = _campaign;
    });
  }
  fileFilterValidation(selectedValue) {
   
    if (selectedValue != undefined && selectedValue.toLowerCase() == 'smartcardno') {
      var ACC = this.headersArray.filter(element => element.trim() == 'accountnumber');
      if (ACC.length > 0)
        return;
      else
        alert('Smart card number not found, Please select valid file');
    }
    else if (selectedValue != undefined && selectedValue.toLowerCase() == 'phone') {
      var phone = this.headersArray.filter(element => element.trim() == 'phone01');
      if (phone.length > 0)
        return;
      else
        alert('Phone number not found, Please select valid file');
    }
  }
  uploadSubmit(files: FileList) {
    

    this.addFlag = true;
    let removeContacts: string;
    let removeSCBContacts: string;
    // this.displayProgressSpinner = true;
    if (localStorage.hasOwnProperty("currentUser")) {
      this.agentid = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }


    if (this.isPostAuto == true)
      this.AutoPost = 'AUTO_POST';
    else
      this.AutoPost = 'MANUAL_POST';

    if (this.isUploadRemove == 'remove') {
      this.isExpiryDate = false;
      this.isDefaultDate = '0';
      this.isRemoveContacts = true;
      removeContacts = 'True';
      if (this.isRemoveSalesCallbacks == true) {
        removeSCBContacts = "True";
        this.AutoPost = 'Remove_Contacts~Remove_SalesCallback_Contacts'
      }
      else {
        removeSCBContacts = "False";
        this.AutoPost = 'Remove_Contacts';
      }
      this.conditions = this.AutoPost;
    }
    else {
      this.isRemoveContacts = false;
      removeContacts = 'False';
      this.conditions = 'CHECK_SC_EXPIRTY_DATE~LT~' + this.isDefaultDate + ',' + this.AutoPost;
    }
    this.campaigninputRequest.CampaignID = this.selctedCampaign;
    this.campaigninputRequest.ExpiryDay = this.isDefaultDate;
    this.campaigninputRequest.FileName = this.fileName;
    this.campaigninputRequest.UserID = this.agentid;
    this.campaigninputRequest.JobDesc = this.Description;
    this.campaigninputRequest.JobConditions = this.conditions;
    this.campaigninputRequest.isRemoveContacts = this.isRemoveContacts;
    this.campaigninputRequest.RemoveBy = this.selectedFilter;
    this.campaigninputRequest.isRemoveSalesCallbacks = this.isRemoveSalesCallbacks;

    // this.csvFile.append("CampaignID", this.selctedCampaign);
    // this.csvFile.append("ExpiryDay", this.isDefaultDate);
    // this.csvFile.append("FileName", this.fileName);
    // this.csvFile.append("UserID", this.agentid);
    // this.csvFile.append("JobDesc", this.Description);
    // this.csvFile.append("JobConditions", this.conditions);
    // this.csvFile.append("isRemoveContacts", removeContacts);
    // this.csvFile.append("RemoveBy", this.selectedFilter);
    // this.csvFile.append("isRemoveSalesCallbacks", removeSCBContacts);

    this.csvFile.append("campaignDetails", JSON.stringify(this.campaigninputRequest));

    const _messageType = this.selctedCampaign ? MessageType.Update : MessageType.Create;

    console.log('campaigninputRequest::::' + JSON.stringify(this.campaigninputRequest));
    this.authcampaign.submitCampign(this.csvFile).subscribe((_mappingresult: any) => {
      let message;
      if (_mappingresult) {

        if (_mappingresult.split('-')[0].toString() == 'uploaded')
          message = "Contacts uploaded successfully, Job Id - " + _mappingresult.split('-')[1].toString();
        else if (_mappingresult.split('-')[0].toString() == 'removed')
          message = "Contacts removed successfully";
        else
          message = _mappingresult;
        // this.layoutUtilsService.showActionNotification("Successfully Uploaded the Campaign: " + _mappingresult, _messageType, 10000, true, true);
        this.layoutUtilsService.showActionNotification(message, _messageType, 10000, true, true);
        this.Clear();
      }
      else {
        message = _mappingresult;
        this.addFlag = false;
        this.layoutUtilsService.showActionNotification(message, _messageType, 10000, true, true);
        return;
      }
      alert(message);
      // this.displayProgressSpinner = false;
      console.log('submitCampign List::::' + JSON.stringify(_mappingresult))
      this.addFlag = false;
    });
  }


  Clear() {
    this.myfile.nativeElement.value = null;
    this.Description = '';
    this.selctedCampaign = undefined;
    this.ExcelBulkContacts = [];
    this.fileName = '';
    this.conditions = '';
    this.isPostAuto = false;
    this.isUploadRemove = 'upload';
    this.isRemoveContacts = false;
    this.csvFile = undefined;
    this.selectedFilter = '';

  }

  // uploadFile(data: FormData): string {

  //  return this.http.post('http://localhost:8080/upload', data);
  // }

  ngOnInit() {
    this.isDefaultDate = "60";
    this.isExpiryDate = true;
    this.getAllCampaign();
    this.campaigninputRequest = new CampaignRequestModel();
    if (localStorage.hasOwnProperty('Campaign Contact Upload')) {
      let value = localStorage.getItem('Campaign Contact Upload');
      for (let i = 0; i < value.toString().split(',').length; i++) {
        var permissionName = value.toString().split(',')[i].toLowerCase();
        if (permissionName.toLowerCase() == "upload contacts")
          this.addFlag = false;
        else if (permissionName.toLowerCase() == "remove contacts")
          this.deleteFlag = false;
        else if (permissionName.toLowerCase() == "view")
          this.viewFlag = false;
      }

      if (this.addFlag == false && this.deleteFlag == false) {
        this.isShowUploadRemoveRadio = true;
      }

      if (this.addFlag == true && this.deleteFlag == false) {
        this.isShowUploadRemoveRadio = false;
        this.isUploadRemove = 'remove'
      }

      if (this.addFlag == false && this.deleteFlag == true) {
        this.isShowUploadRemoveRadio = false;
        this.isUploadRemove = 'upload'
      }


      console.log('Campaign Contact Upload Menu Permission:::' + value);
    }

    // this.uploadForm = this.fb.group({
    //   document: [null, null],
    //   type:  [null, Validators.compose([Validators.required])]
    // });
  }

}
