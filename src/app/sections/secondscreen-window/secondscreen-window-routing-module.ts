import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecondscreenWindowLayoutComponent } from './layout/secondscreen-window-layout.component';


const secondscreenRoutes: Routes = [
  {
    path: '',
    component: SecondscreenWindowLayoutComponent,
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
    RouterModule.forChild(secondscreenRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SecondScreenWindowRoutingModule { }
