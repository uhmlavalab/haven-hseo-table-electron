import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { WindowService, AppRoutes, AppInput, InputService } from '@app/core';
import { Subscription } from 'rxjs';

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
export class MapMainMenuComponent implements OnDestroy {

  menuOptions: MenuOption[] = [
    {
      name: 'Islands',
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

  constructor(private windowService: WindowService, private detectorRef: ChangeDetectorRef, private inputService: InputService) {


    this.menuOptions[0].selected = true;

    this.electronMessageSub = this.windowService.windowMessageSubject.subscribe(value => {
      console.log(value);
      if (value.type == 'input') {
        this.processInput(value.input);
      }
    })
  }

  ngOnDestroy(){
    this.electronMessageSub.unsubscribe();
  }

  processInput(input: AppInput) {
    switch (input) {
      case AppInput.left: 
        this.shiftSelectionLeft();
        break;
      case AppInput.right:
        this.shiftSelectionRight();
        break;
      case AppInput.enter:
        this.selectOption();
        break;
    }
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
    this.windowService.rerouteApp(this.menuOptions[this.menuOptionSelected].route);
  }

  routeToPlanSelection() {
    this.windowService.rerouteApp(AppRoutes.planselection);
  }

  rerouteToCalibration() {
    this.windowService.rerouteApp(AppRoutes.calibration);
  }

  restart() {
    this.windowService.resetAllWindows();
  }

  exit() {
    this.windowService.exit()
  }

}
