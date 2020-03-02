import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PuckService, ProjectableMarker, LayerPuckComponent, YearPuckComponent } from '@app/input';
import { PlanService, MapLayer, ElectronService, AppInput } from '@app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-puck-view',
  templateUrl: './puck-view.component.html',
  styleUrls: ['./puck-view.component.css']
})
export class PuckViewComponent implements AfterViewInit {

  @ViewChild('yearPuck', { static: false }) YearPuck: YearPuckComponent;
  @ViewChild('yearPuck', { static: false, read: ElementRef }) YearDiv: ElementRef;
  yearId = 384;
  yearMinRot = 10;
  yearDelay = 30;
  minYear = 2016;
  maxYear = 2045;
  currentYear = 2016;

  @ViewChild('layerPuck', { static: false }) LayerPuck: LayerPuckComponent;
  @ViewChild('layerPuck', { static: false, read: ElementRef }) LayerDiv: ElementRef;
  mapLayers: MapLayer[];
  selectedLayer: MapLayer;
  layerDelay = 400;
  layerMinRot = 10;
  layerId = 5;

  pucks: { marker: ProjectableMarker, div: ElementRef }[] = [];
  markersSub: Subscription;

  yearSubscription: Subscription;

  constructor(private puckService: PuckService, private planService: PlanService, private electronService: ElectronService) {
    this.puckService.resetMarkersandVideos();
    this.mapLayers = this.planService.getMapLayers();
    this.selectedLayer = this.planService.getCurrentLayer();
  }

  ngAfterViewInit(): void {

    this.pucks.push({ marker: this.YearPuck, div: this.YearDiv });
    this.pucks.push({ marker: this.LayerPuck, div: this.LayerDiv });

    this.puckService.addMarker(this.YearPuck);
    this.puckService.addMarker(this.LayerPuck);

    this.markersSub = this.puckService.markersSubject.subscribe(value => {
      value.forEach(marker => {
        const puck = this.pucks.find(element => element.marker.markerId == marker.markerId);
        if (puck) {
          puck.marker.updatePosition(puck.div);
        }
      });
    });

    this.yearSubscription = this.planService.currentYearSub.subscribe(year => {
      this.currentYear = year;
    })

    this.planService.currentLayerSub.subscribe(layer => {
      this.selectedLayer = layer;
    });

  }

  ngOnDestroy() {
    this.puckService.resetMarkersandVideos();
    this.markersSub.unsubscribe();
    this.yearSubscription.unsubscribe();
  }

  yearDecrease() {
    this.electronService.appInput(AppInput.down);
  }

  yearIncrease() {
    this.electronService.appInput(AppInput.up);
  }

  layerDecrease() {
    this.electronService.appInput(AppInput.minus);
  }

  layerIncrease() {
    this.electronService.appInput(AppInput.plus);
  }

  // /** Draws a line between the layer puck element and the add puck element.
  //  * Both of the pucks have to be detected and live for the line to be drawn.
  //  * @param layer the native element of the layer puck
  //  * @param add the native element of the add puck.
  //  */
  // private connectLayerAndAdd(layer, add) {

  //   const layerMarker = ProjectableMarker.getProjectableMarkerByJob('layer');
  //   const addMarker = ProjectableMarker.getProjectableMarkerByJob('add');

  //   const layerRect = layer.getBoundingClientRect();
  //   const xOffset = layerRect.width / 2;
  //   const yOffset = layerRect.height / 2;

  //   const layerPosition = { x: layerMarker.getMostRecentCenterX(), y: layerMarker.getMostRecentCenterY() };
  //   const addPosition = { x: addMarker.getMostRecentCenterX(), y: addMarker.getMostRecentCenterY() };

  //   if (layerPosition.x === null || addPosition.x === null) {
  //     this.connectingLine.nativeElement.style.opacity = 0;
  //   } else {
  //     const adjacent = this.getAdjacent(addPosition.x, layerPosition.x);
  //     const opposite = this.getOpposite(addPosition.y, layerPosition.y);
  //     const hypotenuse = this.getHypotenuse(adjacent, opposite); // This is the width of the div
  //     let theta = this.getTheta(opposite, adjacent);
  //     theta = this.convertRadsToDegrees(theta);
  //     const quadrant = this.getQuadrant(addPosition.x - layerPosition.x, addPosition.y - layerPosition.y);
  //     theta = this.adjustTheta(theta, quadrant);
  //     this.moveLine(this.connectingLine.nativeElement, theta, hypotenuse, layerPosition.x + xOffset + 25, layerPosition.y + 25);
  //   }
  // }

  // /** Moves the line that connects the layer select and activate pucks.
  //  * @param element The line element
  //  * @param theta The theta angle of the triangle.
  //  * @param width the length of the line (width of the triangle)
  //  * @param x starting point x position
  //  * @param y starting point y position
  //  */
  // private moveLine(element, theta, width, x, y) {
  //   element.style.opacity = 1;
  //   element.style.width = `${width}px`;
  //   element.style.left = `${x + 15}px`;
  //   element.style.top = `${y}px`;
  //   element.style.transform = `rotate(-${theta}deg)`;
  //   element.style.backgroundColor = 'white';//this.planService.getSelectedLayer().legendColor;
  //   setTimeout(() => {
  //     element.style.opacity = 0;
  //   }, 500);
  // }





}
