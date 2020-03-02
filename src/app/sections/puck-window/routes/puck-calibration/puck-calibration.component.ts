import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LeftRightPuckComponent, PuckService, ProjectableMarker } from 'src/app/modules/input';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-puck-calibration',
  templateUrl: './puck-calibration.component.html',
  styleUrls: ['./puck-calibration.component.css']
})
export class PuckCalibrationComponent implements AfterViewInit, OnDestroy {

  text = "Calibration Puck";
  calDelay = 400;
  calMinRot = 10;
  calId = 384;

  @ViewChild('calPuck', { static: false }) CalPuck: LeftRightPuckComponent;
  @ViewChild('calPuck', { static: false, read: ElementRef }) CalDiv: ElementRef;
  pucks: { marker: ProjectableMarker, div: ElementRef }[] = [];

  markersSub: Subscription;
  constructor(private puckService: PuckService) {
    this.puckService.resetMarkersandVideos();


  }

  ngAfterViewInit(): void {
    this.pucks.push({ marker: this.CalPuck, div: this.CalDiv });
    this.puckService.addMarker(this.CalPuck);
    this.markersSub = this.puckService.markersSubject.subscribe(value => {
      value.forEach(marker => {
        console.log(marker);
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

}
