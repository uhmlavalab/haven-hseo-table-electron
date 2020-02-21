import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanService } from '@app/core';

@Component({
  selector: 'app-map-window-layout',
  templateUrl: './map-window-layout.component.html',
  styleUrls: ['./map-window-layout.component.css']
})
export class MapWindowLayoutComponent implements OnInit {

  year: number;
  scenario: number;
  layer: number;

  constructor(private planService: PlanService, private detectorRef: ChangeDetectorRef) { 
   
  }

  ngOnInit(): void {
    this.planService.currentYearSub.subscribe(year => {
      this.year = year;
      this.detectorRef.detectChanges();
    });

    this.planService.currentScenarioSub.subscribe(scenario => {
      this.scenario = scenario;
      this.detectorRef.detectChanges();
    });

    this.planService.currentLayerSub.subscribe(layer => {
      this.layer = layer;
      this.detectorRef.detectChanges();
    });
  }

}
