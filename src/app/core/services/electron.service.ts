import { Injectable, NgZone } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  windowName: string;
  windowMessageSubject = new Subject<any>();

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
        console.log('navigate to puck-window')
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
}
