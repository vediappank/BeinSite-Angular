
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth';
import { User } from '../../../../core/auth/_models/user.model';
import { SubheaderService } from '../../../../core/_base/layout';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kt-profileinfo',
  templateUrl: './profileinfo.component.html',
  styleUrls: ['./profileinfo.component.scss']
})
export class ProfileinfoComponent implements OnInit {
  public userid: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public callcenter: string;
  public userccrolename: string;
  public profile_img:any;
  public WelcomeMessage:any;
  fullname: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private subheaderService: SubheaderService) {

  }

  ngOnInit() {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userid = JSON.parse(localStorage.getItem('currentUser')).agentid; 
      this.firstname = JSON.parse(localStorage.getItem('currentUser')).firstname;   
          this.subheaderService.setTitle('');
          this.WelcomeMessage ='Welcome '+this.firstname +'-'+  this.userid +  ' To beINSIGHT';
        }
  }

}

