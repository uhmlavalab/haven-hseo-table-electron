import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Parcel, ElementSize, MapLayer, PlanService } from '@app/core';

@Component({
  selector: 'app-map-element',
  templateUrl: './map-element.component.html',
  styleUrls: ['./map-element.component.css']
})

export class MapElementComponent implements OnInit {

  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;
  @Input() size: ElementSize;
  @Input() bounds: [[number, number], [number, number]];
  @Input() baseImage: string;
  @Input() mapLayers: MapLayer[];
  @Input() planService: PlanService;

  aspectRatio: number;
  rasterBounds: any[];

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;


  constructor() { }

  ngOnInit() {
    const x = Math.abs(this.bounds[0][0] - this.bounds[1][0]);
    const y = Math.abs(this.bounds[0][0] - this.bounds[1][0]);
    this.aspectRatio = x / y;
    this.size.height = this.size.width / this.aspectRatio;

    this.projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.size.width)
      .attr('height', this.size.height);

    this.map.append('image')
      .attr('xlink:href', `${this.baseImage}`)
      .attr('width', this.size.width)
      .attr('height', this.size.height);

    this.mapLayers.forEach(mapLayer => {
      mapLayer.active = false;
      d3.json(mapLayer.filePath, (error, geoData) => {
        const bounds = [this.projection(this.bounds[0]), this.projection(this.bounds[1])];
        const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.size.width, (bounds[1][1] - bounds[0][1]) / this.size.height);
        const transform = [
          (this.size.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
          (this.size.height - scale * (bounds[1][1] + bounds[0][1])) / 2
        ] as [number, number];

        const proj = d3.geo.mercator()
          .scale(scale)
          .translate(transform);

        const path = d3.geo.path()
          .projection(proj);


        this.map.selectAll(mapLayer.name)
          .data(geoData.features)
          .enter().append('path')
          .attr('d', path)
          .attr('class', mapLayer.name)
          .each(function (d) {
            mapLayer.parcels.push({ path: this, properties: (d.hasOwnProperty(`properties`)) ? d[`properties`] : null } as Parcel);
          }).call(() => {
            if (mapLayer.setupFunction !== null) {
              mapLayer.setupFunction(this.planService);
            } else {
              this.defaultFill(mapLayer);
            }
          });
      });
    })

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.size && this.map) {
      this.resizeMap(changes.size.currentValue);
    }
  }

  updateLayers() {
    this.mapLayers.forEach(layer => {
      if (layer.updateFunction !== null) {
        layer.updateFunction(this.planService);
      } else {
        this.defaultFill(layer);
      }
    })
  }

  private resizeMap(newSize: ElementSize) {
    this.size.width = newSize.width;
    this.size.height = this.size.width / this.aspectRatio;
    this.map.attr("width", this.size.width);
    this.map.attr("height", this.size.height);
    this.map.select('image').attr("width", this.size.width);
    this.map.select('image').attr("height", this.size.height);

    const bounds = [this.projection(this.bounds[0]), this.projection(this.bounds[1])];
    const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.size.width, (bounds[1][1] - bounds[0][1]) / this.size.height);
    const transform = [
      (this.size.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (this.size.height - scale * (bounds[1][1] + bounds[0][1])) / 2
    ] as [number, number];
    const proj = d3.geo.mercator()
      .scale(scale)
      .translate(transform);

    const path = d3.geo.path().projection(proj);
    this.map.selectAll('path').attr('d', path);
  }

  defaultFill(layer: MapLayer) {
    layer.parcels.forEach(el => {
      d3.select(el.path)
        .style('fill', layer.fillColor)
        .style('opacity', layer.active ? 0.85 : 0.0)
        .style('stroke', 'white')
        .style('stroke-width', 1 + 'px');
    });
  }


}
