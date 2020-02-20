import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapWindowLayoutComponent } from './layout/map-window-layout.component';


const landingRoutes: Routes = [
  {
    path: '',
    component: MapWindowLayoutComponent,
    // children: [
    //   {
    //     // path: 'screen-selection',
    //     // component: ScreenSelectionComponent
    //   }
    // ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(landingRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MapWindowRoutingModule { }
