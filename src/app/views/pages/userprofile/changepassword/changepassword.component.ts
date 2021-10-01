import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { PasswordValidator } from './passwordvalidator';
import { AuthService } from '../../../../core/auth';
import { User } from '../../../../core/auth/_models/user.model';
import { ChangePasswordModel } from '../_model/changepasswordrequest.model';

import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { denodeify } from 'q';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],

})
export class ChangepasswordComponent implements OnInit {

  hasFormErrors: boolean = false;
  hasFormSuccess: boolean = false;
  ErrorMessage: string;
  SuccessMessage: string;
  form: FormGroup;
  public current: AbstractControl;
  public newPW: AbstractControl;
  public confirm: AbstractControl;
  submitted = false;
  public userCollection: User;
  public userid: number;
  public firstname: string;
  public lastname: string;
  public email: string;
  public callcenter: string;
  public userccrolename: string;
  public changePasswordRequest: ChangePasswordModel;
  public profile_img: any;

  /**
     * Component constructor
     *	 * @param activatedRoute: ActivatedRoute
     * @param router: Router
     * @param userFB: FormBuilder
     * @param userAcivityFB: FormBuilder
     * * @param userRoleFB: FormBuilder
     * @param subheaderService: SubheaderService
     * @param layoutUtilsService: LayoutUtilsService
     * @param store: Store<AppState>
     * @param layoutConfigService: LayoutConfigService
     */
  constructor(private fb: FormBuilder, public auth: AuthService, private layoutUtilsService: LayoutConfigService, private router: Router) {

    this.form = this.fb.group({
      currentpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.getUserInformation();
  }

  get oldPwd() {
    return this.form.get('currentpassword');
  }

  get newPwd() {
    return this.form.get('newpassword');
  }

  get confirmPwd() {
    return this.form.get('confirmPassword');
  }

  /**
     * Save data
     *
     * @param withBack: boolean
     */
  onSumbit(withBack: boolean = false) {
    //alert('submitted called');
    this.submitted = true;
    // stop here if form is invalid
    if (!this.form.invalid) {
      let eMsg = this.CheckPassword(this.form.controls['newpassword'].value, this.form.controls['confirmPassword'].value);
      if (eMsg) {
        if (localStorage.hasOwnProperty("currentUser")) {
          this.userid = JSON.parse(localStorage.getItem('currentUser')).agentid;
          this
          this.auth.getUserById(Number(this.userid)).subscribe((_userlist: User) => {
            this.userCollection = _userlist;
            if (this.userCollection) {
              this.profile_img = this.userCollection[0].profile_img;
            }
          });
          this.changePasswordRequest = {
            old_password: this.form.controls['currentpassword'].value,
            new_password: this.form.controls['newpassword'].value,
            confirm_password: this.form.controls['confirmPassword'].value,
            agent_id: this.userid
          }
          console.log('change password data:::' + JSON.stringify(this.changePasswordRequest));
          let response:any;
          this.auth.GetChangePassword(this.changePasswordRequest).subscribe((_userlist: any) => {
            this.hasFormErrors = false;
            this.hasFormSuccess = true;
            //alert(_userlist);
            
            if(_userlist == 'FAILURE')
            {
              this.hasFormErrors = true;
              alert("Please check your old password");
              return false;
            }
            else
            {
              this.hasFormErrors = false;
            alert('Successfully changed your password.');
            this.router.navigate(['/auth/login'], { queryParamsHandling: 'merge' });
            }
            // const message = `New user successfully has been added.`;
            //this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
          });
        }
      }
      return;
    }

    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value))

  }
  getUserInformation() {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userid = JSON.parse(localStorage.getItem('currentUser')).agentid;
      this.auth.getUserById(Number(this.userid)).subscribe((_userlist: User) => {
        this.userCollection = _userlist;
        if (this.userCollection) {
          this.profile_img = this.userCollection[0].profile_img;
        }
      });
    }
  }

  CheckPassword(newpassword, confirmpassword) {
    this.hasFormErrors = false;
    this.hasFormSuccess = false;

    if (newpassword != confirmpassword) {
      this.hasFormErrors = true;
      this.ErrorMessage = 'New Password & Confirm Password Should be same.';
      return false;
    }
    if (!confirmpassword.match(/[a-z]/)) {
      this.hasFormErrors = true;
      this.ErrorMessage = "Password must contain at least one lower case letter.";
      return false;
    }
     //check for upper ase
     if (!confirmpassword.match(/[A-Z]/)) {
      this.hasFormErrors = true;
      this.ErrorMessage = "Password must contain at least one upper case letter.";
      return false;
    }
    //check for number
    if (!confirmpassword.match(/\d+/g)) {
      this.hasFormErrors = true;
      this.ErrorMessage = "Password must contain at least one number.";

      return false;
    }
    //Validating length
    if ((confirmpassword).length < 8) {
      this.hasFormErrors = true;
      this.ErrorMessage = "Your password has less than 8 characters.";
      return false;
    }
    //confirm passwords match and have been created
    if (newpassword == confirmpassword) {
      // this.hasFormErrors = true;
      // this.ErrorMessage = "Your password has been updated!";
      return true;
    }
  }

}
