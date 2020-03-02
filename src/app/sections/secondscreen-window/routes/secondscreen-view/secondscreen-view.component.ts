import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MapElementComponent } from 'src/app/modules/maps';
import { PlanService, MapLayer, ElementSize, ElementPosition, Scenario, ElectronService } from '@app/core';
import { PieChartComponent, LineChartComponent, ChartData } from '@app/charts';

@Component({
  selector: 'app-secondscreen-view',
  templateUrl: './secondscreen-view.component.html',
  styleUrls: ['./secondscreen-view.component.css']
})
export class SecondscreenViewComponent implements AfterViewInit {

  year: number;
  scenario: Scenario;
  layer: MapLayer;

  planName: string = 'oahu';
  planLayers: MapLayer[];
  
  @ViewChild('map', { static: false }) map: MapElementComponent;
  @ViewChild('map', { static: false, read: ElementRef }) mapDiv: ElementRef;
  mapPosition: ElementPosition;
  mapSize: ElementSize;
  mapBounds: [[number, number], [number, number]];
  baseImageURL: string;

  constructor(private planService: PlanService, private detectorRef: ChangeDetectorRef, private electronService: ElectronService) {
    this.scenario = this.planService.getCurrentScenario();
    this.layer = this.planService.getCurrentLayer();
    this.year = this.planService.getCurrentYear();
    this.baseImageURL = this.planService.getBaseImagePath();
    this.planLayers = this.planService.getMapLayers();
    this.mapBounds = this.planService.getMapBounds();
    this.mapSize = {width: 1400, height: 1400};

    this.mapPosition = this.electronService.getSecondScreenMapPosition(this.planName);
    this.mapSize = this.electronService.getSecondScreenMapSize(this.planName);
  }

  ngAfterViewInit(): void {

    this.positionMap(this.mapPosition);
    this.sizeMap(this.mapSize);

    this.mapDiv.nativeElement.addEventListener("wheel", (event) => {
      const resize = (event.deltaY > 0) ? 4 : -4;
      this.mapResize(resize);
    });

    this.planService.currentYearSub.subscribe(year => {
      this.year = year;
      this.updateYear(year)
      this.detectorRef.detectChanges();
    });

    this.planService.currentScenarioSub.subscribe(scenario => {
      this.scenario = scenario;
      this.changeData();
      this.detectorRef.detectChanges();
    });

    this.planService.currentLayerSub.subscribe(layer => {
      this.layer = layer;
      console.log('layer');
      this.map.updateLayers();
      this.detectorRef.detectChanges();
    });
  }

  updateYear(year: number) {
    if (this.map) {
      this.map.updateLayers();
    }
  }

  changeData() {
  
  }

  onMapDragEnd(event: any) {
    this.mapPosition.x = this.mapDiv.nativeElement.getBoundingClientRect().left;
    this.mapPosition.y = this.mapDiv.nativeElement.getBoundingClientRect().top;
    this.electronService.setSecondScreenMapPosition(this.planName, this.mapPosition);
  }

  positionMap(position: ElementPosition) {
    this.mapDiv.nativeElement.style.left = position.x + 'px';
    this.mapDiv.nativeElement.style.top = position.y + 'px';
  }

  sizeMap(size: ElementSize) {
    this.mapSize = size;
  }

  mapResize(resize: number) {
    const width = this.mapSize.width + resize;
    const height = this.mapSize.height + resize;
    this.mapSize = { width, height };
    this.electronService.setSecondScreenMapSize(this.planName, this.mapSize);
  }




}
