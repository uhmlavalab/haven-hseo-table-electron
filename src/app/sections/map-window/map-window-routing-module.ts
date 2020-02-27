import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapWindowLayoutComponent } from './layout/map-window-layout.component';
import { MapViewComponent } from './routes/map-view/map-view.component';
import { MapWaitingComponent } from './routes/map-waiting/map-waiting.component';
import { MapPlanSelectionComponent } from './routes/map-plan-selection/map-plan-selection.component';
import { MapMainMenuComponent } from './routes/map-main-menu/map-main-menu.component';

const mapRoutes: Routes = [
  {
    path: '',
    component: MapWindowLayoutComponent,
    children: [
      {
        path: 'map-view',
        component: MapViewComponent
      },
      {
        path: 'map-waiting',
        component: MapWaitingComponent
      },
      {
        path: 'map-plan-selection',
        component: MapPlanSelectionComponent
      },
      {
        path: 'map-main-menu',
        component: MapMainMenuComponent
      }

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mapRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MapWindowRoutingModule { }
