import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';

import { AuthService, User } from '../../../../../core/auth';

@Component({
  selector: 'kt-role-selection-widget',
  templateUrl: './role-selection-widget.component.html',
  styleUrls: ['./role-selection-widget.component.scss']
})
export class RoleSelectionWidgetComponent implements OnInit {

  Agents: any[] = [];
  selectedRoles: any[] = [];
  selectedPeople: any;
  source: Array<any>;
  confirmed: Array<any>;
  @Input() public UpdateRoleSelectedList: string;
  
  @Output() public RoleSelectedList = new EventEmitter<any>();

 

  constructor(public auth: AuthService) {
    this.confirmed = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {

    this.auth.getAllRoles()
      .subscribe((res) => {
        this.Agents = res;
        this.source = res;
        //this.source =  this.source.filter(row=>row.active_flag !="N");
        //this.Agents =  this.Agents.filter(row=>row.active_flag !="N");
        // this.confirmed = [];
        console.log('Source List::::' + JSON.stringify(this.source));
        console.log('User List::::' + JSON.stringify(this.Agents));
        console.log(' this.confirmed User List::::' + JSON.stringify(this.confirmed));
        this.confirmed = [];
        
        this.selectedPeople = this.UpdateRoleSelectedList;
        for (let i = 0; i < this.UpdateRoleSelectedList.split(',').length; i++) {
          const finSummRec = this.Agents.find(x => x.id === Number(this.UpdateRoleSelectedList.split(',')[i]));
          this.confirmed.push(finSummRec);
        }
        this.RoleSelectedList.emit(this.selectedPeople);
      });
  }

  OnChangeRole($event) {    
    this.selectedRoles = [];
    //console.log(' OnChangeAgent this.confirmed User List::::' + JSON.stringify($event));   

    //  if($event.length == 0)
    //   {
    //     this.RoleSelectedList.emit(this.selectedRoles.toString());
    //     console.log(' One to One Meeting Selected Agents List::::' + JSON.stringify(this.selectedRoles));
    //   }
    //   else {
    //     const finSummRec = this.Agents.find(x => x.id === this.confirmed[0].id);
    //     this.confirmed = [];
    //     this.confirmed.push(finSummRec);
    //     this.selectedRoles.push($event[0].id);
    //     this.RoleSelectedList.emit(this.selectedRoles.toString());        
    //    // alert('Agent Can`t Select More then one - Because Meeting Type is One-to-One');
    //     console.log('Agent Can`t Select More then one - Because Meeting Type is One-to-One::' + JSON.stringify(this.confirmed));

    //   }
    
   
      for (let i = 0; i < $event.length; i++) {
        this.selectedRoles.push($event[i].id);
      }
      this.RoleSelectedList.emit(this.selectedRoles.toString());
      console.log('Meeting Selected Agents List::::' + JSON.stringify(this.selectedRoles));
    
  }

  OnSelectRole() {
    this.RoleSelectedList.emit(this.selectedPeople);
    console.log('OnSelectAgent List on changed::::' + JSON.stringify(this.selectedPeople));
  }

  getRoleName(item: any) {    
    return item.RoleName;
  }
}

