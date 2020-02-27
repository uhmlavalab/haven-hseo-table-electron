import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PuckService, ProjectableMarker } from '@app/input';
import { YearPuckComponent } from 'src/app/modules/input/puck-input/components/year-puck/year-puck.component';
import { ElectronService, AppInput } from '@app/core';

@Component({
  selector: 'app-puck-view',
  templateUrl: './puck-view.component.html',
  styleUrls: ['./puck-view.component.css']
})
export class PuckViewComponent implements AfterViewInit {
  /* HTML elements that are projected onto the pucks */
  @ViewChild('trackingDotYear', { static: false }) trackingDotYear;
  @ViewChild('trackingDotLayer', { static: false }) trackingDotLayer;
  @ViewChild('trackingDotScenario', { static: false }) trackingDotScenario;
  @ViewChild('trackingDotAdd', { static: false }) trackingDotAdd;
  @ViewChild('connectingLine', { static: false }) connectingLine; // The line that connects the Layer and Add pucks.


  @ViewChild('yearPuck', {static: false}) YearPuck: YearPuckComponent;
  @ViewChild('yearPuckDiv', {static: false}) YearDiv: ElementRef
  yearId = 384;
  yearJob = 'year';
  yearMinrot = 10;
  yearDelay = 30;

  constructor(private puckService: PuckService, private electronService: ElectronService) {

  }

  ngAfterViewInit(): void {
    this.puckService.addMarker(this.YearPuck);
    this.puckService.markersSubject.subscribe({
      next: value => {
        value.forEach(marker => marker.updatePosition(this.YearDiv));
      }
    });
  }

  rotateLeft() {
    this.electronService.appInput(AppInput.left);
  }

  rotateRight() {
    this.electronService.appInput(AppInput.right);
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
