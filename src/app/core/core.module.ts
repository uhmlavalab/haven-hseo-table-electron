import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 

import { ElectronService } from './services/electron.service';
import { PlanService } from './services/plan.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ElectronService,
    PlanService
  ]
})
export class CoreModule { }
