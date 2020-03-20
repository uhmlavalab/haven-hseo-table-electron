import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MapLayer } from '@app/core';

@Component({
  selector: 'app-layer-detail',
  templateUrl: './layer-detail.component.html',
  styleUrls: ['./layer-detail.component.css']
})
export class LayerDetailComponent implements OnInit {
  @Input() mapLayer: MapLayer;
  layerName = 'Agriculture';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mapLayer) {
      this.mapLayer = changes.mapLayer.currentValue;
    }
  }

}
