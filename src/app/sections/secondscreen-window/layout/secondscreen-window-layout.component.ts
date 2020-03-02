import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { PlanService, ElectronService, AppRoutes, AppInput } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputService } from 'src/app/modules/input';

@Component({
  selector: 'app-secondscreen-window-layout',
  templateUrl: './secondscreen-window-layout.component.html',
  styleUrls: ['./secondscreen-window-layout.component.css']
})
export class SecondscreenWindowLayoutComponent implements OnInit {

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
