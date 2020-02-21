import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronService } from './services/electron.service';
import { ArService} from './services/ar.service';
import { PlanService } from './services/plan.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ElectronService,
    ArService,
    PlanService
  ]
})
export class CoreModule { }
