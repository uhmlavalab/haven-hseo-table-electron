import { Component, OnInit, Input } from '@angular/core';
import { MapLayer } from '@app/core';

@Component({
  selector: 'app-layer-legend',
  templateUrl: './layer-legend.component.html',
  styleUrls: ['./layer-legend.component.css']
})
export class LayerLegendComponent implements OnInit {
  @Input() mapLayer: MapLayer;
  constructor() { }

  ngOnInit(): void {
  }

}
