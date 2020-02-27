import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '@app/shared';
import { InputModule } from '@app/input';

// Layout
import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';

// Routes
import { PuckWindowRoutingModule } from './puck-window-routing.module';
import { PuckMainMenuComponent } from './routes/puck-main-menu/puck-main-menu.component';
import { PuckActiveComponent } from './routes/puck-active/puck-active.component';

// Components


@NgModule({
  declarations: [
    PuckWindowLayoutComponent,
    PuckMainMenuComponent,
    PuckActiveComponent
  ],
  imports: [
    CommonModule,
    PuckWindowRoutingModule,
    SharedModule,
    InputModule
  ]
})
export class PuckWindowModule { }
