import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WhatsappInfo } from '../../model/whatsapp-info.model';

@ Component({
  selector: 'app-whatsapp-chat-info-dialog',
  templateUrl: './whatsapp-chat-info-dialog.component.html',
  styleUrls: ['./whatsapp-chat-info-dialog.component.scss']
})
export class WhatsappChatInfoDialogComponent implements OnInit {

  public waInfo: WhatsappInfo;

  constructor(private dialogRef: MatDialogRef< WhatsappChatInfoDialogComponent >, @ Inject(MAT_DIALOG_DATA) data) {
    this .waInfo = data;
  }

  ngOnInit() {
  }

}

