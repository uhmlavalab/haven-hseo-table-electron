import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapLayer } from '../interfaces/mapLayer';
import { Scenario } from '../interfaces/scenario';
import { Plan } from '../interfaces/plan';

import { Plans } from '../../../assets/plans/plans';

import { Papa } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';
import { ChartData } from '@app/charts';

import { ipcRenderer } from 'electron';
import { WindowService, AppRoutes } from './window.service';

export enum StateUpdateType {
  year = 'year',
  layerselection = 'layerselection',
  layertoggle = 'layertoggle',
  scenario = 'scenario',
  loadplan = 'loadplan',
  zoomcenter = 'zoomcenter',
  zoomzoom = 'zoomzoom'
}

export interface StateUpdate {
  type: StateUpdateType,
  value: any;
}

export interface PapaCsv {
  data: [],
  errors: [],
  meta: {}
}

@Injectable({
  providedIn: 'root'
})
export class PlanStateService {

  private loadedPlan: Plan;

  private currentYear: number;
  private minYear: number;
  private maxYear: number;
  public currentYearSub = new BehaviorSubject<number>(this.currentYear);

  private currentScenario: Scenario;
  private scenarios: Scenario[];
  public currentScenarioSub = new BehaviorSubject<Scenario>(null);

  private currentLayer: MapLayer;
  private layers: MapLayer[];
  public currentLayerSub = new BehaviorSubject<MapLayer>(null);

  private generationData: PapaCsv;
  private capacityData: PapaCsv;
  private curtailmentData: PapaCsv;
  private derData: PapaCsv;

  private zoomCenter: [number, number];
  private zoomZoom: number;
  public zoomCenterSub = new BehaviorSubject<[number, number]>(null);
  public zoomZoomSub = new BehaviorSubject<number>(null);

  constructor(private papa: Papa, private http: HttpClient, private windowService: WindowService) {
    ipcRenderer.on('state-message', (event, message) => {
      this.processMessage(message);
    });
  }

  getPlans(): Plan[] {
    return Plans;
  }

  changePlan(planName: string) {
    this.stateUpdate({ type: StateUpdateType.loadplan, value: planName })
  }

  loadPlan(plan: Plan | string): Promise<any> {
    let selectedPlan = null;
    if (typeof plan == 'string') {
      selectedPlan = Plans.find(p => p.name == plan);
    } else {
      selectedPlan = plan;
    }
    return new Promise(resolve => {
      this.loadedPlan = selectedPlan;
      this.scenarios = this.loadedPlan.scenarios;
      this.currentScenario = this.scenarios[0];
      this.layers = this.loadedPlan.map.mapLayers;
      this.currentLayer = this.layers[0];
      this.setYear(this.loadedPlan.minYear);
      this.setScenario(this.currentScenario);
      this.setLayer(this.currentLayer);
      const genPromise = this.loadGenerationData();
      const capPromise = this.loadCapacityData();
      const curPromise = this.loadCurtailmentData();
      return Promise.all([curPromise, genPromise, capPromise]).then(done => {
        this.windowService.rerouteApp(AppRoutes.view)
        return resolve(true);
      })
    })
  }



  public processMessage(msg: StateUpdate) {
    switch (msg.type) {
      case StateUpdateType.year:
        this.setYear(msg.value);
        break;
      case StateUpdateType.scenario:
        this.setScenario(msg.value);
        break;
      case StateUpdateType.layerselection:
        this.setLayer(msg.value);
        break;
      case StateUpdateType.layertoggle:
        this.updateLayer(msg.value);
        break;
      case StateUpdateType.loadplan:
        this.loadPlan(msg.value);
        break;
      case StateUpdateType.zoomcenter:
        this.setZoomCenter(msg.value);
        break;
      case StateUpdateType.zoomzoom:
        this.setZoomZoom(msg.value);
        break;
    }
  }

  public getPlanName(): string {
    return this.loadedPlan.name;
  }

  private stateUpdate(update: StateUpdate) {
    console.log(update);

    ipcRenderer.send('state-message', update);
  }

  public decrementCurrentYear() {
    this.currentYear--;
    if (this.currentYear < this.loadedPlan.minYear) this.currentYear = this.loadedPlan.maxYear;
    this.stateUpdate({ type: StateUpdateType.year, value: this.currentYear });
  }

  public incrementCurrentYear() {
    this.currentYear++;
    if (this.currentYear > this.loadedPlan.maxYear) this.currentYear = this.loadedPlan.minYear;
    this.stateUpdate({ type: StateUpdateType.year, value: this.currentYear });
  }

  private setYear(year: number) {
    this.currentYear = year;
    this.currentYearSub.next(this.currentYear);
  }


  public decrementNextLayer() {
    let currIdx = this.layers.findIndex(el => el.name === this.currentLayer.name);
    currIdx -= 1;
    if (currIdx < 0) currIdx = this.layers.length - 1;
    this.currentLayer = this.layers[currIdx];
    this.stateUpdate({ type: StateUpdateType.layerselection, value: this.currentLayer });
  }

  public incrementNextLayer() {
    let currIdx = this.layers.findIndex(el => el.name === this.currentLayer.name);
    currIdx++;
    if (currIdx >= this.layers.length) currIdx = 0;
    this.currentLayer = this.layers[currIdx];
    this.stateUpdate({ type: StateUpdateType.layerselection, value: this.currentLayer });
  }

  public toggleLayer(layer: MapLayer) {
    this.currentLayer = this.layers.find(el => el.name === layer.name);
    if (this.currentLayer) {
      this.currentLayer.active = !this.currentLayer.active;
      this.stateUpdate({ type: StateUpdateType.layertoggle, value: this.currentLayer });
    }
  }

  public updateLayer(layer: MapLayer) {
    this.currentLayerSub.next(layer);
  }

  private setLayer(layer: MapLayer) {
    this.currentLayer = this.layers.find(el => el.name === layer.name);
    if (this.currentLayer) {
      this.currentLayerSub.next(this.currentLayer);
    }
  }

  public previousScenario() {
    let currIdx = this.scenarios.findIndex(el => el.name === this.currentScenario.name);
    currIdx -= 1;
    if (currIdx < 0) currIdx = this.layers.length - 1;
    this.currentScenario = this.scenarios[currIdx];
    this.stateUpdate({ type: StateUpdateType.scenario, value: this.currentScenario });
  }

  public nextScenario() {
    let currIdx = this.scenarios.findIndex(el => el.name === this.currentScenario.name);
    currIdx++;
    if (currIdx >= this.layers.length) currIdx = 0;
    this.currentScenario = this.scenarios[currIdx];
    this.stateUpdate({ type: StateUpdateType.scenario, value: this.currentScenario });
  }

  private setScenario(scenario: Scenario) {
    this.currentScenario = this.scenarios.find(el => el.name === scenario.name);
    this.currentScenarioSub.next(this.currentScenario);
  }


  public getGenerationTotalForCurrentYear(any: string[]): number {
    console.log('Generation Total By Year');
    return 0;
  }

  public getCapacityTotalForCurrentYear(any: string[]): number {
    console.log('Capacity Total By Year')
    return 0;
  };

  public getCurtailmentTotalForCurrentYear(any: string[]): number {
    console.log('Curtailment Total by Year');
    return 0;
  }

  public getCurrentYear(): number {
    return this.currentYear;
  }

  public getCurrentScenario(): Scenario {
    return this.currentScenario;
  }

  public getCurrentLayer(): MapLayer {
    return this.currentLayer;
  }

  private loadGenerationData(): Promise<any> {
    return this.http.get(this.loadedPlan.data.generationPath, { responseType: 'text' }).toPromise().then(data => {
      return this.papa.parse(data, {
        header: true,
        complete: result => {
          this.generationData = result as any;
        }
      })
    });
  }

  private loadCapacityData(): Promise<any> {
    return this.http.get(this.loadedPlan.data.capacityPath, { responseType: 'text' }).toPromise().then(data => {
      return this.papa.parse(data, {
        header: true,
        complete: result => {
          this.capacityData = result as any;
        }
      })
    });
  }

  private loadCurtailmentData(): Promise<any> {
    return this.http.get(this.loadedPlan.data.curtailmentPath, { responseType: 'text' }).toPromise().then(data => {
      return this.papa.parse(data, {
        header: true,
        complete: result => {
          console.log(result);
        }
      })
    });
  }

  // technology,year,scenario,value
  public getCapacityData(): ChartData {
    let chartData: ChartData = { datasets: [] } as ChartData;
    this.capacityData.data.forEach(element => {
      if (element['scenario'] == this.getCurrentScenario().name) {
        const dataset = chartData.datasets.find(el => el.name == element['technology']);
        const datapoint = { x: Number(element['year']), y: Number(element['value']) }
        if (dataset) {
          dataset.data.push(datapoint);
        } else {
          chartData.datasets.push({
            name: element['technology'],
            color: this.loadedPlan.data.colors[element['technology']],
            data: [datapoint]
          })
        }
      }
    });
    return chartData;
  }

  //year,technology,value,scenario
  public getGenerationData(): ChartData {
    let chartData: ChartData = { datasets: [] } as ChartData;
    this.generationData.data.forEach(element => {
      if (element['scenario'] == this.getCurrentScenario().name) {
        const dataset = chartData.datasets.find(el => el.name == element['technology']);
        const datapoint = { x: Number(element['year']), y: Number(element['value']) }
        if (dataset) {
          dataset.data.push(datapoint);
        } else {
          chartData.datasets.push({
            name: element['technology'],
            color: this.loadedPlan.data.colors[element['technology']],
            data: [datapoint]
          })
        }
      }
    });
    return chartData;
  }

  public getBaseImagePath(): string {
    return this.loadedPlan.map.baseMapPath;
  }

  public getMapLayers(): MapLayer[] {
    return this.loadedPlan.map.mapLayers;
  }

  public getMapBounds(): [[number, number], [number, number]] {
    return this.loadedPlan.map.bounds;
  }

  changeZoomCenter(center: [number, number]) {
    this.stateUpdate({type: StateUpdateType.zoomcenter, value: center})
  }

  changeZoomZoom(zoom: number) {
    this.stateUpdate({type: StateUpdateType.zoomzoom, value: zoom})

  }

  setZoomCenter(value: [number, number]) {
    this.zoomCenter = value;
    this.zoomCenterSub.next(this.zoomCenter);

  }

  setZoomZoom(value: number) {
    this.zoomZoom = value;
    this.zoomZoomSub.next(this.zoomZoom);

  }
}
