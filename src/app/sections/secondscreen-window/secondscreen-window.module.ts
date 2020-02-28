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
import { SecondscreenPlanSelectionComponent } from './routes/secondscreen-plan-selection/secondscreen-plan-selection.component';
import { SecondscreenMainMenuComponent } from './routes/secondscreen-main-menu/secondscreen-main-menu.component';

//Components
import { LayerInfoComponent } from './components/layer-info/layer-info.component';
import { LayerListComponent } from './components/layer-list/layer-list.component';

@NgModule({
  declarations: [
    SecondscreenWindowLayoutComponent,
    SecondscreenWaitingComponent,
    SecondscreenViewComponent,
    LayerInfoComponent,
    SecondscreenPlanSelectionComponent,
    SecondscreenMainMenuComponent,
    LayerListComponent
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
