import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuckService } from './puck-input/services/puck.service';
import { InputService } from './services/input.service';

import { YearPuckComponent } from './puck-input/components/year-puck/year-puck.component';
import { VideoFeedComponent } from './puck-input/video-feed/video-feed.component';
import { CalibrationComponent } from './puck-input/calibration/calibration.component';
import { LeftRightPuckComponent } from './puck-input/components/left-right-puck/left-right-puck.component';
import { LayerPuckComponent } from './puck-input/components/layer-puck/layer-puck.component';

@NgModule({
  declarations: [
    YearPuckComponent,
    VideoFeedComponent,
    CalibrationComponent,
    LeftRightPuckComponent,
    LayerPuckComponent
  ],
  exports: [
    YearPuckComponent,
    VideoFeedComponent,
    CalibrationComponent,
    LeftRightPuckComponent,
    LayerPuckComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    PuckService,
    InputService
  ]
})
export class InputModule { }
