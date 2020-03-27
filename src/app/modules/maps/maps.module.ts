import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapElementComponent } from './components/map-element/map-element.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';
import { ArcgisMapComponent } from './components/arcgis-map/arcgis-map.component';

@NgModule({
  declarations: [
    MapElementComponent,
    LeafletMapComponent,
    ArcgisMapComponent
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [
    MapElementComponent,
    LeafletMapComponent,
    ArcgisMapComponent
  ]
})
export class MapsModule { }
