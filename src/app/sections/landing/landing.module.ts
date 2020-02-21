import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '@app/shared';

// Layout
import { LandingLayoutComponent } from './layout/landing-layout.component';

// Routes
import { LandingRoutingModule } from './landing-routing-module';
import { ScreenSelectionComponent } from './routes/screen-selection/screen-selection.component';


@NgModule({
  declarations: [
    ScreenSelectionComponent,
    LandingLayoutComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule
  ]
})
export class LandingModule { }
