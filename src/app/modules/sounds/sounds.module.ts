import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { SoundsService } from './services/sounds.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SoundsService
  ]
})
export class SoundsModule { }
