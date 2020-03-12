import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapLayer } from '@app/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  @Input() center: [number, number];
  @Input() zoom: number;
  @Input() layers: MapLayer[];
  map: L.Map;

  centerUpdate: number;
  options = {
    layers: [
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash;'
      })
    ],
    zoom: 12,
    center: L.latLng(46.879966, -121.726909)
  };
  constructor() { }

  ngOnInit(): void {
    this.centerUpdate = Date.now();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.center && this.map) {
      if ((Date.now() - this.centerUpdate) > 0.25) {
        this.center = changes.center.currentValue;
        this.map.panTo(L.latLng(this.center[0], this.center[1]), { animate: false });
        this.centerUpdate = Date.now();
      }

    }

    if (changes.zoom && this.map) {
      this.zoom = changes.zoom.currentValue;
      this.map.setZoom(this.zoom);
    }
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.panTo(L.latLng(this.center[1], this.center[0]));
    this.map.setZoom(this.zoom);
    this.layers.forEach(layer => {
      d3.json(layer.filePath, (error, geoData) => {
        L.geoJSON(geoData).addTo(map);
      })
    });
  }

}
