import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { StringUtilComponent } from '../../string-util.component';

@ Component({
  selector: 'app-aggrid-percentage',
  template: `{{valueStr}}`,
  styles: []
})
export class PercentageComponent implements ICellRendererAngularComp {
  public valueStr: string;

  constructor() {
    this .valueStr = '';
  }

  // called on init
  agInit(params: any): void {
    this .calculateValue(params.value);
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this .calculateValue(params.value);
    return true;
  }

  calculateValue(value: string) {
    this .valueStr = StringUtilComponent.percentage(value);
    /*if( typeof value!=='undefined' && value!=='' && value!=='undefined'){
      this .valueStr = value + '%';
    }else{
      this .valueStr = '';
    }*/
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
  }
}
