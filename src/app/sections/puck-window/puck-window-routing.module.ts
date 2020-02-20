import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';


const puckRoutes: Routes = [
  {
    path: '',
    component: PuckWindowLayoutComponent,
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
    RouterModule.forChild(puckRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PuckWindowRoutingModule { }
