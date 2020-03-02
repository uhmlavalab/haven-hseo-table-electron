import { Component, AfterViewInit, ViewChildren, ViewChild, Input, SimpleChanges } from '@angular/core';
import { PlanService, MapLayer } from '@app/core';
import { ProjectableMarker } from '../../classes/ProjectableMarker';

@Component({
  selector: 'app-layer-puck',
  templateUrl: './layer-puck.component.html',
  styleUrls: ['./layer-puck.component.css']
})
export class LayerPuckComponent extends ProjectableMarker implements AfterViewInit {

  @ViewChildren('iconContainer') icons;
  @ViewChildren('slideIconContainer') slideIcons;
  @ViewChild('iconContainer', { static: false }) iconContainer;
  @ViewChild('layerPuckContainer', { static: false }) puckContainer;

  @Input() mapLayers: MapLayer[];
  @Input() selectedLayer: MapLayer;

  private iconImages: { icon: string, text: string, image: string, active: boolean, color: string }[] = [];
  private currentIconIndex: number;
  private iconElements: any[] = [];
  private currentPosition: number;
  private angle: number;
  private addRemove: string;

  constructor(private planService: PlanService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedLayer) {
      this.selectedLayer = changes.selectedLayer.currentValue;
    }
  }

  ngAfterViewInit() {
    this.iconElements = this.icons.first.nativeElement.children;
    this.positionElements(this.iconElements);
  }

  private positionElements(elements) {
    const iconCount = elements.length;
    this.angle = 360 / iconCount;
    this.currentPosition = 0;

    for (const e of elements) {
      e.style.transform = `rotate(-${this.currentPosition}deg) translate(65px) rotate(90deg)`;
      this.currentPosition += this.angle;
    };

    this.iconContainer.nativeElement.style.transform = 'rotate(-90deg)';
    this.currentPosition = -90;
  }

  private cycle(direction: string) {
    if (direction === 'increment') {
      this.iconContainer.nativeElement.style.transform = `rotate(${this.currentPosition + this.angle}deg)`;
      this.currentPosition += this.angle;
      this.incrementCurrentIconIndex();
    } else {
      this.iconContainer.nativeElement.style.transform = `rotate(${this.currentPosition - this.angle}deg)`;
      this.currentPosition -= this.angle;
      this.decrementCurrentIconIndex();
    }
  }

  private decrementCurrentIconIndex() {
    if (this.currentIconIndex === 0) {
      this.currentIconIndex = this.iconImages.length - 1;
    } else {
      this.currentIconIndex--;
    }
  }

  private incrementCurrentIconIndex() {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.iconImages.length;
  }

}
