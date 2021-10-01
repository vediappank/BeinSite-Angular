import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'progress-bar',
  template: `
  <div style="width:500px">
  <mat-progress-bar mode="determinate" [value]="data.percent.percent"></mat-progress-bar>
  
  </div>
  `,
  styles: [`h1 { font-family: Lato; }`]
})
export class ProgressbarComponent {
 // @Input() percent: number;
  data
  constructor(
     private dialogRef: MatDialogRef<ProgressbarComponent>,
     @Inject(MAT_DIALOG_DATA) data
  ) {
     this.data=data;
    console.log(data);
   }
}
