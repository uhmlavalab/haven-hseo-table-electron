import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PlanService } from '@app/core';

import { PieData, PieChartComponent, LineChartComponent } from '@app/charts';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  year: number;
  scenario: number;
  layer: number;

  @ViewChild('pieChart' , {static: false}) pieChart: PieChartComponent;
  pieSize = 300;
  pieFontSize = 24;
  pieTitle = "Generation";
  pieLegend = false;

  @ViewChild('lineChart' , {static: false}) lineChart: LineChartComponent;
  lineSize = 300;
  lineFontSize = 24;
  lineTitle = "Generation";
  lineLegend = false;

  pieData: PieData = {
    datasets: [
      {
        name: 'A',
        color: 'red',
        data: [
          {
            year: 2001,
            value: 6
          }, {
            year: 2002,
            value: 4
          },
          {
            year: 2003,
            value: 1
          },
        ]
      },
      {
        name: 'B',
        color: 'green',
        data: [
          {
            year: 2001,
            value: 3
          }, {
            year: 2002,
            value: 1
          },
          {
            year: 2003,
            value: 2
          },
        ]
      },
      {
        name: 'C',
        color: 'blue',
        data: [
          {
            year: 2001,
            value: 10
          }, {
            year: 2002,
            value: 1
          },
          {
            year: 2003,
            value: 8
          },
        ]
      },

    ]
  }

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

  nextYear(year) {
    this.pieChart.changeYear(year);
  }

  changePieData() {
    this.pieChart.changeData(this.pieData, 2001);
  }

  changePieSize() {
    this.pieSize--;
    this.lineSize--;
  }
}
