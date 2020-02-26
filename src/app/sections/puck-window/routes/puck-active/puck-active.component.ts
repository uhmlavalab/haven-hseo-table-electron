import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ArService, ProjectableMarker } from '@app/input';

@Component({
  selector: 'app-puck-active',
  templateUrl: './puck-active.component.html',
  styleUrls: ['./puck-active.component.css']
})
export class PuckActiveComponent implements AfterViewInit {
/* HTML elements that are projected onto the pucks */
@ViewChild('trackingDotYear', { static: false }) trackingDotYear;
@ViewChild('trackingDotLayer', { static: false }) trackingDotLayer;
@ViewChild('trackingDotScenario', { static: false }) trackingDotScenario;
@ViewChild('trackingDotAdd', { static: false }) trackingDotAdd;
@ViewChild('connectingLine', { static: false }) connectingLine; // The line that connects the Layer and Add pucks.

private trackingDots: any[] = [];     // Holds the view children

  constructor(  private arService: ArService) {
    
   }

    ngAfterViewInit(): void {
      this.trackingDots = [this.trackingDotYear]//, this.trackingDotLayer, this.trackingDotScenario, this.trackingDotAdd];

    this.arService.trackingSubject.subscribe({
      next: value => {
        this.trackingDots.forEach(dot => dot.nativeElement.style.opacity = 0);
        value.forEach(marker => this.track(marker));
      }
    });
  }

  /** Tracks the marker on the table
   * @param marker The marker to be tracked.
   */
  private track(marker: ProjectableMarker) {
    try {
      const dataPoint = { x: null, y: null };
      dataPoint.x = marker.getMostRecentCenterX();
      dataPoint.y = marker.getMostRecentCenterY();

      let element = null;
      console.log(marker);
      if (dataPoint.x !== null) {
        switch (marker.getJob()) {
          case 'year':
            element = this.trackingDotYear.nativeElement;
            break;
          case 'layer':
            element = this.trackingDotLayer.nativeElement;
            break;
          case 'scenario':
            element = this.trackingDotScenario.nativeElement;
            break;
          case 'add':
            element = this.trackingDotAdd.nativeElement;
            break;
        }
        element.style.opacity = 1;
        element.style.left = dataPoint.x + 25 + 'px';
        element.style.top = dataPoint.y + 25 + 'px';

      }

    } catch (error) {
      //undefined marker
      console.log(error);
    }
  }

  /** Draws a line between the layer puck element and the add puck element.
   * Both of the pucks have to be detected and live for the line to be drawn.
   * @param layer the native element of the layer puck
   * @param add the native element of the add puck.
   */
  private connectLayerAndAdd(layer, add) {

    const layerMarker = ProjectableMarker.getProjectableMarkerByJob('layer');
    const addMarker = ProjectableMarker.getProjectableMarkerByJob('add');

    const layerRect = layer.getBoundingClientRect();
    const xOffset = layerRect.width / 2;
    const yOffset = layerRect.height / 2;

    const layerPosition = { x: layerMarker.getMostRecentCenterX(), y: layerMarker.getMostRecentCenterY() };
    const addPosition = { x: addMarker.getMostRecentCenterX(), y: addMarker.getMostRecentCenterY() };

    if (layerPosition.x === null || addPosition.x === null) {
      this.connectingLine.nativeElement.style.opacity = 0;
    } else {
      const adjacent = this.getAdjacent(addPosition.x, layerPosition.x);
      const opposite = this.getOpposite(addPosition.y, layerPosition.y);
      const hypotenuse = this.getHypotenuse(adjacent, opposite); // This is the width of the div
      let theta = this.getTheta(opposite, adjacent);
      theta = this.convertRadsToDegrees(theta);
      const quadrant = this.getQuadrant(addPosition.x - layerPosition.x, addPosition.y - layerPosition.y);
      theta = this.adjustTheta(theta, quadrant);
      this.moveLine(this.connectingLine.nativeElement, theta, hypotenuse, layerPosition.x + xOffset + 25, layerPosition.y + 25);
    }
  }

  /** Moves the line that connects the layer select and activate pucks.
   * @param element The line element
   * @param theta The theta angle of the triangle.
   * @param width the length of the line (width of the triangle)
   * @param x starting point x position
   * @param y starting point y position
   */
  private moveLine(element, theta, width, x, y) {
    element.style.opacity = 1;
    element.style.width = `${width}px`;
    element.style.left = `${x + 15}px`;
    element.style.top = `${y}px`;
    element.style.transform = `rotate(-${theta}deg)`;
    element.style.backgroundColor = 'white';//this.planService.getSelectedLayer().legendColor;
    setTimeout(() => {
      element.style.opacity = 0;
    }, 500);
  }

  /* Math/Trig Functions */
  /** Adjusts the angle calculation depending on quadrant
   * @theta the angle as calculated by the arc tan function
   * @quadrant the quadrant of the unit circle
   */
  public adjustTheta(theta, quadrant) {
    theta = theta;
    if (quadrant === 2) {
      theta = 180 - theta;
    } else if (quadrant === 3) {
      theta = 180 + theta;
    } else if (quadrant === 4) {
      theta = 360 - theta;
    }
    return theta;
  }

  /** Get the quadrant of the unit circle
   * @param x the distance from the origin along x axis
   * @param y the distance from the origin along the y axis
   */
  public getQuadrant(x: number, y: number) {
    let quadrant = 0;
    if (x <= 0 && y <= 0) {
      quadrant = 2;
    } else if (x > 0 && y <= 0) {
      quadrant = 1;
    } else if (x >= 0 && y > 0) {
      quadrant = 4;
    } else {
      quadrant = 3;
    }
    return quadrant;
  }
  public convertRadsToDegrees(theta): number {
    return theta * (180 / Math.PI);
  }

  public getTheta(opposite: number, adjacent: number): number {
    return Math.atan(opposite / adjacent);
  }

  public getAdjacent(a: number, b: number): number {
    return Math.abs(a - b);
  }

  public getOpposite(a: number, b: number): number {
    return Math.abs(a - b);
  }

  public getHypotenuse(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }


}
