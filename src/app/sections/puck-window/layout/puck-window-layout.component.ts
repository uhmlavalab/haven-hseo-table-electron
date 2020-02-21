import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-puck-window-layout',
  templateUrl: './puck-window-layout.component.html',
  styleUrls: ['./puck-window-layout.component.css']
})
export class PuckWindowLayoutComponent implements OnInit {

  constructor(private router: Router, private electronService: ElectronService, private activeRoute: ActivatedRoute, private ngZone: NgZone) {

  }

  ngOnInit(): void {
  }

  shiftLeft() {
    this.electronService.shiftPuckScreenLeft();
  }

  shiftRight() {
    this.electronService.shiftPuckScreenRight();
  }

  calibration() {
    this.ngZone.run(() => {
      this.router.navigate(['calibration'], { relativeTo: this.activeRoute });
    });
  }

  running() {
    this.ngZone.run(() => {
      this.router.navigate(['running'], { relativeTo: this.activeRoute });
    });
  }

  restart() {
    this.electronService.resetAllWindows();
  }
}
