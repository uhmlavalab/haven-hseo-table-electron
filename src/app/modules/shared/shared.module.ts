import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BouncingTitleComponent } from './components/bouncing-title/bouncing-title.component';
import { SpinningButtonComponent } from './components/spinning-button/spinning-button.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';

@NgModule({
  declarations: [
    BouncingTitleComponent,
    SpinningButtonComponent,
    MenuButtonComponent
  ],
  exports: [
    BouncingTitleComponent,
    SpinningButtonComponent,
    MenuButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
