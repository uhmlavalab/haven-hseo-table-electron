import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Subject } from 'rxjs';

export interface KeyboardInput {
  keyname: string;
  eventFunction(): any;
}

export enum AppInput {
  enter = 'enter',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  backward = 'backward',
  forward = 'forward',
  minus = 'minus',
  plus = 'plus',
  esc = 'esc'
}


@Injectable({
  providedIn: 'root'
})
export class InputService {

  private registeredKeyboardInputs: KeyboardInput[] = [];

  public inputSub = new Subject<AppInput>();

  constructor() {
    // Keyboard Input
    document.addEventListener('keydown', (event) => {
      this.registeredKeyboardInputs.forEach(key => {
        if (event.key == key.keyname) {
          key.eventFunction();
        }
      })
    });

    // Any Other
    ipcRenderer.on('input-message', (event, message) => {
      console.log(message)
      this.inputSub.next(message as AppInput);
    });
  }

  public registerKeyboardEvent(keyboardInput: KeyboardInput) {
    this.registeredKeyboardInputs.push(keyboardInput);
  }

  public deregisterAllKeyboardEvents() {
    this.registeredKeyboardInputs = [];
  }

  public sendInput(input: AppInput) {
    ipcRenderer.send('input-message', { input: input })
  }


}
