import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapElementComponent } from './components/map-element/map-element.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';

@NgModule({
  declarations: [
    MapElementComponent,
    LeafletMapComponent
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [
    MapElementComponent,
    LeafletMapComponent
  ]
})
export class MapsModule { }
