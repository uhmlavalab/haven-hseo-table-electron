import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {  AppInput, LeftRightPuckComponent, PuckService, ProjectableMarker, InputService } from '@app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-puck-plan-selection',
  templateUrl: './puck-plan-selection.component.html',
  styleUrls: ['./puck-plan-selection.component.css']
})
export class PuckPlanSelectionComponent implements  AfterViewInit, OnDestroy {

  @ViewChild('cursorPuck', { static: false }) CursorPuck: LeftRightPuckComponent;
  @ViewChild('cursorPuck', { static: false, read: ElementRef }) CursorDiv: ElementRef;
  cursorId = 384;
  cursorMinRot = 10;
  cursorDelay = 30;
  cursorText = "Rotate to Change Selection";

  @ViewChild('enterPuck', { static: false }) EnterPuck: LeftRightPuckComponent;
  @ViewChild('enterPuck', { static: false, read: ElementRef }) EnterDiv: ElementRef;
  enterId = 5;
  enterMinRot = 10;
  enterDelay = 30;
  enterText = "Rotate to Choose Selection";

  pucks: { marker: ProjectableMarker, div: ElementRef }[] = [];
  markersSub: Subscription;

  constructor(private puckService: PuckService, private inputService: InputService) { 
    this.puckService.resetMarkersandVideos();

  }

  ngAfterViewInit(): void {
    this.pucks.push({ marker: this.CursorPuck, div: this.CursorDiv });
    this.pucks.push({ marker: this.EnterPuck, div: this.EnterDiv });
    this.puckService.addMarker(this.CursorPuck);
    this.puckService.addMarker(this.EnterPuck);
    this.markersSub = this.puckService.markersSubject.subscribe(value => {
      value.forEach(marker => {
        const puck = this.pucks.find(element => element.marker.markerId == marker.markerId);
        if (puck) {
          puck.marker.updatePosition(puck.div);
        }
      });
    });
  }

  ngOnDestroy() {
    this.puckService.resetMarkersandVideos();
    this.markersSub.unsubscribe();
  }

  rotateLeft() {
    this.inputService.sendInput(AppInput.left);
  }

  rotateRight() {
    this.inputService.sendInput(AppInput.right);
  }

  select() {
    this.inputService.sendInput(AppInput.enter);
  }

}
