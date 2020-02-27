import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';

import { PuckMainMenuComponent } from './routes/puck-main-menu/puck-main-menu.component';
import { PuckViewComponent } from './routes/puck-view/puck-view.component';
import { PuckCalibrationComponent } from './routes/puck-calibration/puck-calibration.component';
import { PuckPlanSelectionComponent } from './routes/puck-plan-selection/puck-plan-selection.component';

const puckRoutes: Routes = [
  {
    path: '',
    component: PuckWindowLayoutComponent,
    children: [
      {
        path: 'puck-main-menu',
        component: PuckMainMenuComponent
      },
      {
        path: 'puck-view',
        component: PuckViewComponent
      },
      {
        path: 'puck-calibration',
        component: PuckCalibrationComponent
      },
      {
        path: 'puck-plan-selection',
        component: PuckPlanSelectionComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(puckRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PuckWindowRoutingModule { }
