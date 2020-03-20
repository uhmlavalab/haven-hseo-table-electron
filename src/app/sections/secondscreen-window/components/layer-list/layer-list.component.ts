import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MapLayer } from '@app/core';

@Component({
  selector: 'app-layer-list',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.css']
})
export class LayerListComponent implements OnInit, OnChanges {

  @Input() layers: MapLayer[];
  @Input() selectedLayer: MapLayer;
  @ViewChild('gridcontainer', {static: true}) gridDiv: ElementRef;

  constructor() { }

  ngOnInit(): void {
    let numLayers = ''
    this.layers.forEach(el => {
      numLayers += 'auto '
    })
    console.log(numLayers);
    this.gridDiv.nativeElement.style.gridTemplateColumns = numLayers;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedLayer) {
      this.selectedLayer = changes.selectedLayer.currentValue;
    }
  }

}
