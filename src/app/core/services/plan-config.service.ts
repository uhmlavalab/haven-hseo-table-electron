import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Subject } from 'rxjs';

export interface PlanConfig {
  puckWindowWidth: number,
  defaultTrackingPoints: {
    offsets: {
      xOffset: number,
      yOffset: number,
      xOffset2: number,
      yOffset2: number,
    },
    trackingPoints: [
      {
        cam2X: number,
        cam2Y: number,
        camX: number,
        camY: number,
        mapX: number,
        mapY: number,
      },
      {
        cam2X: number,
        cam2Y: number,
        camX: number,
        camY: number,
        mapX: number,
        mapY: number,
      },
      {
        cam2X: number,
        cam2Y: number,
        camX: number,
        camY: number,
        mapX: number,
        mapY: number,
      },
      {
        cam2X: number,
        cam2Y: number,
        camX: number,
        camY: number,
        mapX: number,
        mapY: number,
      },
      {
        cam2X: number,
        cam2Y: number,
        camX: number,
        camY: number,
        mapX: number,
        mapY: number,
      },
      {
        cam2X: number,
        cam2Y: number,
        camX: number,
        camY: number,
        mapX: number,
        mapY: number,
      },
    ]
  },
  plans: {
    oahu: {
      css: {
        mapwindow: {
          map: {
            position: { x: number, y: number },
            size: { width: number, height: number },
          },
          linechart: {
            position: { x: number, y: number },
            size: { width: number, height: number },
          },
          piechart: {
            position: { x: number, y: number },
            size: { width: number, height: number },
          },
          textlabel: {
            position: { x: number, y: number },
            size: number
          }
        },
        secondwindow: {
          map: {
            position: { x: number, y: number },
            size: { width: number, height: number },
          },
          legend: {
            position: { x: number, y: number },
            size: { width: number, height: number }
          },
          layerdetails: {
            position: { x: number, y: number },
            size: { width: number, height: number }
          }
        }
      }
    }
  }
};


@Injectable({
  providedIn: 'root'
})
export class PlanConfigService {

  private configFile: PlanConfig;
  public configSub = new Subject<PlanConfig>();

  constructor() {
    ipcRenderer.on('send-config', (event, message) => {
      this.configFile = message.configFile;
      this.configSub.next(this.configFile);
    });
  }

  public getConfigFile() {
    return this.configFile;
  }

  private saveConfigFile() {
    ipcRenderer.send('save-config', { configFile: this.configFile });
  }

  public updateConfigfile(newConfig: PlanConfig) {
    this.configFile = newConfig;
    this.saveConfigFile();
  }

  public setTrackingPoints(points: any) {
    this.configFile.defaultTrackingPoints = points;
    this.updateConfigfile(this.configFile);
  }

}
