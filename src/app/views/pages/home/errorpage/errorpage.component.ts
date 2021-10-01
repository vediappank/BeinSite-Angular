import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../../core/_base/layout';

@Component({
  selector: 'kt-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.scss']
})
export class ErrorPageComponent implements OnInit {

  constructor(private subheaderService: SubheaderService) { }

  ngOnInit() {
    this.subheaderService.setTitle('Unauthorized Access');
  }

}


