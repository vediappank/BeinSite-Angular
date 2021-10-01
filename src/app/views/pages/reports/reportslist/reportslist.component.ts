import { Component, OnInit } from '@angular/core';
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'kt-reportslist',
  templateUrl: './reportslist.component.html',
  styleUrls: ['./reportslist.component.scss']
})
export class ReportslistComponent implements OnInit {

  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }
  public ReportMenuList: any[] = [];
  public ReportCategoryList: any[] = [];
  ngOnInit() {
    this.getRoleReportList();
  }
  getRoleReportList() {
    this.auth.GetRoleReportsCategory().subscribe(_categoryList => {
    this.auth.GetRoleReportsList().subscribe(_reportList => {
      this.ReportCategoryList =_categoryList;
      this.ReportMenuList = _reportList;
      console.log('Distinct Value:::' + JSON.stringify(this.ReportCategoryList));
      console.log('GetRoleReportsList Response Called::::' + JSON.stringify(_reportList));
    });
  });
  }
  redirectURL(data: any) {  
    this.router.navigate([data.page], { relativeTo: this.activatedRoute });
  }
}
