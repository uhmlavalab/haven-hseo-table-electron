import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout
import { PuckWindowLayoutComponent } from './layout/puck-window-layout.component';

// Routes
import { PuckWindowRoutingModule } from './puck-window-routing.module';
import { CalibrationComponent } from './routes/calibration/calibration.component';
import { PuckActiveComponent } from './routes/puck-active/puck-active.component';

// Components
import { VideoFeedComponent } from './components/video-feed/video-feed.component';


@NgModule({
  declarations: [
    PuckWindowLayoutComponent,
    VideoFeedComponent,
    CalibrationComponent,
    PuckActiveComponent
  ],
  imports: [
    CommonModule,
    PuckWindowRoutingModule
  ]
})
export class PuckWindowModule { }
