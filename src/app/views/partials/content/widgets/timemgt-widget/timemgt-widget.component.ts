// Angular
import { Component, Input, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
import { doungnuntData } from '../../../../partials/content/widgets/_model/doungdata.model';
import { TimeMgtModel  } from '../../../../partials/content/widgets/_model/timemgt.model';

@Component({
  selector: 'kt-timemgt-widget',
  templateUrl: './timemgt-widget.component.html',
  styleUrls: ['./timemgt-widget.component.scss']
})
export class TimemgtWidgetComponent implements OnInit {
	// Public properties
	@Input() data: TimeMgtModel[];

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
  ngOnInit() {
		if (!this.data) {
			alert(JSON.stringify(this.data))
		}
	}

}
