import { Component, ChangeDetectorRef } from '@angular/core';
import { ElectronService, AppRoutes, AppInput } from '@app/core';
import { Subscription } from 'rxjs';
import { InputService } from '@app/input';

interface MenuOption {
  name: string;
  selected: boolean;
  route: AppRoutes;
  click(): any;
}

@Component({
  selector: 'app-map-main-menu',
  templateUrl: './map-main-menu.component.html',
  styleUrls: ['./map-main-menu.component.css']
})
export class MapMainMenuComponent  {

  menuOptions: MenuOption[] = [
    {
      name: 'Plan Selection',
      selected: false,
      route: AppRoutes.planselection,
      click: () => this.routeToPlanSelection() 
    },
    {
      name: 'Calibration',
      selected: false,
      route: AppRoutes.planselection,

      click: () => this.rerouteToCalibration()
    },
    {
      name: 'Restart',
      selected: false,
      route: AppRoutes.restart,
      click: () => this.restart()
    },
    {
      name: 'Exit',
      selected: false,
      route: AppRoutes.exit,
      click: () => this.exit()
    }
  ];

  title = 'Main Menu';

  menuOptionSelected = 0;

  electronMessageSub: Subscription;

  constructor(private electronService: ElectronService, private detectorRef: ChangeDetectorRef, private inputService: InputService) {
    this.inputService.deregisterAllKeyboardEvents();
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowLeft', eventFunction: () => this.shiftSelectionLeft() });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowRight', eventFunction: () => this.shiftSelectionRight() });
    this.inputService.registerKeyboardEvent({ keyname: 'Enter', eventFunction: () => this.selectOption() });

    this.menuOptions[0].selected = true;
  }

  shiftSelectionRight() {
    this.menuOptions[this.menuOptionSelected].selected = false;
    this.menuOptionSelected++;
    this.menuOptionSelected = this.menuOptionSelected % this.menuOptions.length;
    this.menuOptions[this.menuOptionSelected].selected = true;
    this.detectorRef.detectChanges();
  }

  shiftSelectionLeft() {
    this.menuOptions[this.menuOptionSelected].selected = false;
    this.menuOptionSelected--;
    if (this.menuOptionSelected < 0) {
      this.menuOptionSelected = this.menuOptions.length - 1;
    }
    this.menuOptions[this.menuOptionSelected].selected = true;
    this.detectorRef.detectChanges();
  }

  selectOption() {
    this.electronService.rerouteApp(this.menuOptions[this.menuOptionSelected].route);
  }

  routeToPlanSelection() {
    this.electronService.rerouteApp(AppRoutes.planselection);
  }

  rerouteToCalibration() {
    this.electronService.rerouteApp(AppRoutes.calibration);
  }

  restart() {
    this.electronService.resetAllWindows();
  }

  exit() {
    this.electronService.exit()
  }

}
