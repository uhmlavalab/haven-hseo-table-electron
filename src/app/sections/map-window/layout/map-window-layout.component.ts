import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ElectronService, AppRoutes } from '@app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-window-layout',
  templateUrl: './map-window-layout.component.html',
  styleUrls: ['./map-window-layout.component.css']
})
export class MapWindowLayoutComponent implements OnInit, OnDestroy {

  private electronMessageSub: Subscription;


  constructor(private ngZone: NgZone, private activeRoute: ActivatedRoute, private router: Router, private electronService: ElectronService) {
    this.electronMessageSub = this.electronService.windowMessageSubject.subscribe(message => {
      if (!message) return;
      if (message.type == 'reroute') {
        this.reroute(message.route);
      }
    })
  }

  ngOnInit(): void {
    this.rerouteToMainMenu();
  }

  ngOnDestroy() {
    this.electronMessageSub.unsubscribe();
  }

  reroute(route: AppRoutes) {
    switch (route) {
      case AppRoutes.mainmenu:
        this.rerouteToMainMenu();
        break;
      case AppRoutes.planselection:
        this.rerouteToPlanSelection();
        break;
      case AppRoutes.calibration:
        this.rerouteToWaitingScreen();
        break;
      case AppRoutes.view:
        this.rerouteToMapView();
        break;
    }
  }

  rerouteToMainMenu() {
    this.ngZone.run(() => {
      this.router.navigate(['map-main-menu'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToPlanSelection() {
    this.ngZone.run(() => {
      this.router.navigate(['map-plan-selection'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToMapView() {
    this.ngZone.run(() => {
      this.router.navigate(['map-view'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToWaitingScreen() {
    this.ngZone.run(() => {
      this.router.navigate(['map-waiting'], { relativeTo: this.activeRoute });
    });
  }

}
