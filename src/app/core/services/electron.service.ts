import { Injectable, NgZone } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ElementPosition } from '../interfaces/elementPosition';
import { ElementSize } from '../interfaces/elementSize';

export enum AppRoutes {
  mainmenu = 'main-menu',
  planselection = 'plan-selection',
  calibration = 'calibration',
  view = 'view',
  exit = 'exit',
  restart = 'restart'
}

export enum AppInput {
  enter = 'enter',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  backward = 'backward',
  forward = 'forward'
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  windowName: string;
  windowMessageSubject = new BehaviorSubject<any>(null);

  rerouteSubject = new Subject<AppRoutes>();

  configFile: any;

  constructor(private router: Router, private ngZone: NgZone) {

    this.windowName = '';
    ipcRenderer.on('window-is-set', (event, message) => {
      if (message.windowName === 'secondscreen') {
        this.setAsSecondScreenWindow();
      } else if (message.windowName == 'map') {
        this.setAsMapWindow();
      } else if (message.windowName == 'puck') {
        this.setAsPuckWindow();
      }
    });
    ipcRenderer.send('is-window-set', {});
    ipcRenderer.on('send-config', (event, message) => {
      console.log(message);
      this.configFile = message.configFile;
    });
  }

  public setAsSecondScreenWindow() {
    if (!this.windowName) {
      this.windowName = 'secondscreen';
      ipcRenderer.removeListener('window-is-set', () => { });
      ipcRenderer.send('set-secondscreen-window');
      ipcRenderer.on('message-for-secondscreen-window', (event, message) => this.secondScreenMessage(event, message));
      this.ngZone.run(() => {
        this.router.navigate(['secondscreen-window']);
      });
    }
  }

  public setAsMapWindow() {
    if (!this.windowName) {
      this.windowName = 'map';
      ipcRenderer.removeListener('window-is-set', () => { });
      ipcRenderer.send('set-map-window');
      ipcRenderer.on('message-for-map-window', (event, message) => this.mapWindowMessage(event, message));
      this.ngZone.run(() => {
        this.router.navigate(['map-window']);
      });
    }
  }

  public setAsPuckWindow() {
    if (!this.windowName) {
      this.windowName = 'puck';
      ipcRenderer.removeListener('window-is-set', () => { });
      ipcRenderer.on('message-for-puck-window', (event, message) => this.puckWindowMessage(event, message));
      this.ngZone.run(() => {
        this.router.navigate(['puck-window']);
      });
    }
  }

  private mapWindowMessage(event: Electron.IpcRendererEvent, data: any) {
    this.resetCheck(data.reset);
    this.windowMessageSubject.next(data);
  }

  private secondScreenMessage(event: Electron.IpcRendererEvent, data: any) {
    this.resetCheck(data.reset);
    this.windowMessageSubject.next(data);
  }

  private puckWindowMessage(event: Electron.IpcRendererEvent, data: any) {
    this.resetCheck(data.reset);
    this.windowMessageSubject.next(data);
  }

  public sendMessage(data: any) {
    if (this.windowName == 'map') {
      ipcRenderer.send('message-to-secondscreen-window', data);
      ipcRenderer.send('message-to-puck-window', data);
    } else if (this.windowName == 'secondscreen') {
      ipcRenderer.send('message-to-map-window', data);
      ipcRenderer.send('message-to-puck-window', data);
    } else if (this.windowName == 'puck') {
      ipcRenderer.send('message-to-map-window', data);
      ipcRenderer.send('message-to-secondscreen-window', data);
    }
  }

  public resetAllWindows() {
    ipcRenderer.send('clear-window-selections', {});
  }

  private resetCheck(value: boolean) {
    if (value) {
      window.location.reload();
    }
  }

  public closeApplication() {
    ipcRenderer.send('close');
  }

  public shiftPuckScreenLeft() {
    ipcRenderer.send('shift-puck-screen', { direction: 'left' });
  }

  public shiftPuckScreenRight() {
    ipcRenderer.send('shift-puck-screen', { direction: 'right' });
  }

  public rerouteApp(route: AppRoutes) {
    if (route == AppRoutes.restart) {
      this.resetAllWindows();
      return;
    } else if (route == AppRoutes.exit) {
      this.exit();
      return;
    } else {
      this.sendMessage({ type: 'reroute', route: route });
      this.windowMessageSubject.next({ type: 'reroute', route: route });
    }
  }

  public appInput(input: AppInput) {
    this.sendMessage({ type: 'input', input: input })
  }

  public appStateUpdate(stateType) {

  }

  public exit() {
    ipcRenderer.send('close', null);
  }

  ////////
  public getMapScreenMapPosition(planName: string): ElementPosition {
    return this.configFile['plans'][planName]['css']['mapwindow']['map']['position'];
  }

  public setMapScreenMapPosition(planName: string, position: ElementPosition) {
    const path = ['plans', planName, 'css', 'mapwindow', 'map', 'position'];
    ipcRenderer.send('save-config-element', { path, value: position });
  }

  public getMapScreenMapSize(planName: string): ElementSize {
    return this.configFile['plans'][planName]['css']['mapwindow']['map']['size'];
  }

  public setMapScreenMapSize(planName: string, size: ElementSize) {
    const path = ['plans', planName, 'css', 'mapwindow', 'map', 'size'];
    ipcRenderer.send('save-config-element', { path, value: size });
  }


  //////////////
  public getMapScreenLineChartPosition(planName: string): ElementPosition {
    return this.configFile['plans'][planName]['css']['mapwindow']['linechart']['position'];
  }

  public setMapScreenLineChartPosition(planName: string, position: ElementPosition) {
    const path = ['plans', planName, 'css', 'mapwindow', 'linechart', 'position'];
    ipcRenderer.send('save-config-element', { path, value: position });
  }

  public getMapScreenLineChartSize(planName: string): ElementSize {
    return this.configFile['plans'][planName]['css']['mapwindow']['linechart']['size'];
  }

  public setMapScreenLineChartSize(planName: string, size: ElementSize) {
    const path = ['plans', planName, 'css', 'mapwindow', 'linechart', 'size'];
    ipcRenderer.send('save-config-element', { path, value: size });
  }


  ////////////////////
  public getMapScreenPieChartPosition(planName: string): ElementPosition {
    return this.configFile['plans'][planName]['css']['mapwindow']['piechart']['position'];
  }

  public setMapScreenPieChartPosition(planName: string, position: ElementPosition) {
    const path = ['plans', planName, 'css', 'mapwindow', 'piechart', 'position'];
    ipcRenderer.send('save-config-element', { path, value: position });
  }

  public getMapScreenPieChartSize(planName: string): ElementSize {
    return this.configFile['plans'][planName]['css']['mapwindow']['piechart']['size'];
  }

  public setMapScreenPieChartSize(planName: string, size: ElementSize) {
    const path = ['plans', planName, 'css', 'mapwindow', 'piechart', 'size'];
    ipcRenderer.send('save-config-element', { path, value: size });
  }

  ////////////////////
  public getMapScreenTextLabelPosition(planName: string): ElementPosition {
    return this.configFile['plans'][planName]['css']['mapwindow']['textlabel']['position'];
  }

  public setMapScreenTextLabelPosition(planName: string, position: ElementPosition) {
    const path = ['plans', planName, 'css', 'mapwindow', 'textlabel', 'position'];
    ipcRenderer.send('save-config-element', { path, value: position });
  }

  public getMapScreenTextLabelSize(planName: string): number {
    return this.configFile['plans'][planName]['css']['mapwindow']['textlabel']['size'];
  }

  public setMapScreenTextLabelSize(planName: string, size: number) {
    const path = ['plans', planName, 'css', 'mapwindow', 'textlabel', 'size'];
    ipcRenderer.send('save-config-element', { path, value: size });
  }

  public getConfigFile() {
    return this.configFile;
  }
}
