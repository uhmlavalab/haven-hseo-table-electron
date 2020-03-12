import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { PlanStateService, ElementPosition, WindowService, ElementSize, Scenario, MapLayer, AppInput, PlanConfigService, InputService, PlanConfig } from '@app/core';

import { ChartData, PieChartComponent, LineChartComponent } from '@app/charts';
import { MapElementComponent } from '@app/maps';
import { Subscription } from 'rxjs';

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
  mapBounds: [[number, number], [number, number]];
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

  electronMessageSub: Subscription;

  configFile: PlanConfig;


  constructor(private planService: PlanStateService, private planConfigService: PlanConfigService, private inputService: InputService, private detectorRef: ChangeDetectorRef, private electronService: WindowService) {
    this.scenario = this.planService.getCurrentScenario();
    this.layer = this.planService.getCurrentLayer();
    this.year = this.planService.getCurrentYear();
    this.pieData = this.planService.getCapacityData();
    this.baseImageURL = this.planService.getBaseImagePath();
    this.planLayers = this.planService.getMapLayers();
    this.mapBounds = this.planService.getMapBounds();

    this.configFile = this.planConfigService.getConfigFile();

    const planName = this.planService.getPlanName();

    this.mapPosition = this.configFile.plans[planName].css.mapwindow.map.position;
    this.mapSize = this.configFile.plans[planName].css.mapwindow.map.size;

    this.piePosition = this.configFile.plans[planName].css.mapwindow.piechart.position;
    this.pieSize = this.configFile.plans[planName].css.mapwindow.piechart.size;

    this.linePosition = this.configFile.plans[planName].css.mapwindow.linechart.position;
    this.lineSize = this.configFile.plans[planName].css.mapwindow.linechart.size;

    this.textLabelPosition = this.configFile.plans[planName].css.mapwindow.textlabel.position;
    this.textLabelSize = this.configFile.plans[planName].css.mapwindow.textlabel.size;

    this.electronMessageSub = this.inputService.inputSub.subscribe(value => {
      this.processInput(value);
    })
  }

  processInput(input: AppInput) {
    switch (input) {
      case AppInput.left:
        this.planService.previousScenario()
        break;
      case AppInput.right:
        this.planService.nextScenario()
        break;
      case AppInput.minus:
        this.planService.decrementNextLayer()
        break;
      case AppInput.plus:
        this.planService.incrementNextLayer()
        break;
      case AppInput.up:
        this.planService.incrementCurrentYear()
        break;
      case AppInput.down:
        this.planService.decrementCurrentYear()
        break;
      case AppInput.enter:
        this.planService.toggleLayer(this.layer)
        break;
    }
  }

  ngOnDestroy() {
    this.electronMessageSub.unsubscribe();
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
      this.map.updateLayers();
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
    this.configFile.plans[this.planName].css.mapwindow.linechart.position = { x: this.linePosition.x, y: this.linePosition.y };
    this.planConfigService.updateConfigfile(this.configFile);
  }

  onPieDragEnd(event: any) {
    this.piePosition.x = this.pieDiv.nativeElement.getBoundingClientRect().left;
    this.piePosition.y = this.pieDiv.nativeElement.getBoundingClientRect().top;
    this.configFile.plans[this.planName].css.mapwindow.piechart.position = { x: this.piePosition.x, y: this.piePosition.y };
    this.planConfigService.updateConfigfile(this.configFile);
  }

  onMapDragEnd(event: any) {
    this.mapPosition.x = this.mapDiv.nativeElement.getBoundingClientRect().left;
    this.mapPosition.y = this.mapDiv.nativeElement.getBoundingClientRect().top;
    this.configFile.plans[this.planName].css.mapwindow.map.position = { x: this.mapPosition.x, y: this.mapPosition.y };
    this.planConfigService.updateConfigfile(this.configFile);
  }

  onLabelDragEnd() {
    this.textLabelPosition.x = this.textLabel.nativeElement.getBoundingClientRect().left;
    this.textLabelPosition.y = this.textLabel.nativeElement.getBoundingClientRect().top;
    this.configFile.plans[this.planName].css.mapwindow.textlabel.position = { x: this.textLabelPosition.x, y: this.textLabelPosition.y };
    this.planConfigService.updateConfigfile(this.configFile);
  }

  positionMap(position: ElementPosition) {
    this.mapDiv.nativeElement.style.left = position.x + 'px';
    this.mapDiv.nativeElement.style.top = position.y + 'px';
  }

  sizeMap(size: ElementSize) {
    this.mapSize = size;
  }

  positionLineChart(position: ElementPosition) {
    this.lineDiv.nativeElement.style.left = position.x + 'px';
    this.lineDiv.nativeElement.style.top = position.y + 'px';
  }

  sizeLineChart(size: ElementSize) {
    this.lineSize = size;
  }

  positionPieChart(position: ElementPosition) {
    this.pieDiv.nativeElement.style.left = position.x + 'px';
    this.pieDiv.nativeElement.style.top = position.y + 'px';
  }

  sizePieChart(size: ElementSize) {
    this.pieSize = size;
  }

  positionTextLabel(position: ElementPosition) {
    this.textLabel.nativeElement.style.left = position.x + 'px';
    this.textLabel.nativeElement.style.top = position.y + 'px';
  }

  sizeTextLabel(size: number) {
    this.textLabel.nativeElement.style.fontSize = size + 'px';
  }

  mapResize(resize: number) {
    const width = this.mapSize.width + resize;
    const height = this.mapSize.height + resize;
    this.mapSize = { width, height };
    this.configFile.plans[this.planName].css.mapwindow.map.size = this.mapSize;
    this.planConfigService.updateConfigfile(this.configFile);
  }

  resizeLineChart(resize: number) {
    const width = this.lineSize.width + resize;
    const height = this.lineSize.height + resize;
    this.lineSize = { width, height };
    this.configFile.plans[this.planName].css.mapwindow.linechart.size = this.lineSize
    this.planConfigService.updateConfigfile(this.configFile);

  }
  resizePieChart(resize: number) {
    const width = this.pieSize.width + resize;
    const height = this.pieSize.height + resize;
    this.pieSize = { width, height };
    this.configFile.plans[this.planName].css.mapwindow.piechart.size = this.pieSize
    this.planConfigService.updateConfigfile(this.configFile);
  }

  resizeTextLabel(resize: number) {
    this.textLabelSize += resize;
    this.sizeTextLabel(this.textLabelSize)
    this.configFile.plans[this.planName].css.mapwindow.textlabel.size = this.textLabelSize;
    this.planConfigService.updateConfigfile(this.configFile);
  }

  centerMap(x: any) {
    this.planService.changeZoomCenter(x);
  }

  zoomMap(x: any) {
    this.planService.changeZoomZoom(x);
  }

}
