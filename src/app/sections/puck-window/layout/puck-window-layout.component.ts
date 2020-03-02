import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { ElectronService, AppRoutes, AppInput, PlanService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputService } from 'src/app/modules/input';
@Component({
  selector: 'app-puck-window-layout',
  templateUrl: './puck-window-layout.component.html',
  styleUrls: ['./puck-window-layout.component.css']
})
export class PuckWindowLayoutComponent implements OnInit, OnDestroy {

  private electronMessageSub: Subscription;
  
  constructor(private router: Router, private electronService: ElectronService, private activeRoute: ActivatedRoute, private ngZone: NgZone, private inputService: InputService, private planService: PlanService) {

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
          this.rerouteToPuckView();
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
        this.rerouteToCalibration();
        break;
      case AppRoutes.view:
        this.rerouteToPuckView();
        break;
    }
  }

  rerouteToPuckView() {
    this.ngZone.run(() => {
      this.router.navigate(['puck-view'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToPlanSelection() {
    this.ngZone.run(() => {
      this.router.navigate(['puck-plan-selection'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToCalibration() {
    this.ngZone.run(() => {
      this.router.navigate(['puck-calibration'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToMainMenu() {
    this.ngZone.run(() => {
      this.router.navigate(['puck-main-menu'], { relativeTo: this.activeRoute });
    });
  }
  mainMenu() {
    this.electronService.rerouteApp(AppRoutes.mainmenu);
  }


  restart() {
    this.electronService.resetAllWindows();
  }

  exit() {
    this.electronService.exit();
  }

  shiftLeft() {
    this.electronService.shiftPuckScreenLeft(); 
  }

  shiftRight() {
    this.electronService.shiftPuckScreenRight();
  }
  
}