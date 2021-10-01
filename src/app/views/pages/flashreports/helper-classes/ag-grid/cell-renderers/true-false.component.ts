import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@ Component({
  selector: 'app-true-false',
  template: `<div class="tfDiv"><img class="tfImg" src="{{imgSrc}}"/></div>`,
  styles: ['.tfDiv{width:100%;text-align:center;} .tfImg{width:16px;height:16px;}']
})
export class TrueFalseComponent implements ICellRendererAngularComp {
  public imgSrc: string;

  constructor() {
    this .imgSrc = 'assets/images/true.png';
  }

  // called on init
  agInit(params: any): void {
    if( params.value ) {
      this .imgSrc = 'assets/images/true.png';
    } else {
      this .imgSrc = 'assets/images/false.png';
    }
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    if( params.value ) {
      this .imgSrc = 'assets/images/true.png';
    } else {
      this .imgSrc = 'assets/images/false.png';
    }
    return true;
  }

}
