import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppRoutes, AppInput, ElectronService } from '@app/core';
import { Subscription } from 'rxjs';

interface MenuOption {
  name: string;
  selected: boolean;
  route: AppRoutes;
  click(): any;
}

@Component({
  selector: 'app-map-plan-selection',
  templateUrl: './map-plan-selection.component.html',
  styleUrls: ['./map-plan-selection.component.css']
})
export class MapPlanSelectionComponent implements OnInit {

  menuOptions: MenuOption[] = [
    {
      name: 'Oahu',
      selected: false,
      route: AppRoutes.view,
      click: () => this.routeToView() 
    },
    {
      name: 'Maui',
      selected: false,
      route: AppRoutes.view,

      click: () => this.routeToView()
    },
    {
      name: 'Big Island',
      selected: false,
      route: AppRoutes.view,
      click: () => this.routeToView()
    },
    {
      name: 'Puerto Rico',
      selected: false,
      route: AppRoutes.view,
      click: () => this.routeToView()
    },
    {
      name: 'Back',
      selected: false,
      route: AppRoutes.mainmenu,
      click: () => this.routeToMainMenu()
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
    this.electronService.rerouteApp(this.menuOptions[this.menuOptionSelected].route);
  }


  routeToMainMenu() {
    this.electronService.rerouteApp(AppRoutes.mainmenu);
  }

  routeToView() {
    this.electronService.rerouteApp(AppRoutes.view);
  }

  restart() {
    this.electronService.resetAllWindows();
  }

  exit() {
    this.electronService.exit()
  }


}
