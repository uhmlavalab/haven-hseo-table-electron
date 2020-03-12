import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { PlanStateService, WindowService, AppRoutes, AppInput, InputService, StateUpdateType } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secondscreen-window-layout',
  templateUrl: './secondscreen-window-layout.component.html',
  styleUrls: ['./secondscreen-window-layout.component.css']
})
export class SecondscreenWindowLayoutComponent implements OnInit {

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
          this.rerouteToScreenScreenView();
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
        this.rerouteToWaitingScreen();
        break;
      case AppRoutes.planselection:
        this.rerouteToPlanSelection();
        break;
      case AppRoutes.calibration:
        this.rerouteToWaitingScreen();
        break;
      case AppRoutes.view:
        this.rerouteToScreenScreenView();
        break;
    }
  }

  rerouteToMainMenu() {
    this.ngZone.run(() => {
      this.router.navigate(['secondscreen-main-menu'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToPlanSelection() {
    this.ngZone.run(() => {
      this.router.navigate(['secondscreen-plan-selection'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToScreenScreenView() {
    this.ngZone.run(() => {
      this.router.navigate(['secondscreen-view'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToWaitingScreen() {
    this.ngZone.run(() => {
      this.router.navigate(['secondscreen-waiting'], { relativeTo: this.activeRoute });
    });
  }
}
