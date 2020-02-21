import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';
import { CalibrationComponent } from './routes/calibration/calibration.component';
import { PuckActiveComponent } from './routes/puck-active/puck-active.component';


const puckRoutes: Routes = [
  {
    path: '',
    component: PuckWindowLayoutComponent,
    children: [
      {
        path: 'calibration',
        component: CalibrationComponent
      },
      {
        path: 'running',
        component: PuckActiveComponent
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
