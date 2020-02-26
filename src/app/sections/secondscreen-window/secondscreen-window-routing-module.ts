import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecondscreenWindowLayoutComponent } from './layout/secondscreen-window-layout.component';
import { SecondscreenWaitingComponent } from './routes/secondscreen-waiting/secondscreen-waiting.component';
import { SecondscreenViewComponent } from './routes/secondscreen-view/secondscreen-view.component';


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
