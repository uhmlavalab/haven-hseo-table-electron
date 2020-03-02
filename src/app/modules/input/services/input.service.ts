import { Injectable } from '@angular/core';

export interface KeyboardInput {
  keyname: string;
  eventFunction(): any;
}

@Injectable({
  providedIn: 'root'
})
export class InputService {

  registeredKeyboardInputs: KeyboardInput[] = [];

  constructor() {
    document.addEventListener('keydown', (event) => {
      this.registeredKeyboardInputs.forEach(key => {
        if (event.key == key.keyname) {
          key.eventFunction();
        }
      })
    });
  }

  registerKeyboardEvent(keyboardInput: KeyboardInput) {
    this.registeredKeyboardInputs.push(keyboardInput);
  }

  deregisterAllKeyboardEvents() {
    this.registeredKeyboardInputs = [];
  }


}
