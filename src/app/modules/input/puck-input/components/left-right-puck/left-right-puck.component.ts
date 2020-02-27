import { Component, AfterViewInit, Input } from '@angular/core';
import { ProjectableMarker } from '../../classes/ProjectableMarker';

@Component({
  selector: 'app-left-right-puck',
  templateUrl: './left-right-puck.component.html',
  styleUrls: ['./left-right-puck.component.css']
})
export class LeftRightPuckComponent extends ProjectableMarker implements AfterViewInit {

  @Input() instructionText: string;
  
  constructor() { 
    super();
  }

  ngAfterViewInit(): void {
  }

}
