import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MapLayer } from '@app/core';

export interface LegendItem  {
  name: string;
  color: string;
}

@Component({
  selector: 'app-layer-info',
  templateUrl: './layer-info.component.html',
  styleUrls: ['./layer-info.component.css']
})
export class LayerInfoComponent implements OnInit, OnChanges {

  @Input() mapLayer: MapLayer;
  layerName = 'Agriculture';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.mapLayer) {
      this.mapLayer = changes.mapLayer.currentValue;
    }
  }

}
