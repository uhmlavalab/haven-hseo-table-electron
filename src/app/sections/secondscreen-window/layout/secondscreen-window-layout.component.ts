import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanService } from '@app/core';

@Component({
  selector: 'app-secondscreen-window-layout',
  templateUrl: './secondscreen-window-layout.component.html',
  styleUrls: ['./secondscreen-window-layout.component.css']
})
export class SecondscreenWindowLayoutComponent implements OnInit {


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
