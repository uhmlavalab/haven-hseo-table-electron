import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecondscreenWindowLayoutComponent } from './layout/secondscreen-window-layout.component';
import { SecondscreenWaitingComponent } from './routes/secondscreen-waiting/secondscreen-waiting.component';
import { SecondscreenViewComponent } from './routes/secondscreen-view/secondscreen-view.component';
import { SecondscreenMainMenuComponent } from './routes/secondscreen-main-menu/secondscreen-main-menu.component';
import { SecondscreenPlanSelectionComponent } from './routes/secondscreen-plan-selection/secondscreen-plan-selection.component';


const secondscreenRoutes: Routes = [
  {
    path: '',
    component: SecondscreenWindowLayoutComponent,
    children: [
      {
        path: 'secondscreen-waiting',
        component: SecondscreenWaitingComponent
      },
      {
        path: 'secondscreen-view',
        component: SecondscreenViewComponent
      },
      {
        path: 'secondscreen-main-menu',
        component: SecondscreenMainMenuComponent
      },
      {
        path: 'secondscreen-plan-selection',
        component: SecondscreenPlanSelectionComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(secondscreenRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SecondScreenWindowRoutingModule { }
