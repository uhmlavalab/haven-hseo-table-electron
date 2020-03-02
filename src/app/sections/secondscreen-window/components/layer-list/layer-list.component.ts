import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MapLayer } from '@app/core';

@Component({
  selector: 'app-layer-list',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.css']
})
export class LayerListComponent implements OnInit, OnChanges {

  @Input() layers: MapLayer[];
  @Input() selectedLayer: MapLayer;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedLayer) {
      this.selectedLayer = changes.selectedLayer.currentValue;
    }
  }

}
