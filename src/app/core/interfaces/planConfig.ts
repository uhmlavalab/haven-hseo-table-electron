import { ElementPosition } from "./elementPosition";
import { ElementSize } from "./elementSize";

export interface PlanConfig {
  css: {
    mapwindow: {
      map: {
        position: ElementPosition,
        size: ElementSize,
      },
      linechart: {
        position: ElementPosition,
        size: ElementSize,
      },
      piechart: {
        position: ElementPosition,
        size: ElementSize,
      },
      textlabel: {
        position: ElementPosition,
        size: number
      }
    },
    secondwindow: {
      map: {
        position: ElementPosition,
        size: ElementSize,
      },
      legend: {
        position: ElementPosition,
        size: ElementSize
      },
      layerdetails: {
        position: ElementPosition,
        size: ElementSize
      }
    }
  }
}