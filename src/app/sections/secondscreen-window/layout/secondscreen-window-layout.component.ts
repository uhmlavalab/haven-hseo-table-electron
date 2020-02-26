import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { PlanService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-secondscreen-window-layout',
  templateUrl: './secondscreen-window-layout.component.html',
  styleUrls: ['./secondscreen-window-layout.component.css']
})
export class SecondscreenWindowLayoutComponent implements OnInit {

  constructor(private ngZone: NgZone, private activeRoute: ActivatedRoute, private router: Router) { 
   
  }

  ngOnInit(): void {
    this.rerouteToSecondScreenView();
  }

  rerouteToWaitingScreen() {
    this.ngZone.run(() => {
      this.router.navigate(['secondscreen-waiting'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToSecondScreenView() {
    this.ngZone.run(() => {
      this.router.navigate(['secondscreen-view'], { relativeTo: this.activeRoute });
    });
  }
}
