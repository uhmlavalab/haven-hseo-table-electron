import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject } from 'rxjs';
import { LayerPuckComponent } from 'src/app/modules/input/puck-input/components/layer-puck/layer-puck.component';
import { MapLayer } from '../interfaces/mapLayer';
import { Scenario } from '../interfaces/scenario';

export enum StateUpdateType {
  year = 'year',
  layerselection = 'layerselection',
  layertoggle = 'layertoggle',
  scenario = 'scenario'
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private currentYear = 2016;
  public currentYearSub = new BehaviorSubject<number>(this.currentYear);

  private currentScenario = 0;
  private scenarios: Scenario[] = [];
  public currentScenarioSub = new BehaviorSubject<string>(null);

  private currentLayer = 0;
  private layers: MapLayer[] = [];
  public currentLayerSub = new BehaviorSubject<string>(null);

  constructor(private electronService: ElectronService) {
    this.electronService.windowMessageSubject.subscribe(message => {
      this.processMessage(message);
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
        this.setLayer(msg.layer);
        break;
    }
  }


  public decrementCurrentYear() {
    this.currentYear--;
    this.setYear(this.currentYear);
    this.electronService.sendMessage({ type: 'year', year: this.currentYear })
  }

  public incrementCurrentYear() {
    this.currentYear++;
    this.setYear(this.currentYear);
    this.electronService.sendMessage({ type: 'year', year: this.currentYear })
  }

  private setYear(year: number) {
    this.currentYear = year;
    this.currentYearSub.next(this.currentYear);
  }

  public decrementNextLayer() {
    this.currentLayer--;
    this.setLayer(this.currentLayer);
    this.electronService.sendMessage({ type: 'layerselection', layer: this.currentLayer })
  }

  public incrementNextLayer() {
    this.currentLayer++;
    this.setLayer(this.currentLayer);
    this.electronService.sendMessage({ type: 'layerselection', layer: this.currentLayer })
  }

  private setLayer(layer: number) {
    this.currentLayer = layer;
    this.currentLayerSub.next(this.layers[this.currentLayer].name);
  }

  public toggleLayer() {
    console.log('Toggle Layer')
  }

  public decrementScenario() {
    this.currentScenario--;
    this.setScenario(this.currentScenario);
    this.electronService.sendMessage({ type: 'scenario', scenario: this.currentScenario })
  }

  public incrementScenario() {
    this.currentScenario++;
    this.setScenario(this.currentScenario);
    this.electronService.sendMessage({ type: 'scenario', scenario: this.currentScenario })
  }

  private setScenario(scenario: number) {
    this.currentScenario = scenario;
    this.currentScenarioSub.next(this.scenarios[this.currentScenario].name);
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
    console.log('Get Current Year');
    return 2017;
  }
}
