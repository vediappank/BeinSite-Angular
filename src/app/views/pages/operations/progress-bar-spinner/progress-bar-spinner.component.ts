import { Component, Input, OnInit, ViewChild, TemplateRef, ViewContainerRef, DoCheck } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';


@Component({
  selector: 'kt-progress-bar-spinner',
  templateUrl: './progress-bar-spinner.component.html',
  styleUrls: ['./progress-bar-spinner.component.scss']
})
export class ProgressBarSpinnerComponent implements OnInit {
  @Input() color?: ThemePalette;
  @Input() diameter?: number = 100;
  @Input() mode?: ProgressSpinnerMode;
  @Input() strokeWidth?: number;
  @Input() value?: number;
  constructor() { }

  ngOnInit() {
  }

}
