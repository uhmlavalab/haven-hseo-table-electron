import { _ } from 'underscore';
import { ArService } from '../services/ar.service';
import { InputService } from '../services/input.service';


/** Represents a projectable marker.  These are the tangibles that control
*   The user interaction with the table.  Each projectable marker is connected
*   to a arucojs marker by the markerId number */
export class ProjectableMarker {

  /* private static variables */
  private static projectableMarkers: object = {};                    // Markers are stored in an Object
  private static projectableMarkerArray: ProjectableMarker[] = [];   // Markers are also stored in an Array
  private static MAX_HISTORY = 40;                                   // Length of array holding historical position data.
  private static MAX_ROTATION_DEGREES = 300;                         // If rotation is larger than this, it is ignored.

  /* private member variables */
  private markerId: number;           // Id that cooresponds to arucojs marker
  private job: string;                // Job that cooresponds to job objects
  private delay: number;              // Time delay that that stops excessive rotation.
  private minRotation: number;        // Minimum rotation allowed before a job is done.
  private arService: ArService;
  private inputService: InputService;
  private dataPoints = [];            // All movement data is stored in this array.
  private enabled: boolean;           // True, ready to do job, false, wait for delay to elapse.
  private rotateLeft: any;            // Function called when rotated left
  private rotateRight: any;           // Function called when rotated right

  constructor(id: number,
    job: string,
    minRotation: number,
    delay: number,
    rotateLeft: any,
    rotateRight: any,
    arService: ArService,
    inputService: InputService) {

    this.markerId = id;
    this.job = job;
    this.minRotation = minRotation;
    this.delay = delay;
    this.rotateLeft = rotateLeft;
    this.rotateRight = rotateRight;
    this.arService = arService;
    this.inputService = inputService;
    ProjectableMarker.projectableMarkers[`${id}`] = this;
    ProjectableMarker.projectableMarkerArray.push(this);
    this.enabled = true;
  }


  /** **********************************************************************************************
   * ***************************** STATIC FUNCTIONS ************************************************
   * ***********************************************************************************************
   * ***********************************************************************************************
   */


  /** Gets all of the projectable markers in an array
   * @return Array of projectable marker objects.
   */
  public static getAllProjectableMarkersArray(): any[] {
    return ProjectableMarker.projectableMarkerArray;
  }

  /** Returns a single projectable marker object
  * @param id => The id of the marker to return
  * @return the marker whose id matches
  */
  public static getProjectableMarkerById(id: number) {
    return ProjectableMarker.projectableMarkers[`${id}`];
  }

  /** Returns a single projectable marker object
  * @param id => The id of the marker to return
  * @return the marker whose id matches
  */
  public static getProjectableMarkerByJob(job: string) {
    const marker = _.filter(ProjectableMarker.projectableMarkers, marker => marker.job === job);
    return marker[0];
  }

  /** Gets all projectable markers.  Key is the marker id
  * @return all markers
  */
  public static getAllProjectableMarkers() {
    return ProjectableMarker.projectableMarkers;
  }

  /** Checks to see if a marker is currently used with the program
   * @return false if marker is not active, true if it is.
   */
  public static isValidMarker(idNumber: number): boolean {
    if (ProjectableMarker.projectableMarkers[idNumber] === undefined) {
      return false;
    } else {
      return true;
    }
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

  /** Gets the movement data for this marker.
   * @return an Array of movement datapoints
   */
  private getMovementData(): any[] {
    const movementData = [];
    this.dataPoints.forEach((point, index) => {
      if (point !== null && !point.used) {
          movementData.push({
            corners: point.pointData.points,
            camera: point.pointData.camera,
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
    const corners = _.find(this.dataPoints, point => point !== null);
    if (corners !== undefined) {
      return this.getCenterX(corners.pointData.points);
    } else {
      return null;
    }
  }

  /**Finds the most recent location coordinates and returns the center y position
   * @return the y position of the marker in map coordinates.
   */
  public getMostRecentCenterY() {
    const corners = _.find(this.dataPoints, point => point !== null);
    if (corners !== undefined) {
      return this.getCenterY(corners.pointData.points);
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
            this.rotateLeft(this.inputService);
            this.disable();
          } else if (direction === 'right') {
            this.rotateRight(this.inputService);
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


  /** gets the current time of the system in milliseconds
  * @return the current time
  */
  private getCurrentTime() {
    const date = new Date();
    return date.getTime();
  }

  /** Calculate the direction that the marker was turned.
  * @return the direction that it was turned
  */
  private calcDirection(data) {

    const rotations = [];
    data.forEach( point => {
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
  public addDataPoint(point) {
    if (point !== undefined) {
      if (!this.seenInOtherCamera(point.camera)) {
        this.dataPoints.unshift({pointData: this.convertPointToMap(point), used: false});
      } else {
        this.dataPoints.unshift(null);
      }
    } else {
      this.dataPoints.unshift(null);
    }

    // Remove the last point when you fill the array.
    if (this.dataPoints.length > ProjectableMarker.MAX_HISTORY) {
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
        if ((index <= this.dataPoints.length * 0.2) && (point.pointData.camera !== camera)) {
          seen = true;
        }
      }
    });
    return seen;
    
  }

  /** Converts data points from the camera location coordinates to the map coordinates
   * @param point the data in cam coordinates
   * @return the converted coordinates.
   */
  private convertPointToMap(point) {
    const convertedPoints = [];
    point.corners.forEach(corner => {
      convertedPoints.unshift(this.arService.track(corner.x, corner.y, point.camera));
    });
    return {points: convertedPoints, camera: point.camera};
  }
}
