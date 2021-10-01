import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { StringUtilComponent } from '../../string-util.component';

@ Component({
  selector: 'app-aggrid-dollar',
  template: `{{valueStr | currency:'USD'}}`,
  styles: []
})
export class DollarComponent implements ICellRendererAngularComp {
  public valueStr: number;

  constructor() {
    this .valueStr = 0;
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
    if( typeof value!=='undefined' && value!=='' && value!=='undefined'){
      this .valueStr = StringUtilComponent.getInt(value);
    }else{
      this .valueStr = 0;
    }
    // this .valueStr = StringUtilComponent.dollar(value);
    /*if( typeof value!=='undefined' && value!=='' && value!=='undefined'){
      this .valueStr = '$' + value;
    }else{
      this .valueStr = '';
    }*/
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
  }
}
