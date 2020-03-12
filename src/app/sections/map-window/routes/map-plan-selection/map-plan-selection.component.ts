import { Component, ChangeDetectorRef } from '@angular/core';
import { AppRoutes, WindowService, PlanStateService, Plan, InputService, AppInput } from '@app/core';
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

  title = 'Island Selection';

  menuOptionSelected = 0;

  electronMessageSub: Subscription;

  constructor(private electronService: WindowService, private inputService: InputService, private planService: PlanStateService, private detectorRef: ChangeDetectorRef) {

    this.planService.getPlans().forEach(el => {
      this.menuOptions.push({
        name: el.displayName,
        plan: el,
        selected: false,
        route: AppRoutes.view,
        background: `url(${el.landingImagePath})`,
        click: () => {
          this.planService.changePlan(el.name);
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
    this.electronMessageSub = this.inputService.inputSub.subscribe(value => {
      this.processInput(value);
    })
  }

  ngOnDestroy() {
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
