import { Component, OnInit, ElementRef } from '@angular/core';
import { UploadVoucherModel } from '../.../../../../../core/auth/_models/voucher/uploadvoucher.model';
import { AuthService } from '../../../../core/auth';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'kt-uploadvouchers',
  templateUrl: './uploadvouchers.component.html',
  styleUrls: ['./uploadvouchers.component.scss']
})
export class UploadvouchersComponent implements OnInit {
  public voucherinputRequest= new UploadVoucherModel();
  @ViewChild('myfile', { static: false }) myfile: ElementRef;
  fileName: string;
  csvFile: FormData;
  public headersArray = [];
  agentid: any;
  displayProgressSpinner: boolean;

  ngOnInit() {
    
  }
  constructor(public voucherService: AuthService,private layoutUtilsService: LayoutUtilsService) {  

  }

  uploadSubmit(files: FileList) {
    this.displayProgressSpinner = true; 
    if (localStorage.hasOwnProperty("currentUser")) {
      this.agentid = JSON.parse(localStorage.getItem('currentUser')).agentid;
    }

    try
    {
    this.voucherinputRequest.agentid = this.agentid.toString();
    }
    catch(e){
    console.error(e);
    }
    this.csvFile.append("voucherUploadDetails", JSON.stringify(this.voucherinputRequest));
    const _messageType =MessageType.Create;
    console.log('voucherUploadDetails::::' + JSON.stringify(this.voucherinputRequest));
    this.voucherService.submitVocher(this.csvFile).subscribe((_mappingresult: any) => {
      let message;
      if (_mappingresult) {
        this.displayProgressSpinner = false;
        if (_mappingresult.split('-')[0].toString() == 'SUCCESS')
          message = "Voucher uploaded successfully";        
        else
          message = _mappingresult;        
        this.layoutUtilsService.showActionNotification(message, _messageType, 10000, true, true);
        this.Clear();
      }
      else {
        message = _mappingresult;        
        this.layoutUtilsService.showActionNotification(message, _messageType, 10000, true, true);
        return;
      }
    });
  }
  
  Clear() {    
    this.myfile.nativeElement.value = null;
    this.csvFile = undefined;
  }

  changeListener(files: FileList) {
   
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

}
