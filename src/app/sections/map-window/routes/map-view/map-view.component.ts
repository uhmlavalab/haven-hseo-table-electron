import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PlanService } from '@app/core';

import { ChartData, PieChartComponent, LineChartComponent } from '@app/charts';
import { MapElementComponent } from '@app/maps';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  year: number;
  scenario: number;
  layer: number;

  @ViewChild('map' , {static: false}) map: MapElementComponent;
  mapWidth = 600;
  mapBounds = [[-158.281, 21.710], [-157.647, 21.252]];
  baseImageURL = 'assets/plans/oahu/images/oahu-satellite5.png';

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

  pieData: ChartData = {
    datasets: [
      {
        name: 'A',
        color: 'red',
        data: [
          {
            x: 2001,
            y: 6
          }, {
            x: 2002,
            y: 4
          },
          {
            x: 2003,
            y: 1
          },
        ]
      },
      {
        name: 'B',
        color: 'green',
        data: [
          {
            x: 2001,
            y: 3
          }, {
            x: 2002,
            y: 1
          },
          {
            x: 2003,
            y: 2
          },
        ]
      },
      {
        name: 'C',
        color: 'blue',
        data: [
          {
            x: 2001,
            y: 10
          }, {
            x: 2002,
            y: 1
          },
          {
            x: 2003,
            y: 8
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
    this.pieChart.changeXAxis(year);
  }

  changePieData() {
    this.pieChart.changeData(this.pieData, 2001);
  }

  changePieSize() {
    this.pieSize--;
    this.lineSize--;
    this.mapWidth--;
  }
}
