import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArService} from './services/ar.service';
import { InputService } from './services/input.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ArService,
    InputService
  ]
})
export class InputModule { }
