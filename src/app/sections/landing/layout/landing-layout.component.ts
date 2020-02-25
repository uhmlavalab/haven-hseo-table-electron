import { Component, NgZone } from '@angular/core';
import { ElectronService } from '@app/core';
import { SoundsService } from '@app/sounds';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-landing-layout',
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.css']
})
export class LandingLayoutComponent  {

  title = 'Craving HAVEN';
  titleFreq = 4;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private electronService: ElectronService, private ngZone: NgZone) {
    this.rerouteToScreenSelection();
  }

  reset() {
    this.electronService.resetAllWindows();
  }

  close() {
    this.electronService.closeApplication();
  }

  rerouteToScreenSelection() {
    this.ngZone.run(() => {
      this.router.navigate(['screen-selection'], { relativeTo: this.activeRoute }); 
    });
  }

}
