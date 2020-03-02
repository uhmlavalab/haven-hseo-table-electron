import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ElectronService, AppRoutes, AppInput, PlanService } from '@app/core';
import { Subscription } from 'rxjs';
import { InputService } from 'src/app/modules/input';

@Component({
  selector: 'app-map-window-layout',
  templateUrl: './map-window-layout.component.html',
  styleUrls: ['./map-window-layout.component.css']
})
export class MapWindowLayoutComponent implements OnInit, OnDestroy {

  private electronMessageSub: Subscription;

  constructor(private ngZone: NgZone, private activeRoute: ActivatedRoute, private router: Router, private electronService: ElectronService, private inputService: InputService, private planService: PlanService) {

    this.inputService.deregisterAllKeyboardEvents();
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowLeft', eventFunction: () => this.electronService.appInput(AppInput.left) });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowRight', eventFunction: () =>this.electronService.appInput(AppInput.right) });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowUp', eventFunction: () => this.electronService.appInput(AppInput.up) });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowDown', eventFunction: () =>this.electronService.appInput(AppInput.down) });
    this.inputService.registerKeyboardEvent({ keyname: '=', eventFunction: () => this.electronService.appInput(AppInput.plus) });
    this.inputService.registerKeyboardEvent({ keyname: '-', eventFunction: () =>this.electronService.appInput(AppInput.minus) });
    this.inputService.registerKeyboardEvent({ keyname: 'Enter', eventFunction: () => this.electronService.appInput(AppInput.enter) });

    this.electronMessageSub = this.electronService.windowMessageSubject.subscribe(message => {
      if (!message) return;
      if (message.type == 'reroute') {
        this.reroute(message.route);
      }
      if (message.type == 'plan-load') {
        this.planService.loadPlan(message.planname).then(() => {
          this.rerouteToMapView();
        })
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
