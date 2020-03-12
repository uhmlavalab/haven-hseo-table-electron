import { Component } from '@angular/core';
import { WindowService } from '@app/core';

@Component({
  selector: 'app-screen-selection',
  templateUrl: './screen-selection.component.html',
  styleUrls: ['./screen-selection.component.css']
})
export class ScreenSelectionComponent {

  constructor(private electronService: WindowService) { }

  
  setAsSecondScreen() {
    this.electronService.setAsSecondScreenWindow();
  }

  setAsMapWindow() {
    this.electronService.setAsMapWindow();
  }

}
