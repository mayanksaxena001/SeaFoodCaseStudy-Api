import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from './dashboard/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'seafood-blockchain-casestudy';

  constructor(private router: Router, private dashboardService: DashboardService) {
    router.events.subscribe((val) => {
      if (val['url'] === '/dashboard') {
        this.dashboardService.showNavbar(true);

      }
    });
  }
}
