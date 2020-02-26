import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { MapsModule } from '@app/maps';
import { ChartsModule } from '@app/charts';
import { SharedModule } from '@app/shared';

// Layout
import { MapWindowLayoutComponent } from './layout/map-window-layout.component';

// Routes
import { MapWindowRoutingModule } from './map-window-routing-module';
import { MapViewComponent } from './routes/map-view/map-view.component';
import { MapWaitingComponent } from './routes/map-waiting/map-waiting.component';


@NgModule({
  declarations: [
    MapWindowLayoutComponent, 
    MapViewComponent, 
    MapWaitingComponent
  ],
  imports: [
    CommonModule,
    MapWindowRoutingModule,
    MapsModule,
    ChartsModule,
    SharedModule
  ]
})
export class MapWindowModule { }
