import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WindowService, AppRoutes, AppInput, PlanStateService, InputService } from '@app/core';
import { Subscription } from 'rxjs';
import { StateUpdateType } from 'main';

@Component({
  selector: 'app-map-window-layout',
  templateUrl: './map-window-layout.component.html',
  styleUrls: ['./map-window-layout.component.css']
})
export class MapWindowLayoutComponent implements OnInit, OnDestroy {

  private electronMessageSub: Subscription;

  constructor(private ngZone: NgZone, private activeRoute: ActivatedRoute, private router: Router, private electronService: WindowService, private inputService: InputService, private planService: PlanStateService) {

    this.inputService.deregisterAllKeyboardEvents();
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowLeft', eventFunction: () => this.inputService.sendInput(AppInput.left) });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowRight', eventFunction: () =>this.inputService.sendInput(AppInput.right) });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowUp', eventFunction: () => this.inputService.sendInput(AppInput.up) });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowDown', eventFunction: () =>this.inputService.sendInput(AppInput.down) });
    this.inputService.registerKeyboardEvent({ keyname: '=', eventFunction: () => this.inputService.sendInput(AppInput.plus) });
    this.inputService.registerKeyboardEvent({ keyname: '-', eventFunction: () =>this.inputService.sendInput(AppInput.minus) });
    this.inputService.registerKeyboardEvent({ keyname: 'Enter', eventFunction: () => this.inputService.sendInput(AppInput.enter) });

    this.electronMessageSub = this.electronService.windowMessageSubject.subscribe(message => {
      if (!message) return;
      if (message.type == 'reroute') {
        this.reroute(message.route);
      }
      if (message.type == StateUpdateType.loadplan) {
        this.planService.loadPlan(message.value).then(() => {
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
