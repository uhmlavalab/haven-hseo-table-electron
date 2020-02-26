import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { MapsModule } from '@app/maps';
import { ChartsModule } from '@app/charts';
import { SharedModule } from '@app/shared';

// Layout
import { SecondscreenWindowLayoutComponent } from './layout/secondscreen-window-layout.component';

// Routes
import { SecondScreenWindowRoutingModule } from './secondscreen-window-routing-module';
import { SecondscreenWaitingComponent } from './routes/secondscreen-waiting/secondscreen-waiting.component';
import { SecondscreenViewComponent } from './routes/secondscreen-view/secondscreen-view.component';

//Components
import { LayerInfoComponent } from './components/layer-info/layer-info.component';

@NgModule({
  declarations: [
    SecondscreenWindowLayoutComponent,
    SecondscreenWaitingComponent,
    SecondscreenViewComponent,
    LayerInfoComponent
  ],
  imports: [
    CommonModule,
    SecondScreenWindowRoutingModule,
    MapsModule,
    ChartsModule,
    SharedModule
  ]
})
export class SecondScreenWindowModule { }
