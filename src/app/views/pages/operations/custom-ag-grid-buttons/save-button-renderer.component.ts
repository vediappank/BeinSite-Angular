// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { GridOptions, RowNode } from 'ag-grid-community';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  selector: 'app-button-renderer',
  template: `
  <button  mat-icon-button color="primary" matTooltip="Post Campaign"  (click)="onClick($event)">
  <mat-icon style="height:50px;">save</mat-icon>
</button>
    `
})

export class SaveButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
    
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}