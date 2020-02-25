import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/core';

@Component({
  selector: 'app-map-element',
  templateUrl: './map-element.component.html',
  styleUrls: ['./map-element.component.css']
})

export class MapElementComponent implements OnInit {

  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;
  @Input('width') width: number;
  @Input('bounds') bounds: [[number, number], [number, number]];
  @Input('baseImage') baseImage: string;
  height: number;
  aspectRatio: number;
  rasterBounds: any[];

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  constructor() {}

  ngOnInit() {
    const x = Math.abs(this.bounds[0][0] - this.bounds[1][0]);
    const y = Math.abs(this.bounds[0][0] - this.bounds[1][0]);
    this.aspectRatio = x / y;
    this.height = this.width / this.aspectRatio;

    this.projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.map.append('image')
      .attr('xlink:href', `${this.baseImage}`)
      .attr('width', this.width)
      .attr('height', this.height);

    const maplayer = '../../../../../assets/plans/oahu/layers/dod.json';

    d3.json(maplayer, (error, geoData) => {
      const bounds = [this.projection(this.bounds[0]), this.projection(this.bounds[1])];
      const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
      const transform = [
        (this.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
        (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2
      ] as [number, number];

      const proj = d3.geo.mercator()
        .scale(scale)
        .translate(transform);

      const path = d3.geo.path()
        .projection(proj);

      const layer = { parcels: [] };
      this.map.selectAll('dod')
        .data(geoData.features)
        .enter().append('path')
        .attr('d', path)
        .attr('class', 'dod')
        .each(function (d) {
          layer.parcels.push({ path: this, properties: (d.hasOwnProperty(`properties`)) ? d[`properties`] : null } as Parcel);
        }).call(() => {
          this.defaultFill(layer);
        });
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.width && this.map) {
      this.resizeMap(changes.width.currentValue);
    }
  }

  private resizeMap(newWidth: number) {
    this.width = newWidth;
    this.height = this.width / this.aspectRatio;
    this.map.attr("width", this.width);
    this.map.attr("height", this.height);
    this.map.select('image').attr("width", this.width);
    this.map.select('image').attr("height", this.height);

    const bounds = [this.projection(this.bounds[0]), this.projection(this.bounds[1])];
    const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
    const transform = [
      (this.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2
    ] as [number, number];
    const proj = d3.geo.mercator()
      .scale(scale)
      .translate(transform);

    const path = d3.geo.path().projection(proj);
    this.map.selectAll('path').attr('d', path);
  }

  defaultFill(layer: any) {
    console.log(layer);
    layer.parcels.forEach(el => {
      d3.select(el.path)
        .style('fill', 'red')
        .style('opacity', true ? 0.85 : 0.0)
        .style('stroke', 'white')
        .style('stroke-width', 1 + 'px');
    });
  }
}
