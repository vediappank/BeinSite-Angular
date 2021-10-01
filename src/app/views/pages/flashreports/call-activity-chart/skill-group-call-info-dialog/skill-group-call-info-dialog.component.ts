import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SkillGroupInfo } from '../../model/skill-group-info.model';

@ Component({
  selector: 'app-skill-group-call-info-dialog',
  templateUrl: './skill-group-call-info-dialog.component.html',
  styleUrls: ['./skill-group-call-info-dialog.component.scss']
})
export class SkillGroupCallInfoDialogComponent implements OnInit {

  public skGrpInfo: SkillGroupInfo;

  constructor(private dialogRef: MatDialogRef< SkillGroupCallInfoDialogComponent >, @ Inject(MAT_DIALOG_DATA) data) {
 
    console.log('skGrpInfo:::' + JSON.stringify(data.callInfo));
    this .skGrpInfo = data;
    
  }

  ngOnInit() {
  }
}
