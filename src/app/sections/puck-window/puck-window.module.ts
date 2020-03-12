import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '@app/shared';

// Layout
import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';

// Routes
import { PuckWindowRoutingModule } from './puck-window-routing.module';
import { PuckMainMenuComponent } from './routes/puck-main-menu/puck-main-menu.component';
import { PuckViewComponent } from './routes/puck-view/puck-view.component';
import { PuckCalibrationComponent } from './routes/puck-calibration/puck-calibration.component';
import { PuckPlanSelectionComponent } from './routes/puck-plan-selection/puck-plan-selection.component';

// Components


@NgModule({
  declarations: [
    PuckWindowLayoutComponent,
    PuckMainMenuComponent,
    PuckViewComponent,
    PuckCalibrationComponent,
    PuckPlanSelectionComponent
  ],
  imports: [
    CommonModule,
    PuckWindowRoutingModule,
    SharedModule
  ]
})
export class PuckWindowModule { }
