import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { StringUtilComponent } from '../../string-util.component';

@ Component({
  selector: 'seconds-to-time',
  template: `{{timeString}}`
})
export class SecondsToTimeComponent implements ICellRendererAngularComp {
  public timeString: string;

  constructor() {
    this .timeString = '';
  }

  // called on init
  agInit(params: any): void {
    this .calculateTime(params.value);
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this .calculateTime(params.value);
    return true;
  }

  calculateTime(valueStr: string) {
    this .timeString = StringUtilComponent.secondsToTime(valueStr);
    /*if( typeof valueStr!=='undefined' && valueStr!=='' && valueStr!=='undefined'){
      let sec_num = parseInt(valueStr, 10); // don't forget the second param
      let hours   = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      let seconds = sec_num - (hours * 3600) - (minutes * 60);
      let hoursStr, minutesStr, secondsStr;
      if (hours   < 10) {hoursStr   = '0'+hours;} else hoursStr = hours;
      if (minutes < 10) {minutesStr = '0'+minutes;} else minutesStr = minutes;
      if (seconds < 10) {secondsStr = '0'+seconds;} else secondsStr = seconds;
      sec_num = null; hours = null; minutes = null; seconds = null;
      this .timeString = hoursStr+':'+minutesStr+':'+secondsStr;
    }else{
      this .timeString = '';
    }*/
    // console.log('received: '+valueStr+' ::converted to :'+this .timeString);
  }
}
