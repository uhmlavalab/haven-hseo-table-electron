import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout
import { MapWindowLayoutComponent } from './layout/map-window-layout.component';

// Routes
import { MapWindowRoutingModule } from './map-window-routing-module';


@NgModule({
  declarations: [MapWindowLayoutComponent],
  imports: [
    CommonModule,
    MapWindowRoutingModule
  ]
})
export class MapWindowModule { }
