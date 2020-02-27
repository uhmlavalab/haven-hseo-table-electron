import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';

import { PuckMainMenuComponent } from './routes/puck-main-menu/puck-main-menu.component';
import { PuckActiveComponent } from './routes/puck-active/puck-active.component';



const puckRoutes: Routes = [
  {
    path: '',
    component: PuckWindowLayoutComponent,
    children: [
      {
        path: 'main-menu',
        component: PuckMainMenuComponent
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
