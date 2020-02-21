import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private currentYear = 2016;
  public currentYearSub = new BehaviorSubject<number>(this.currentYear);

  private currentScenario = 0;
  public currentScenarioSub = new BehaviorSubject<number>(this.currentScenario);

  private currentLayer = 0;
  public currentLayerSub = new BehaviorSubject<number>(this.currentLayer);

  constructor(private electronService: ElectronService) {
    this.electronService.windowMessageSubject.subscribe(message => {
      this.processMessage(message);
    })
   }

  public processMessage(msg) {
    switch(msg.update) {
      case 'year':
        this.setYear(msg.year);
        break;
      case 'scenario':
        this.setScenario(msg.scenario);
        break;
      case 'layer':
        this.setLayer(msg.layer);
        break;
    }
  }


  public decrementCurrentYear() {
    console.log('Decrement Year')
    this.currentYear--;
    this.electronService.sendMessage({update: 'year', year: this.currentYear })
  }

  public incrementCurrentYear() {
    console.log('Increment Year')
    this.currentYear++;
    this.electronService.sendMessage({update: 'year', year: this.currentYear })
  }

  private setYear(year: number) {
    this.currentYear = year;
    this.currentYearSub.next(this.currentYear);
  }

  public decrementNextLayer() {
    console.log('Decrement Layer')
    this.currentLayer--;
    this.electronService.sendMessage({update: 'layer', layer: this.currentLayer })
  }

  public incrementNextLayer() {
    console.log('Increment Layer')
    this.currentLayer++;
    this.electronService.sendMessage({update: 'layer', layer: this.currentLayer })
  }

  private setLayer(layer: number) {
    this.currentLayer = layer;
    this.currentLayerSub.next(this.currentLayer);
  }

  public decrementScenario() {
    console.log('Decrement Scenario')
    this.currentScenario--;
    this.electronService.sendMessage({update: 'scenario', scenario: this.currentScenario })
  }

  public incrementScenario() {
    console.log('Increment Scenario')
    this.currentScenario++;
    this.electronService.sendMessage({update: 'scenario', scenario: this.currentScenario })
  }

  private setScenario(scenario: number) {
    this.currentScenario = scenario;
    this.currentScenarioSub.next(this.currentScenario);
  }

  public toggleLayer() {
    console.log('Toggle Layer')

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

  public getCurrentYear():number {
    console.log('Get Current Year');
    return 2017;
  }
}
