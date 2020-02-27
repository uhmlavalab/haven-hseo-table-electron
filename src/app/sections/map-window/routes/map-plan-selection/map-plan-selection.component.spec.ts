import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlanSelectionComponent } from './map-plan-selection.component';

describe('PlanSelectionComponent', () => {
  let component: MapPlanSelectionComponent;
  let fixture: ComponentFixture<MapPlanSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPlanSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPlanSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
