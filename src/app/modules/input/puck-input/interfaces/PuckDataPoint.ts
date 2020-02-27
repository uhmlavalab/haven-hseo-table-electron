import { ProjectableMarker } from "../classes/ProjectableMarker";

export interface PuckDataPoint {
    marker: ProjectableMarker,
    corners: any[],
    center: {x: number, y: number},
    convertedPoints: any,
    cameraId: number
}