import { Component, OnInit } from '@angular/core';

@ Component({
  selector: 'apphelp-string-util',
  template: `
    <p>
      string-util works!
    </p>
  `,
  styles: []
})
export class StringUtilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public static split(valueStr: string, splitLiteral: string) : string[] {
    console.log('received: '+valueStr+' ::split literal :'+splitLiteral);
    if( typeof valueStr!=='undefined' && valueStr!=='' && valueStr!=='undefined'){
      return valueStr.split(splitLiteral);
    }
  }

  public static secondsToTime(valueStr: string) : string {
    let timeString = '00:00:00';
    if( typeof valueStr!=='undefined' && valueStr!=='' && valueStr!=='undefined'){
      let sec_num = parseInt(valueStr, 10); // don't forget the second param
      let hours   = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      let seconds = sec_num - (hours * 3600) - (minutes * 60);
      let hoursStr, minutesStr, secondsStr;
      if (hours   < 10) {hoursStr   = '0'+hours;} else hoursStr = hours;
      if (minutes < 10) {minutesStr = '0'+minutes;} else minutesStr = minutes;
      if (seconds < 10) {secondsStr = '0'+seconds;} else secondsStr = seconds;
      sec_num = null; hours = null; minutes = null; seconds = null;
      timeString = hoursStr+':'+minutesStr+':'+secondsStr;
    }
    return timeString;
  }

  public static dollar(valueStr: string) : string {
    let res = '$0';
    if( typeof valueStr!=='undefined' && valueStr!=='' && valueStr!=='undefined'){
      res = '$' + valueStr;
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static percentage(valueStr: string) : string {
    let res = '0%';
    if( typeof valueStr!=='undefined' && valueStr!=='' && valueStr!=='undefined'){
      res = valueStr + '%';
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static getInt(valueStr: string) : number {
    let res = 0;
    try{
      if( typeof valueStr!=='undefined' && valueStr!=='' && valueStr!=='undefined'){
        res = parseInt(valueStr, 10);
      }
    } catch (e) {
      console.log("Got an error!", e);
      res = 0;
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

}
