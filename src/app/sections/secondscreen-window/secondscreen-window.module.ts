import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout
import { SecondscreenWindowLayoutComponent } from './layout/secondscreen-window-layout.component';

// Routes
import { SecondScreenWindowRoutingModule } from './secondscreen-window-routing-module';



@NgModule({
  declarations: [
    SecondscreenWindowLayoutComponent
  ],
  imports: [
    CommonModule,
    SecondScreenWindowRoutingModule
  ]
})
export class SecondScreenWindowModule { }
