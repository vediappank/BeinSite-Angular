// Angular
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { Store } from '@ngrx/store';
import { State } from '../../../../core/auth/_reducers/auth.reducers';
import { AuthActions } from '../../../../core/auth/_actions';
/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {

  constructor(private router: Router, private auth: AuthService,  private store: Store<State>) {}

  // intercept request and add token
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // tslint:disable-next-line:no-debugger
    // modify request
    //  request = request.clone({
    // 	setHeaders: {
    // 		Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    // 	}
    // });
    // console.log('----request----');
    // console.log(request);
    // console.log('--- end of request---');

    return next.handle(request).pipe(
      tap(
        event => {
        
          if (event instanceof HttpResponse) {
            // console.log('all looks good');
            // http response status code
          
            // console.log(event.status);
            if ( event.status === 204) {               
              this.router.navigate(['/home/errorpage'], { queryParamsHandling: 'merge' });
            }
            else  if ( event.status === 203) {
              this.router.navigate(['/home/errorpage'], { queryParamsHandling: 'merge' });
            }
          }
        },
        error => {
          debugger;
          // http response status code
          console.log('----response----');
          console.error('status code:');
         // tslint:disable-next-line:no-debugger
          console.error(error.status);
          console.error(error.message);
          console.log('--- end of response---');
          if ( error.status === 401 && error.message === 'Authorization has been denied for this request.' ) {
            this.refreshToken();
          }
          else if ( error.status === 401 || error.status === '401' ) {
            this.router.navigate(['/auth/login'], { queryParamsHandling: 'merge' });
          }
         
        }
      )
    );
  }
  refreshToken()
  {
    let currentUser = JSON.parse(localStorage.getItem('userLoggedIn'));
    this.auth
    .refresh_token(currentUser.refresh_token).subscribe(
      user => {
        if (user) {
          this.auth.setLogin(true);
          console.log('set Login::::' + JSON.stringify(true));
          console.log('get Login::::' + JSON.stringify( this.auth.getLogin()));
          const timeToLogin = Date.now() + 3600000; // 30 min
          localStorage.removeItem('currentUser');
          console.log('login userdetails::::' + JSON.stringify(user));
          localStorage.setItem('currentUser', JSON.stringify({
            fullName: user.username, agentid: user.id,
            token: user.access_token, email: user.email, expires_in: user.expires_in,
            TokenType: user.token_type, time_to_login: timeToLogin, role_id: user.roleid,
            refreshToken: user.refreshToken, profile_img: user.profile_img, 
             teammeetingapprover : user.teammeetingapprover,
             onetoonemeetingapprover : user.onetoonemeetingapprover,
             trainingmeetingapprover: user.trainingmeetingapprover,
             actiontrackerapprover: user.actiontrackerapprover,
             forecastapprover: user.forecastapprover, callcenter: user.cc_name, 
             orgid : user.orgid, 
             cc_role_name : user.cc_role_name,
             login_fail_attempts : user.login_fail_attempts,
             beinsight_access_flag : user.beinsight_access_flag,
             firstname:user.firstname,lastname:user.lastname
          }));
          
          if (localStorage.hasOwnProperty('currentUser')) {
            console.log('Login Component localStorage :currentUser::: ' + JSON.stringify(localStorage.getItem('currentUser')));
          }
          this.store.dispatch(AuthActions.login({ authToken: user.access_token })); 
        }
      });
    } 
}
