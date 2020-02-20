import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout
import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';

// Routes
import { PuckWindowRoutingModule } from './puck-window-routing.module';

// Components



@NgModule({
  declarations: [
    PuckWindowLayoutComponent
  ],
  imports: [
    CommonModule,
    PuckWindowRoutingModule
  ]
})
export class PuckWindowModule { }
