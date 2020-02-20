import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingModule } from './landing/landing.module';
import { MapWindowModule } from './map-window/map-window.module';
import { PuckWindowModule } from './puck-window/puck-window.module';
import { SecondScreenWindowModule } from './secondscreen-window/secondscreen-window.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LandingModule,
    MapWindowModule,
    PuckWindowModule,
    SecondScreenWindowModule
  ]
})
export class SectionsModule { }
