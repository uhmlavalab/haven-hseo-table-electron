import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject } from 'rxjs';
import { MapLayer } from '../interfaces/mapLayer';
import { Scenario } from '../interfaces/scenario';
import { Plan } from '../interfaces/plan';

import { Plans } from '../../../assets/plans/plans';

import { Papa } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';
import { ChartData } from 'src/app/modules/charts';

export enum StateUpdateType {
  year = 'year',
  layerselection = 'layerselection',
  layertoggle = 'layertoggle',
  scenario = 'scenario',
  loadplan = 'loadplan'
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private loadedPlan: Plan;

  private currentYear = 2016;
  public currentYearSub = new BehaviorSubject<number>(this.currentYear);

  private currentScenario = 0;
  public currentScenarioSub = new BehaviorSubject<Scenario>(null);

  private currentLayer = 0;
  public currentLayerSub = new BehaviorSubject<MapLayer>(null);

  private generationData: {data: [], errors: [], meta: {}};
  private capData: {data: [], errors: [], meta: {}};
  private curtailmentData: {data: [], errors: [], meta: {}};
  private derData: {data: [], errors: [], meta: {}};

  constructor(private electronService: ElectronService, private papa: Papa, private http: HttpClient) {
    this.electronService.windowMessageSubject.subscribe(message => {
      this.processMessage(message);
    })
  }

  getPlans(): Plan[] {
    return Plans;
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
      this.electronService.sendMessage({ type: StateUpdateType.loadplan, plan: this.loadedPlan.name });
      this.setYear(this.loadedPlan.minYear);
      this.setScenario(0);
      this.setLayer(0);
      const genPromise = this.loadGenerationData();
      const capPromise = this.loadCapacityData();
      const curPromise = this.loadCurtailmentData();
      return Promise.all([curPromise, genPromise, capPromise]).then(done => {
        console.log('finished');
        return resolve(true);
      })
    })
  }

  public processMessage(msg) {
    switch (msg.type) {
      case StateUpdateType.year:
        this.setYear(msg.year);
        break;
      case StateUpdateType.scenario:
        this.setScenario(msg.scenario);
        break;
      case StateUpdateType.layerselection:
        this.setLayer(msg.layer);
        break;
      case StateUpdateType.layertoggle:
        this.toggleLayer(msg.layer);
        break;
      case StateUpdateType.loadplan:
        this.loadPlan(msg.plan);
        break;
    }
  }

  public decrementCurrentYear() {
    this.currentYear--;
    if (this.currentYear < this.loadedPlan.minYear) this.currentYear = this.loadedPlan.maxYear;
    this.setYear(this.currentYear);
    this.electronService.sendMessage({ type: 'year', year: this.currentYear })
  }

  public incrementCurrentYear() {
    this.currentYear++;
    if (this.currentYear > this.loadedPlan.maxYear) this.currentYear = this.loadedPlan.minYear;
    this.setYear(this.currentYear);
    this.electronService.sendMessage({ type: 'year', year: this.currentYear })
  }

  private setYear(year: number) {
    this.currentYear = year;
    this.currentYearSub.next(this.currentYear);
  }

  public decrementNextLayer() {
    this.currentLayer--;
    if (this.currentLayer < 0) this.currentLayer = this.loadedPlan.map.mapLayers.length - 1;
    this.setLayer(this.currentLayer);
    this.electronService.sendMessage({ type: 'layerselection', layer: this.currentLayer })
  }

  public incrementNextLayer() {
    this.currentLayer++;
    if (this.currentLayer >= this.loadedPlan.map.mapLayers.length) this.currentLayer = 0;
    this.setLayer(this.currentLayer);
    this.electronService.sendMessage({ type: 'layerselection', layer: this.currentLayer })
  }

  private setLayer(layer: number) {
    this.currentLayer = layer;
    this.currentLayerSub.next(this.loadedPlan.map.mapLayers[this.currentLayer]);
  }

  public toggleLayer(active: boolean) {
    this.loadedPlan.map.mapLayers[this.currentLayer].active = active;
    this.currentLayerSub.next(this.loadedPlan.map.mapLayers[this.currentLayer]);

  }

  public decrementScenario() {
    this.currentScenario--;
    if (this.currentScenario < 0) this.currentScenario = this.loadedPlan.scenarios.length - 1;
    this.setScenario(this.currentScenario);
    this.electronService.sendMessage({ type: 'scenario', scenario: this.currentScenario })
  }

  public incrementScenario() {
    this.currentScenario++;
    if (this.currentScenario >= this.loadedPlan.scenarios.length) this.currentScenario = 0;

    this.setScenario(this.currentScenario);
    this.electronService.sendMessage({ type: 'scenario', scenario: this.currentScenario })
  }

  private setScenario(scenario: number) {
    this.currentScenario = scenario;
    this.currentScenarioSub.next(this.loadedPlan.scenarios[this.currentScenario]);
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
    return this.loadedPlan.scenarios[this.currentScenario];
  }

  public getCurrentLayer(): MapLayer {
    return this.loadedPlan.map.mapLayers[this.currentLayer];
  }

  private loadGenerationData(): Promise<any> {
    return this.http.get(this.loadedPlan.data.generationPath, { responseType: 'text' }).toPromise().then(data => {
      return this.papa.parse(data, {
        header: true,
        complete: result => {
          console.log(result);
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
          console.log(result);
          this.capData = result as any;
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
          this.curtailmentData = result as any;
        }
      })
    });
  }

  // technology,year,scenario,value
  public getCapacityData(): ChartData {
    let chartData : ChartData = {datasets: []} as ChartData;
    this.capData.data.forEach(element => {
      if (element['scenario'] == this.getCurrentScenario().name) {
        const dataset = chartData.datasets.find(el => el.name == element['technology']);
        const datapoint = {x: Number(element['year']), y: Number(element['value'])}
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
}
