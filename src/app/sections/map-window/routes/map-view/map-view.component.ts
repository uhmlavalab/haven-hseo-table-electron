import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { PlanService, ElementPosition, ElectronService, ElementSize, Scenario, MapLayer } from '@app/core';

import { ChartData, PieChartComponent, LineChartComponent } from '@app/charts';
import { MapElementComponent } from '@app/maps';
import { InputService } from 'src/app/modules/input';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('textLabel', { static: false, read: ElementRef }) textLabel: ElementRef;
  textLabelPosition: ElementPosition
  textLabelSize: number;

  year: number;
  scenario: Scenario;
  layer: MapLayer;

  planName: string = 'oahu';
  planLayers: MapLayer[];

  @ViewChild('map', { static: false }) map: MapElementComponent;
  @ViewChild('map', { static: false, read: ElementRef }) mapDiv: ElementRef;
  mapPosition: ElementPosition;
  mapSize: ElementSize;
  mapBounds = [[-158.281, 21.710], [-157.647, 21.252]];
  baseImageURL: string;


  @ViewChild('pieChart', { static: false }) pieChart: PieChartComponent;
  @ViewChild('pieChart', { static: false, read: ElementRef }) pieDiv: ElementRef;
  piePosition: ElementPosition;
  pieSize: ElementSize;
  pieFontSize = 28;
  pieTitle = "Generation";
  pieLegend = false;

  @ViewChild('lineChart', { static: false }) lineChart: LineChartComponent;
  @ViewChild('lineChart', { static: false, read: ElementRef }) lineDiv: ElementRef;
  linePosition: ElementPosition;
  lineSize: ElementSize;
  lineFontSize = 24;
  lineTitle = "Generation";
  lineLegend = false;

  pieData: ChartData;

  constructor(private planService: PlanService, private detectorRef: ChangeDetectorRef, private electronService: ElectronService, private InputService: InputService) {
    this.scenario = this.planService.getCurrentScenario();
    this.layer = this.planService.getCurrentLayer();
    this.year = this.planService.getCurrentYear();
    this.pieData = this.planService.getCapacityData();
    this.baseImageURL = this.planService.getBaseImagePath();
    this.planLayers = this.planService.getMapLayers();

    this.InputService.registerKeyboardEvent({keyname: 'ArrowUp', eventFunction: () => this.planService.incrementCurrentYear()});
    this.InputService.registerKeyboardEvent({keyname: 'ArrowDown', eventFunction: () => this.planService.decrementCurrentYear()});

    this.InputService.registerKeyboardEvent({keyname: 'ArrowLeft', eventFunction: () => this.planService.decrementScenario()});
    this.InputService.registerKeyboardEvent({keyname: 'ArrowRight', eventFunction: () => this.planService.incrementScenario()});

    this.InputService.registerKeyboardEvent({keyname: '=', eventFunction: () => this.planService.incrementNextLayer()});
    this.InputService.registerKeyboardEvent({keyname: '-', eventFunction: () => this.planService.decrementNextLayer()}); 

    this.mapPosition = this.electronService.getMapScreenMapPosition(this.planName);
    this.mapSize = this.electronService.getMapScreenMapSize(this.planName);

    this.piePosition = this.electronService.getMapScreenPieChartPosition(this.planName);
    this.pieSize = this.electronService.getMapScreenPieChartSize(this.planName);

    this.linePosition = this.electronService.getMapScreenLineChartPosition(this.planName);
    this.lineSize = this.electronService.getMapScreenLineChartSize(this.planName);

    this.textLabelPosition = this.electronService.getMapScreenTextLabelPosition(this.planName);
    this.textLabelSize = this.electronService.getMapScreenTextLabelSize(this.planName);

  }

  ngAfterViewInit(): void {


    this.positionMap(this.mapPosition);
    this.sizeMap(this.mapSize);

    this.positionLineChart(this.linePosition);
    this.sizeLineChart(this.lineSize);

    this.positionPieChart(this.piePosition);
    this.sizePieChart(this.pieSize);

    this.positionTextLabel(this.textLabelPosition);
    this.sizeTextLabel(this.textLabelSize);

    this.mapDiv.nativeElement.addEventListener("wheel", (event) => {
      const resize = (event.deltaY > 0) ? 4 : -4;
      this.mapResize(resize);
    });

    this.lineDiv.nativeElement.addEventListener("wheel", (event) => {
      const resize = (event.deltaY > 0) ? 4 : -4;
      this.resizeLineChart(resize);

    });

    this.pieDiv.nativeElement.addEventListener("wheel", (event) => {
      const resize = (event.deltaY > 0) ? 4 : -4;
      this.resizePieChart(resize); 
    });

    this.textLabel.nativeElement.addEventListener("wheel", (event) => {
      const resize = (event.deltaY > 0) ? 1 : -1;
      this.resizeTextLabel(resize); 
    });

    this.planService.currentYearSub.subscribe(year => {
      this.year = year;
      this.updateYear(year)
      this.detectorRef.detectChanges();
    });

    this.planService.currentScenarioSub.subscribe(scenario => {
      this.scenario = scenario;
      this.pieData = this.planService.getCapacityData();
      this.changeData();
      this.detectorRef.detectChanges();
    });

    this.planService.currentLayerSub.subscribe(layer => {
      this.layer = layer;
      this.detectorRef.detectChanges();
    });
  }

  updateYear(year: number) {
    this.pieChart.changeXAxis(year);
    this.lineChart.changeYear(year);
    this.map.updateLayers();
  }

  changeData() {
    this.pieChart.changeData(this.pieData, this.year);
    this.lineChart.changeData(this.pieData, this.year);
  }

  onLineDragEnd(event: any) {
    this.linePosition.x = this.lineDiv.nativeElement.getBoundingClientRect().left;
    this.linePosition.y = this.lineDiv.nativeElement.getBoundingClientRect().top;
    this.electronService.setMapScreenLineChartPosition(this.planName, this.linePosition);
  }

  onPieDragEnd(event: any) {
    this.piePosition.x = this.pieDiv.nativeElement.getBoundingClientRect().left;
    this.piePosition.y = this.pieDiv.nativeElement.getBoundingClientRect().top;
    this.electronService.setMapScreenPieChartPosition(this.planName, this.piePosition);
  }

  onMapDragEnd(event: any) {
    this.mapPosition.x = this.mapDiv.nativeElement.getBoundingClientRect().left;
    this.mapPosition.y = this.mapDiv.nativeElement.getBoundingClientRect().top;
    this.electronService.setMapScreenMapPosition(this.planName, this.mapPosition);
  }
  
  onLabelDragEnd() {
    this.textLabelPosition.x = this.textLabel.nativeElement.getBoundingClientRect().left;
    this.textLabelPosition.y = this.textLabel.nativeElement.getBoundingClientRect().top;
    this.electronService.setMapScreenTextLabelPosition(this.planName, this.textLabelPosition);
  }

  positionMap(position: ElementPosition) {
    this.mapDiv.nativeElement.style.left = position.x + 'px';
    this.mapDiv.nativeElement.style.top = position.y  + 'px';
  }

  sizeMap(size: ElementSize) {
    this.mapSize = size;
  }
  
  positionLineChart(position: ElementPosition) {
    this.lineDiv.nativeElement.style.left = position.x + 'px';
    this.lineDiv.nativeElement.style.top = position.y  + 'px';
  }

  sizeLineChart(size: ElementSize) {
    this.lineSize = size;
  }

  positionPieChart(position: ElementPosition) {
    this.pieDiv.nativeElement.style.left = position.x + 'px';
    this.pieDiv.nativeElement.style.top = position.y  + 'px'; 
  } 

  sizePieChart(size: ElementSize) {
    this.pieSize = size;
  }

  positionTextLabel(position: ElementPosition) {
    this.textLabel.nativeElement.style.left = position.x + 'px';
    this.textLabel.nativeElement.style.top = position.y  + 'px'; 
  }
  sizeTextLabel(size: number) {
    this.textLabel.nativeElement.style.fontSize = size + 'px'; 
  }

  mapResize(resize: number) {
    const width = this.mapSize.width + resize;
    const height = this.mapSize.height + resize;
    this.mapSize = {width, height};
    this.electronService.setMapScreenMapSize(this.planName, this.mapSize);
  }
 
  resizeLineChart(resize: number) {
    const width = this.lineSize.width + resize;
    const height = this.lineSize.height + resize;
    this.lineSize = {width, height};
    this.electronService.setMapScreenLineChartSize(this.planName, this.lineSize);

  }
  resizePieChart(resize: number) {
    const width = this.pieSize.width + resize;
    const height = this.pieSize.height + resize;
    this.pieSize = {width, height};
    this.electronService.setMapScreenPieChartSize(this.planName, this.pieSize);
  }

  resizeTextLabel(resize: number) {
    this.textLabelSize += resize;
    this.sizeTextLabel(this.textLabelSize)
    this.electronService.setMapScreenTextLabelSize(this.planName, this.textLabelSize);
  }
 
}
