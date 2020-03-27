import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
// import { loadModules } from "esri-loader";
import { MapLayer } from '@app/core';
const esriLoader = require('esri-loader');

@Component({
  selector: 'app-arcgis-map',
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css']
})
export class ArcgisMapComponent implements AfterViewInit {

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  view: any;

  @Input() center: [number, number];
  @Input() zoom: number;
  @Input() layers: MapLayer[];

  constructor() { }

  initializeMap() {
    const url = 'https://js.arcgis.com/4.7/';
    esriLoader.loadCss(`${url}esri/css/main.css`)
    // esri-loader options
    const options = { url };
    esriLoader.loadModules(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], options)
      .then(([Map, MapView, FeatureLayer]) => { 
     try {
       // Configure the Map
       const mapProperties = {
         basemap: "satellite"
       } ;
       var featureLayer = new FeatureLayer({
        url:
          "https://services.arcgis.com/HQ0xoN0EzDPBOEci/arcgis/rest/services/dod/FeatureServer"
      });
       const map = new Map(mapProperties);

       map.add(featureLayer);
       // Initialize the MapView
       const mapViewProperties = {
         container: this.mapViewEl.nativeElement,
         center: this.center,
         zoom: 10,
         map: map
       };

       this.view = new MapView(mapViewProperties);

       return this.view;
     } catch (error) {
       console.log("EsriLoader: ", error);
     }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }

}
