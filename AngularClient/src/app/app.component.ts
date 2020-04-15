import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from './dashboard/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router, private dashboardService: DashboardService) {
    // router.events.subscribe((val) => {
    //   if (val['url'] === '/dashboard') {
    //     console.log('AppComponent router event subscription..');
    //     this.dashboardService.showNavbar(true);
    //   }
    // });
  }
}
