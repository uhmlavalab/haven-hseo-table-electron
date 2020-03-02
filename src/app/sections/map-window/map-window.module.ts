import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { MapsModule } from '@app/maps';
import { ChartsModule } from '@app/charts';
import { SharedModule } from '@app/shared';


// Modules 
import { DragDropModule } from '@angular/cdk/drag-drop';

// Layout
import { MapWindowLayoutComponent } from './layout/map-window-layout.component';

// Routes
import { MapWindowRoutingModule } from './map-window-routing-module';
import { MapViewComponent } from './routes/map-view/map-view.component';
import { MapWaitingComponent } from './routes/map-waiting/map-waiting.component';
import { MapPlanSelectionComponent } from './routes/map-plan-selection/map-plan-selection.component';
import { MapMainMenuComponent } from './routes/map-main-menu/map-main-menu.component';


@NgModule({
  declarations: [
    MapWindowLayoutComponent, 
    MapViewComponent, 
    MapWaitingComponent, 
    MapPlanSelectionComponent, MapMainMenuComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MapWindowRoutingModule,
    MapsModule,
    ChartsModule,
    SharedModule
  ]
})
export class MapWindowModule { }
