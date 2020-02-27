import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { ElectronService, AppRoutes, AppInput } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-puck-window-layout',
  templateUrl: './puck-window-layout.component.html',
  styleUrls: ['./puck-window-layout.component.css']
})
export class PuckWindowLayoutComponent implements OnInit, OnDestroy {

  private electronMessageSub: Subscription;
  
  constructor(private router: Router, private electronService: ElectronService, private activeRoute: ActivatedRoute, private ngZone: NgZone) {
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

  calibration() {
    this.electronService.rerouteApp(AppRoutes.calibration);
  }

  mainMenu() {
    this.electronService.rerouteApp(AppRoutes.mainmenu);
  }

  planSelection() {
    this.electronService.rerouteApp(AppRoutes.planselection);
  }

  mainView() {
    this.electronService.rerouteApp(AppRoutes.view);
  }

  restart() {
    this.electronService.resetAllWindows();
  }

  shiftLeft() {
    this.electronService.shiftPuckScreenLeft(); 
  }

  shiftRight() {
    this.electronService.shiftPuckScreenRight();
  }

  left() {
    this.electronService.appInput(AppInput.left);
  }

  right() {
    this.electronService.appInput(AppInput.right);
  }

  
}