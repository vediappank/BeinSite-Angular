// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { currentUser, User, isUserLoaded, getLoggedInUser, AuthService } from '../../../../../core/auth';
import { ActivatedRoute, Router } from '@angular/router';

import * as Reducers from '../../../../../core/auth/_reducers';



@Component({
  selector: 'kt-user-profile2',
  templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
  // Public properties
  user$: Observable<User>;
  luser: User;

  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;

  public userlist: User;
  public fullname: string;
  public Username: string;
  public profileImg: any;
  /**
   * Component constructor
   *
   * @param store: Store<AppState>
   */
  constructor(private store: Store<Reducers.State>, private router: Router,private auth: AuthService ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    // this.store.select( Reducers.isUserLoggedIn ).subscribe( res  => {
    //   console.log('User Profile 2 isUserLoggedIn: ' + JSON.stringify(res) );
    // });

    this.store.select( Reducers.selectUser )
      .subscribe( res  => {
        console.log('User Profile 2 Component:getAuthState::: before ' + JSON.stringify(res) );
        if(res != null)
        {
        this.luser = res;
        this.profileImg = this.luser.profile_img;
        console.log('User Profile 2 Component:getAuthState::: after' + JSON.stringify(res));
      }
    });

    // this.store
    //   .select( isUserLoaded )
    //   .subscribe( res  => {
    //     console.log('User Profile 2 Component:loggedInUser::: ' + JSON.stringify(res) );
    //     // console.log('User Profile 2 Component:loggedInUser::USER::: ' + JSON.stringify(this.luser) );
    // });

    // if (localStorage.hasOwnProperty('currentUser')) {
    //  console.log('User Profile 2 localStorage :currentUser::: ' + JSON.stringify(localStorage.getItem('currentUser')) );
    // }

    /*this.user$ = this.store.pipe(select(currentUser));
    this.user$.subscribe(res => {
      console.log('User Profile 2 PIPE: ' + JSON.stringify(res) );
      if (! res ) {
        return;
      }
      // 
      this.userlist = res;
      this.fullname = res[0].fullname;
      this.Username = res[0].username;
      if (localStorage.hasOwnProperty('currentUser')) {
        this.profileImg = JSON.parse(localStorage.getItem('currentUser')).profile_img;
      }
      // alert(JSON.stringify(res));
      // alert(JSON.stringify(this.profile_img));

    });*/
  }

  pageredirect() {
    this.router.navigateByUrl('/userprofile');
  }

  /**
   * Log out
   */
  logout() {
    //this.store.dispatch(AuthActions.logout());
    this.auth.setLogin(false);
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
    
  }
}
