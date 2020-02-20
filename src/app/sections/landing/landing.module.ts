import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { CoreModule } from '@app/core';
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
    CoreModule,
    SharedModule
  ]
})
export class LandingModule { }
