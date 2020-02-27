import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElectronService, AppRoutes, AppInput } from '@app/core';
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
export class MapMainMenuComponent implements OnInit {

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
      click: () => this.routeToPlanSelection()
    },
    {
      name: 'Exit',
      selected: false,
      route: AppRoutes.exit,
      click: () => this.routeToPlanSelection()
    }
  ];

  title = 'Main Menu';

  menuOptionSelected = 0;

  electronMessageSub: Subscription;

  constructor(private electronService: ElectronService, private detectorRef: ChangeDetectorRef) {
    this.menuOptions[0].selected = true;
  }

  ngOnInit(): void {
    this.electronMessageSub = this.electronService.windowMessageSubject.subscribe(message => {
      if (!message) return;
      if (message.type == 'input') {
        this.processInput(message.input);
      }
    })
  }

  processInput(input: AppInput) {
    console.log(input);
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
    console.log('left')

    this.menuOptions[this.menuOptionSelected].selected = false;
    this.menuOptionSelected++;
    this.menuOptionSelected = this.menuOptionSelected % this.menuOptions.length;
    this.menuOptions[this.menuOptionSelected].selected = true;
    this.detectorRef.detectChanges();

  }

  shiftSelectionLeft() {
    console.log('right')

    this.menuOptions[this.menuOptionSelected].selected = false;
    this.menuOptionSelected--;
    if (this.menuOptionSelected < 0) {
      this.menuOptionSelected = this.menuOptions.length - 1;
    }
    this.menuOptions[this.menuOptionSelected].selected = true;
    this.detectorRef.detectChanges();
  }

  selectOption() {
    console.log('select option')
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
