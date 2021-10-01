// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// RxJS
import { Observable, Observer } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import * as Reducers from '../../../core/auth/_reducers';
import { AuthActions } from '../../../core/auth/_actions';
import { User } from '../_models/user.model';
import { AuthService } from '../_services';
import { JsonPipe } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<Reducers.State>, private router: Router, private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {

    // return new Observable((observer: Observer< boolean >) => {
    //   console.log('Auth Guard LocalStorage:: IsLoggedIn:: ' + JSON.stringify(localStorage.getItem('currentUser')) );
    //   if (localStorage.getItem('currentUser')) {
    //     observer.next(true);
    //   } else {
    //     this.router.navigate(['/auth/login'], { queryParams: route.queryParams, queryParamsHandling: 'merge' });
    //     observer.next(false);
    //   }
    //   observer.complete();
    // });

    // this.store.select( Reducers.isUserLoggedIn ).subscribe( res  => {
    //   console.log('AuthGuard isUserLoggedIn: ' + JSON.stringify(res) );
    // });
  let checkloggedin:boolean;
  checkloggedin = this.auth.getLogin();
  console.log('Checked Loggedin::::' + JSON.stringify(checkloggedin));
    return this.store
      .pipe(
        select( Reducers.isUserLoggedIn ),
        tap(checkloggedin => {          
          console.log('Auth Guard:: IsLoggedIn:: ' + checkloggedin);
          //if (!loggedIn) {
            if(checkloggedin == false){
            this.router.navigate(['/auth/login'], { queryParams: route.queryParams, queryParamsHandling: 'merge' });
          }
        })
      );
  }

    /*
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userLoggedIn = this.store.pipe(select(isLoggedIn), tap(loggedIn => { }));
    console.log('Auth Guard:: IsLoggedIn:: ' + userLoggedIn);
    if (userLoggedIn) {
      return true;
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
     */
}
