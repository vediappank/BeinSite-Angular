import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'

import { AuthNoticeService,AuthService } from '../../../../core/auth';
import { User } from '../../../../core/auth/_models/user.model';
import { ChangePasswordModel } from '../../userprofile/_model/changepasswordrequest.model';

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
  oldpassword: any;
  unsubscribe: any;
  private returnUrl: any;
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
  constructor(private fb: FormBuilder, private authNoticeService: AuthNoticeService, public auth: AuthService, private layoutUtilsService: LayoutConfigService, private router: Router) {

    this.form = this.fb.group({    
      newpassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

  }

  ngOnInit() {
   
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
        } 
          if (localStorage.hasOwnProperty("userLoggedIn")) {
            this.oldpassword = JSON.parse(localStorage.getItem('userLoggedIn')).password; 
          }        
          this.changePasswordRequest = {  
            old_password:this.oldpassword,         
            new_password: this.form.controls['newpassword'].value,
            confirm_password: this.form.controls['confirmPassword'].value,
            agent_id: this.userid
          }
          console.log('change password data:::' + JSON.stringify(this.changePasswordRequest));
          let response:any;
          this.auth.GetHomeChangePassword(this.changePasswordRequest).subscribe((_userlist: any) => {
            this.hasFormErrors = false;
            this.hasFormSuccess = true;
            if(_userlist == 'FAILURE')
            {
              return false;
            }
            else
            {
              this.returnUrl = '/auth/login';
              this.authNoticeService.setNotice(null); 
            alert('Successfully changed your password.');
            //this.router.navigateByUrl(this.returnUrl);
            this.router.navigate(['/auth/login'], { queryParamsHandling: 'merge' });
            }
            // const message = `New user successfully has been added.`;
            //this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
          });
        }
      }
      return;
    

    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value))

  }
  

  CheckPassword(newpassword, confirmpassword) {
     if (newpassword != confirmpassword) {   
      this.authNoticeService.setNotice('New Password & Confirm Password Should be same.', 'danger');
      return false;
    }
    if (!confirmpassword.match(/[a-z]/)) {    
      this.authNoticeService.setNotice('Password must contain at least one lower case letter.', 'danger');
      return false;
    }
     //check for upper ase
     if (!confirmpassword.match(/[A-Z]/)) {
      this.authNoticeService.setNotice('Password must contain at least one upper case letter.', 'danger');    
      return false;
    }
    //check for number
    if (!confirmpassword.match(/\d+/g)) { 
      this.authNoticeService.setNotice('Password must contain at least one number.', 'danger');    
      return false;
    }
    //Validating length
    if ((confirmpassword).length < 8) {     
      this.authNoticeService.setNotice('Your password has less than 8 characters.', 'danger');    
     
      return false;
    }
    //confirm passwords match and have been created
    if (newpassword == confirmpassword) {     
      return true;
    }
  }

}
