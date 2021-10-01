import { Component, OnInit } from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../core/_base/layout';

@Component({
  selector: 'kt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  public userid: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public callcenter: string;
  public userccrolename: string;
  public profile_img:any;
  fullname: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private subheaderService: SubheaderService) {

  }

  ngOnInit() {
    if (localStorage.hasOwnProperty("userLoggedIn")) {
      this.userid = JSON.parse(localStorage.getItem('userLoggedIn')).id; 
      this.fullname = JSON.parse(localStorage.getItem('userLoggedIn')).fullname;   
          //this.subheaderService.setTitle('Welcome '+this.fullname +'-'+  this.userid+  ' To beINSIGHT !!!!');
          
        }
  }

 
}

