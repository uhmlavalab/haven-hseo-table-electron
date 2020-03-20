import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { MapElementComponent } from 'src/app/modules/maps';
import { PlanStateService, MapLayer, ElementSize, ElementPosition, Scenario, WindowService, PlanConfig, PlanConfigService } from '@app/core';
import { PieChartComponent, LineChartComponent, ChartData } from '@app/charts';
import * as CircleType from 'circletype';

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
  @ViewChild('mapContainer', { static: false, read: ElementRef }) mapContainer: ElementRef;
  
  mapPosition: ElementPosition;
  mapSize: ElementSize;
  mapBounds: [[number, number], [number, number]];
  baseImageURL: string;

  configFile: PlanConfig;

  text = 'Main Menu';
  mapCenter = [-157.647, 21.252]
  mapZoom = 10;

  @ViewChild('scenarioText', { static: false, read: ElementRef }) scenarioText: ElementRef;
  scenarioCircle: any;
  @ViewChild('yearText', { static: false, read: ElementRef }) yearText: ElementRef;
  @ViewChild('islandText', { static: false, read: ElementRef }) islandText: ElementRef;
  @ViewChild('reText', { static: false, read: ElementRef }) reText: ElementRef;

  constructor(private planService: PlanStateService, private planConfigService: PlanConfigService, private detectorRef: ChangeDetectorRef, private electronService: WindowService,   private renderer: Renderer2) {
    this.scenario = this.planService.getCurrentScenario();
    this.layer = this.planService.getCurrentLayer();
    this.year = this.planService.getCurrentYear();
    this.baseImageURL = this.planService.getBaseImagePath();
    this.planLayers = this.planService.getMapLayers();
    this.mapBounds = this.planService.getMapBounds();
    this.mapSize = { width: 1400, height: 1400 };
    this.configFile = this.planConfigService.getConfigFile();

    this.mapPosition = this.configFile.plans[this.planName].css.secondwindow.map.position;
    this.mapSize = this.configFile.plans[this.planName].css.secondwindow.map.size;
  }

  ngAfterViewInit(): void {
    const radius = this.mapContainer.nativeElement.getBoundingClientRect().width / 2 + 15;
    const x = Math.cos(40 * (Math.PI/180)) * radius;
    const y = Math.sin(40 * (Math.PI/180)) * radius;

    this.scenarioCircle = new CircleType(this.scenarioText.nativeElement);
    this.scenarioCircle.radius(radius).dir(1);
    this.renderer.setStyle(this.scenarioText.nativeElement, 'transform', `translate(${Math.trunc(-x)}px, ${Math.trunc(-y)}px) rotate(-53deg)`);

    const yearCircle = new CircleType(this.yearText.nativeElement);
    yearCircle.radius(radius).dir(1);
    this.renderer.setStyle(this.yearText.nativeElement, 'transform', `translate(${Math.trunc(x)}px, ${Math.trunc(-y)}px) rotate(53deg)`);

    const islandCircle = new CircleType(this.islandText.nativeElement);
    islandCircle.radius(radius).dir(-1);
    this.renderer.setStyle(this.islandText.nativeElement, 'transform', `translate(${-x}px, ${y}px) rotate(53deg)`);

    const reCircle = new CircleType(this.reText.nativeElement);
    reCircle.radius(radius).dir(-1);
    this.renderer.setStyle(this.reText.nativeElement, 'transform', `translate(${x}px, ${y}px) rotate(-53deg)`);


    // this.positionMap(this.mapPosition);
    // this.sizeMap(this.mapSize);

    // this.mapDiv.nativeElement.addEventListener("wheel", (event) => {
    //   const resize = (event.deltaY > 0) ? 4 : -4;
    //   this.mapResize(resize);
    // });

    this.planService.currentYearSub.subscribe(year => {
      this.year = year;
      this.updateYear(year)
      this.detectorRef.detectChanges();
    });

    this.planService.currentScenarioSub.subscribe(scenario => {
      console.log(scenario);
      this.scenario = scenario;
      this.updateSceanario();
      this.detectorRef.detectChanges();
    });

    this.planService.currentLayerSub.subscribe(layer => {
      this.layer = layer;
      if (this.map) {
        this.map.updateLayers();
      }
      this.detectorRef.detectChanges();
    });

    this.planService.zoomCenterSub.subscribe(value => {
      console.log(value);
      if (value) {
        this.mapCenter = value;
        this.detectorRef.detectChanges();
      }
    })

    this.planService.zoomZoomSub.subscribe(value => {
      console.log(value);
      if (value) {
        this.mapZoom = value;
        this.detectorRef.detectChanges();
      }
    })
  }

  updateSceanario() {
    this.scenarioText.nativeElement.innerText = this.scenario.displayName;
    const radius = this.mapContainer.nativeElement.getBoundingClientRect().width / 2 + 15;
    const x = Math.cos(40 * (Math.PI/180)) * radius;
    const y = Math.sin(40 * (Math.PI/180)) * radius;
    this.scenarioCircle = new CircleType(this.scenarioText.nativeElement);
    this.scenarioCircle.radius(radius).dir(1);
    this.renderer.setStyle(this.scenarioText.nativeElement, 'transform', `translate(${Math.trunc(-x)}px, ${Math.trunc(-y)}px) rotate(-56deg)`);
  }

  updateYear(year: number) {
    this.yearText.nativeElement.innerText = this.year.toString();
    this.detectorRef.detectChanges();
    if (this.map) {
      this.map.updateLayers();
    }
  }

  changeData() {

  }

  onMapDragEnd(event: any) {
    this.mapPosition.x = this.mapDiv.nativeElement.getBoundingClientRect().left;
    this.mapPosition.y = this.mapDiv.nativeElement.getBoundingClientRect().top;
    this.configFile.plans.oahu.css.secondwindow.map.position = { x: this.mapPosition.x, y: this.mapPosition.y };
    this.planConfigService.updateConfigfile(this.configFile);
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
    this.configFile.plans.oahu.css.secondwindow.map.size = this.mapSize;
    this.planConfigService.updateConfigfile(this.configFile);
  }




}
