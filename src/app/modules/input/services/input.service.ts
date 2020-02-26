import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputService {



  constructor() {

  }

  puckLeft(puckId: number) {
    console.log(puckId, 'LEFT')
  }

  puckRight(puckId: number) {
    console.log(puckId, 'RIGHT')

  }

}
