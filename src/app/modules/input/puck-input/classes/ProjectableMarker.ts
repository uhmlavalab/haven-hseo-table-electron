import { _ } from 'underscore';
import { InputService } from '../../services/input.service';
import { Input, Output, EventEmitter } from '@angular/core';
import { PuckDataPoint } from '../interfaces/PuckDataPoint';


/** Represents a projectable marker.  These are the tangibles that control
*   The user interaction with the table.  Each projectable marker is connected
*   to a arucojs marker by the markerId number */
export class ProjectableMarker {
  
  @Input() markerId: number;
  @Input() job: string;
  @Input() minRotation: number;
  @Input() delay: number;

  @Output() rotateLeft = new EventEmitter();
  @Output() rotateRight = new EventEmitter();
  rotatedLeft () { this.rotateLeft.emit(true) };
  rotatedRight () { this.rotateRight.emit(true) };;

  /* private static variables */
  private MAX_HISTORY = 40;                                   // Length of array holding historical position data.
  private MAX_ROTATION_DEGREES = 300;                         // If rotation is larger than this, it is ignored.

  private dataPoints: {point: PuckDataPoint, used: boolean}[] = [];            // All movement data is stored in this array.
  private enabled: boolean;           // True, ready to do job, false, wait for delay to elapse.

  private leftPosition: number;
  private rightPosition: number;



  constructor() {
    this.enabled = true;
  }

  /**************************************************************************************************
   * ************************************************************************************************
   * ************************ Getters and Setters ************************************************
   * ************************************************************************************************
   * ************************************************************************************************
   * */

  /** Sets the job
   * @param job the job to assign to this marker.
   */
  public setJob(job: string): void {
    this.job = job;
  }

  /** Gets the marker's job
   * @return the marker's job
   */
  public getJob(): string {
    return this.job;
  }

  public getId(): number {
    return this.markerId;
  }

  /** Gets the movement data for this marker.
   * @return an Array of movement datapoints
   */
  private getMovementData(): any[] {
    const movementData = [];
    this.dataPoints.forEach((point, index) => {
      if (point !== null && !point.used) {
        movementData.push({
          corners: point.point.corners,
          camera: point.point.cameraId,
          location: index
        });
      }
    });
    return movementData;
  }

  /** Sets the markerId number
    * @param id => the new Id number
    * @return the markerId number
    */
  public setMarkerId(id) {
    this.markerId = id;
  }

  /**
  * Gets the center X position of the marker.
  * @param corners The corners of the marker.
  * @return x center.
  */
  public getCenterX(corners) {
    if (corners !== undefined) {
      return (corners[0].x + corners[2].x) * 0.5;
    } else {
      return null;
    }
  }

  /**
   * Gets the center Y position of the marker
   * @param corners The corners of the marker.
   * @return y center.
   */
  public getCenterY(corners) {
    if (corners !== undefined) {
      return (corners[0].y + corners[2].y) * 0.5;
    } else {
      return null;
    }
  }

  /**  Finds the most recent location coordinates and returns the x position of the center of the marker.
   * @return the x coordinate of the marker.
  */
  public getMostRecentCenterX() {
    const point = _.find(this.dataPoints, point => point !== null);
    if (point !== undefined) {
      return this.getCenterX(point.point.corners);
    } else {
      return null;
    }
  }

  /**Finds the most recent location coordinates and returns the center y position
   * @return the y position of the marker in map coordinates.
   */
  public getMostRecentCenterY() {
    const point = _.find(this.dataPoints, point => point !== null);
    if (point !== undefined) {
      return this.getCenterY(point.point.corners);
    } else {
      return null;
    }

  }

  /** ***********************************************************************************************
   * ************************************************************************************************
   * ************************ MARKER MOVEMENT AND ROTATION FUNCTIONS ********************************
   * ************************************************************************************************
   * ************************************************************************************************
  */


  /** Checks to see if the maker has been rotated. 
   * @return true if rotated, false if not.
  */
  public wasRotated(): void {
    if (this.enabled) {
      const data = this.getMovementData();

      // If there are not at least 2 datapoints, then the marker was not moved or just placed.
      if (data.length > 7) {
        const movementData = this.getDistanceMoved(data);
        const y = movementData.y;
        const x = movementData.x;

        // Check to see if the x and y positions are at least 1 pixel different than the previous position.
        if (y > 1 && x > 1) {
          const direction = this.calcDirection(data);
          if (direction === 'left') {
            this.rotatedLeft();
            this.disable();
          } else if (direction === 'right') {
            this.rotatedRight();
            this.disable();
          }
        }
      }
    }
  }

  /** Checks to see if a marker has been moved since the last check
   * @return true if the marker was moved, false if not.
   */
  public wasMoved(): boolean {
    const movementData = this.getMovementData();
    // Check to see if there is a previous to compare data with.  If not, couldn't have moved.
    if (movementData.length < 5) {
      return false;
    } else {
      if (movementData[0].corners[0].x !== movementData[1].corners[0].x) {
        if (!this.wasRepositioned(movementData)) {
          return true;
        }
      }
    }
  }

  /** Checks to see if the marker was repositioned. Max movement of 4 is allowed. 
   * @param data The movement data in map coordinates.
   * @return false if not repositioned, true if repositioned.
   */
  private wasRepositioned(data: any[]): boolean {
    const movementData = this.getDistanceMoved(data);
    const y = movementData.y;
    const x = movementData.x;

    if ((x > 1 && x < 40) || (y > 1 && y < 40)) {
      return false;
    }
    else {
      return true;
    }
  }

  /** Determines how far the marker as moved.
   * @param data the marker's position data.
   * @return distances moved in the x and y directions.
   */
  private getDistanceMoved(data: any[]): { x: number, y: number } {
    return { x: Math.abs(data[0].corners[0].y - data[1].corners[0].y), y: Math.abs(data[0].corners[0].y - data[1].corners[0].y) };
  }

  /** Calculates the rotation of the marker
  * @return the rotation in degrees
  */
  private calcRotation(corners) {

    let cX = this.getCenterX(corners);
    let cY = this.getCenterY(corners);

    const x = corners[0].x;
    const y = corners[0].y;

    let rotation = Math.atan((cY - y) / (x - cX));

    // If rotation is a negative number and x is positive, then we are dealing with Q4 
    if (rotation < 0 && y > cY) {
      rotation = (2 * Math.PI + rotation);
    } else if (x < cX && y < cY) { // Q II
      if (rotation < 0) rotation = (rotation + Math.PI);
      else rotation = rotation + Math.PI / 2;
    } else if (x < cX && y > cY) { // Q III
      if (rotation < 0) rotation = (rotation + 3 * Math.PI / 2);
      else rotation = rotation + Math.PI;
    }
    rotation -= Math.PI * 2;
    // Rotation is reversed.  To calculate correct rotation
    return -this.convertRadiansToDegrees(rotation);
  }

  /** Converts Radians to degrees
  * @param angle => The angle to convert in radians
  * @return the angle in degrees
  */
  private convertRadiansToDegrees(angle) {
    return angle * 180 / Math.PI;
  }

  /** Calculate the direction that the marker was turned.
  * @return the direction that it was turned
  */
  private calcDirection(data) {

    const rotations = [];
    data.forEach(point => {
      if (!point.used) {
        rotations.push(this.calcRotation(point.corners));
        point.used = true;
      }
    });

    let diff = 0;

    let length = 6;

    if (rotations.length < 7) {
      length = rotations.length
    }
    for (let i = 0; i < length; i++) {
      const total = (rotations[i] - rotations[i + 1]);
      if (Math.abs(total) < 200) {
        diff += (rotations[i] - rotations[i + 1]);
      }
    }

    if (diff < -this.minRotation) {
      return 'left';
    } else if (diff > this.minRotation) {
      return 'right';
    } else {
      return 'none;'
    }
  }


  /*******************************************************************************************************
   * *****************************************************************************************************
   * ************************ OTHER FUNCTIONS ************************************************************
   * *****************************************************************************************************
   */

  /** Disables the rotation function for a psecified amount of time to prevent mutiple
   * actions in a row.
   */
  private disable(): void {
    this.enabled = false;
    setTimeout(() => {
      this.enabled = true;
    }, this.delay);
  }

  /** Adds a data point to the array of data.  If the marker was not detected, a null is added.
   * @param point The location and camera data for the marker.
   */
  public addDataPoint(point: PuckDataPoint) {
    if (point !== undefined) {
      if (!this.seenInOtherCamera(point.cameraId)) {
        this.dataPoints.unshift({ point: point, used: false });
      } else {
        this.dataPoints.unshift(null);
      }
    } else {
      this.dataPoints.unshift(null);
    }

    // Remove the last point when you fill the array.
    if (this.dataPoints.length > this.MAX_HISTORY) {
      this.dataPoints.pop();
    }

  }

  /** Checks to see if the markers is visible in the other camera by checking the previously stored points. 
   * This is to prevent rapid switching back and forth (flickering) due to being tracked by more than one camera.
   * @param camera the camera that we are comparing with
   * @return true if the other camera is found, false if this marker is being tracked by this camera only
   */
  private seenInOtherCamera(camera: number): boolean {
    let seen = false;
    this.dataPoints.forEach((point, index) => {
      if (point !== null) {
        if ((index <= this.dataPoints.length * 0.2) && (point.point.cameraId !== camera)) {
          seen = true;
        }
      }
    });
    return seen;

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
}
