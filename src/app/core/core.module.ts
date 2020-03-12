import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 

import { WindowService } from './services/window.service';
import { PlanStateService } from './services/plan-state.service';
import { PlanConfigService } from './services/plan-config.service';
import { InputService } from './services/input.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    WindowService,
    PlanStateService,
    PlanConfigService,
    InputService
  ]
})
export class CoreModule { }
