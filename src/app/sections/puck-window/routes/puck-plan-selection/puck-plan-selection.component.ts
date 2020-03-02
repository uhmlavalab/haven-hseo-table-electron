import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PuckService, ProjectableMarker } from 'src/app/modules/input';
import { ElectronService, AppInput } from '@app/core';
import { LeftRightPuckComponent } from 'src/app/modules/input/puck-input/components/left-right-puck/left-right-puck.component';
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

  constructor(private puckService: PuckService, private electronService: ElectronService) { 
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
    this.electronService.appInput(AppInput.left);
  }

  rotateRight() {
    this.electronService.appInput(AppInput.right);
  }

  select() {
    this.electronService.appInput(AppInput.enter);
  }

}
