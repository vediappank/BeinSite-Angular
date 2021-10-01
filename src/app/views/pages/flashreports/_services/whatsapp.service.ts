import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@ Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private  baseUrls = environment.baseUrl;
  private static baseUrl = environment.baseChartServiceUrl;
  // private static serviceUrl = WhatsappService.baseUrl + '/Services/WhatsappService.svc/';

  constructor(private http: HttpClient) {}

  getWhatsappInfo(dateStr: string): Observable< any > {
    if( ! dateStr || dateStr === '' ) {
      dateStr = Date.now().toLocaleString();
      dateStr = this .dateAsYYYYMMDDHHNNSS(new Date());
    }
    return this .http.get< any >(this.baseUrls+ '/api/FlashReports/getWAInfo?dateStr=' + dateStr);
  }

  dateAsYYYYMMDDHHNNSS(date): string {
    return date.getFullYear()
              + '-' + this .leftpad(date.getMonth() + 1, 2)
              + '-' + this .leftpad(date.getDate(), 2);
  }

  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }
}
