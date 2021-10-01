import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import {BeinUser} from '../_models/bein-user.model';
import { BeinOrganization } from '../_models/bein-organization.model';
import { GadgetService } from './gadget.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private static baseUrl = environment.baseUrl;
  private static serviceUrl = AdminService.baseUrl + '/api/BeINMaximus/';

  public static userId: number;
  // public static userOrgs: BeinOrganization[];
  public static currentBeinUser: BeinUser;

  private currBeinUser = new BehaviorSubject<BeinUser>(null);
  public currBeinUser$ = this.currBeinUser.asObservable();

  private currBeinUserOrgs = new BehaviorSubject<BeinOrganization[]>(null);
  public currBeinUserOrgs$ = this.currBeinUserOrgs.asObservable();

  public authToken = '';

  constructor(private http: HttpClient) {}

  setUserId(userId: number): void {
    AdminService.userId = userId;

    this.getUser(AdminService.userId).subscribe(beinUser => {
      AdminService.currentBeinUser = beinUser;
      if ( AdminService.currentBeinUser ) {
        this.getUserOrgs( AdminService.userId ).subscribe(userOrgs => {
          // AdminService.userOrgs = userOrgs;
          this.currBeinUserOrgs.next( userOrgs );
        });
      }
      setTimeout( () => {}, 1000);
      this.currBeinUser.next(beinUser);
    });
  }

  getUser(userId: number): Observable<any> {
    return this.http.get<any>(AdminService.serviceUrl + 'getBeINUser/' + userId);
  }

  getUserOrgs(userId: number): Observable<any>  {
    return this.http.get<any>(AdminService.serviceUrl + 'getBeINUserOrgs/' + userId);
  }
}
