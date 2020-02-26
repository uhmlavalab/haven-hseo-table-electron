import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-map-window-layout',
  templateUrl: './map-window-layout.component.html',
  styleUrls: ['./map-window-layout.component.css']
})
export class MapWindowLayoutComponent implements OnInit {

  
  constructor(private ngZone: NgZone, private activeRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
  this.rerouteToMapView();
  }

  rerouteToMapView() {
    this.ngZone.run(() => {
      this.router.navigate(['map-view'], { relativeTo: this.activeRoute });
    });
  }

  rerouteToWaitingScreen() {
    this.ngZone.run(() => {
      this.router.navigate(['map-waiting'], { relativeTo: this.activeRoute });
    });
  }

}
