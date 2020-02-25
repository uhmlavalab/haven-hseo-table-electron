import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';


@NgModule({
  declarations: [
    PieChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PieChartComponent
    ,LineChartComponent
  ]
})
export class ChartsModule { }
