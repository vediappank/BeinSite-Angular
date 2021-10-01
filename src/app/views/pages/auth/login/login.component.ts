// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap, catchError } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';

import { privilege } from '../../../../core/auth/_models/privilege.model';
import { AuthActions } from '../../../../core/auth/_actions';
import { State } from '../../../../core/auth/_reducers/auth.reducers';

import { AdminService } from '../../flashreports/_services/admin.service';

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
  /*EMAIL: 'admin@demo.com',
  PASSWORD: 'demo'*/
  USERNAME: '',
  PASSWORD: ''
};

@Component({
  selector: 'kt-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];
  menuCollection: Array<any> = [];
  privilegeCollection: Array<privilege> = [];
  private unsubscribe: Subject<any>;


  //
  dashbaordModuleCollection: Array<any> = [];
  dashbaordassignedModuleCollection: Array<any> = [];

  private returnUrl: any;
  RoleID: any;
  userId: any;

  // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param router: Router
   * @param auth: AuthService
   * @param authNoticeService: AuthNoticeService
   * @param translate: TranslateService
   * @param store: Store<AppState>
   * @param fb: FormBuilder
   * @param cdr: ChangeDetectorRef
   * @param route: ActivatedRoute
   */
  constructor(
    private router: Router,
    private auth: AuthService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private store: Store<State>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, private adminService: AdminService
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.initLoginForm();

    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe(params => {
      // alert('login comp');
      this.returnUrl = params['returnUrl'] || '/';
      // alert(this.returnUrl);

    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Form initalization
   * Default params, validators
   */
  initLoginForm() {
    // demo message to show
    if (!this.authNoticeService.onNoticeChanged$.getValue()) {
      const initialNotice = `Use account
            <strong>${DEMO_PARAMS.USERNAME}</strong> and password
            <strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
      this.authNoticeService.setNotice(initialNotice, 'info');
    }

    this.loginForm = this.fb.group({
      username: [DEMO_PARAMS.USERNAME, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
      password: [DEMO_PARAMS.PASSWORD, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ]
    });
  }

  /**
   * Form Submit
   */
  submit() {
    const controls = this.loginForm.controls;
    /** check form */
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    const authData = {
      usename: controls['username'].value,
      password: controls['password'].value
    };

    this.auth
      .login(authData.usename, authData.password)
      .pipe(
        tap(user => { }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(

        user => {

          if (user) {

            this.auth.setLogin(true);
            console.log('set Login::::' + JSON.stringify(true));
            console.log('get Login::::' + JSON.stringify(this.auth.getLogin()));
            const timeToLogin = Date.now() + 3600000; // 30 min
            localStorage.removeItem('currentUser');
            console.log('login userdetails::::' + JSON.stringify(user));
            localStorage.setItem('currentUser', JSON.stringify({
              fullName: user.username, agentid: user.id,
              token: user.access_token, email: user.email, expires_in: user.expires_in,
              TokenType: user.token_type, time_to_login: timeToLogin, role_id: user.roleid,
              refreshToken: user.refreshToken, profile_img: user.profile_img,
              teammeetingapprover: user.teammeetingapprover,
              onetoonemeetingapprover: user.onetoonemeetingapprover,
              trainingmeetingapprover: user.trainingmeetingapprover,
              actiontrackerapprover: user.actiontrackerapprover,
              forecastapprover: user.forecastapprover, callcenter: user.cc_name,
              orgid: user.orgid,
              cc_role_name: user.cc_role_name,
              login_fail_attempts: user.login_fail_attempts,
              beinsight_access_flag: user.beinsight_access_flag,
              firstname: user.firstname, lastname: user.lastname
            }));

            if (localStorage.hasOwnProperty('currentUser')) {
              console.log('Login Component localStorage :currentUser::: ' + JSON.stringify(localStorage.getItem('currentUser')));
            }

            this.store.dispatch(AuthActions.login({ authToken: user.access_token }));
            if (user) {
              localStorage.setItem('userLoggedIn', JSON.stringify(user));
              this.store.dispatch(AuthActions.userLoaded({ user: user }));
            }
            //   this.auth.GetAllMainMenu(user.roleid).subscribe((_mainMenus: any) => {                   
            //     this.menuCollection = _mainMenus;
            //     for (let i = 0; i < this.menuCollection.length; i++) {
            //       if (i > 0) {
            //         for (let k = 0; k < this.menuCollection[i].submenu.length; k++) {
            //           localStorage.setItem(this.menuCollection[i].submenu[k].title, this.menuCollection[i].submenu[k].map_privilegename);
            //         }
            //       } else {
            //         localStorage.setItem(this.menuCollection[i].title, this.menuCollection[i].map_privilegename);
            //       }
            //     }
            //     console.log('Login Successfull.. Navigating to :::' + this.returnUrl);

            //     if(user.beinsight_access_flag == "Change Password")
            //     {
            //       this.router.navigate(['/auth/changepassword'], { queryParamsHandling: 'merge' });
            //     }
            //     else
            //     {
            //       this.router.navigateByUrl(this.returnUrl);
            //     }
            //   });
            // } else {

            //   this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
            // }

            this.auth.GetAllMainMenu().subscribe((_mainMenus: any) => {
              this.menuCollection = _mainMenus;
              for (let i = 0; i < this.menuCollection.length; i++) {
                if (i > 0) {
                  for (let k = 0; k < this.menuCollection[i].submenu.length; k++) {
                    localStorage.setItem(this.menuCollection[i].submenu[k].title, this.menuCollection[i].submenu[k].map_privilegename);
                  }
                } else {
                  localStorage.setItem(this.menuCollection[i].title, this.menuCollection[i].map_privilegename);
                }
              }
              console.log('Login Successfull.. Navigating to :::' + this.returnUrl);

              if (user.beinsight_access_flag == "Change Password") {
                this.router.navigate(['/auth/changepassword'], { queryParamsHandling: 'merge' });
              }
              else {
                this.router.navigateByUrl(this.returnUrl);
              }
            });
          }
          else {
            this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
          }


          if (localStorage.hasOwnProperty("currentUser")) {
            this.RoleID = JSON.parse(localStorage.getItem('currentUser')).role_id;
          }
          this.auth.GetAllDashboardModules(this.RoleID).subscribe((_dashboardmodule: any[]) => {
            console.log('getAllDashboardModules collection:: Response::' + JSON.stringify(_dashboardmodule));
            this.dashbaordModuleCollection = _dashboardmodule;
            localStorage.setItem('modulePermission', JSON.stringify(this.dashbaordModuleCollection));
          });
          this.auth.GetAllCallCenters().subscribe((_callcenter: any[]) => {
            localStorage.setItem('CallCenterCollection', JSON.stringify(_callcenter));
          });
          if (localStorage.hasOwnProperty("currentUser")) {
            this.userId = JSON.parse(localStorage.getItem('currentUser')).agentid;
          }

          this.adminService.setUserId(this.userId);
        },
        err => {
          //let errorPayload = JSON.parse(err.message);
          var ErrorInfo = err.error.error_description.split(',');
          console.log(ErrorInfo);
          var retriescount = 0;
          var profileStatus = "";
          if (ErrorInfo.length > 1) {
            retriescount = Number(ErrorInfo[0]);
            profileStatus = ErrorInfo[1];
          }
          if (profileStatus == "Disable") {
            this.authNoticeService.setNotice("Your Account Disabled, Please contact administrator", 'danger');
          }
          if (profileStatus == "Disable" && retriescount > 5) {
            this.authNoticeService.setNotice("Your Account Disabled, Please contact administrator", 'danger');
          }
          else {
            this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
          }
        }
      );
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
