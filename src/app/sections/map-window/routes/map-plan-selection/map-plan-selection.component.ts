import { Component, ChangeDetectorRef } from '@angular/core';
import { AppRoutes, ElectronService, PlanService, Plan } from '@app/core';
import { InputService } from '@app/input'
import { Subscription } from 'rxjs';

interface MenuOption {
  name: string;
  plan: Plan;
  selected: boolean;
  route: AppRoutes;
  background: string | null;
  click(): any;
}

@Component({
  selector: 'app-map-plan-selection',
  templateUrl: './map-plan-selection.component.html',
  styleUrls: ['./map-plan-selection.component.css']
})
export class MapPlanSelectionComponent {

  menuOptions: MenuOption[] = [];

  title = 'Main Menu';

  menuOptionSelected = 0;

  electronMessageSub: Subscription;

  constructor(private electronService: ElectronService, private planService: PlanService, private detectorRef: ChangeDetectorRef, private inputService: InputService) {
    this.inputService.deregisterAllKeyboardEvents();

    this.inputService.registerKeyboardEvent({ keyname: 'ArrowLeft', eventFunction: () => this.shiftSelectionLeft() });
    this.inputService.registerKeyboardEvent({ keyname: 'ArrowRight', eventFunction: () => this.shiftSelectionRight() });
    this.inputService.registerKeyboardEvent({ keyname: 'Enter', eventFunction: () => this.selectOption() });

    this.planService.getPlans().forEach(el => {
      this.menuOptions.push({
        name: el.displayName,
        plan: el,
        selected: false,
        route: AppRoutes.view,
        background: `url(${el.landingImagePath})`,
        click: () => {
          this.planService.loadPlan(el).then(() => {
            this.routeToView();
          })
        }
      })
    })

    this.menuOptions.push({
      name: 'Back',
      plan: null,
      selected: false,
      route: AppRoutes.mainmenu,
      background: null,
      click: () => this.routeToMainMenu()
    })

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
    this.menuOptions[this.menuOptionSelected].click()
  }

  routeToMainMenu() {
    this.electronService.rerouteApp(AppRoutes.mainmenu);
  }

  routeToView() {
    this.electronService.rerouteApp(AppRoutes.view);
  }


  exit() {
    this.electronService.exit()
  }


}
