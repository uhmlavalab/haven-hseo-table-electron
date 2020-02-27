import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuckPlanSelectionComponent } from './puck-plan-selection.component';

describe('PuckPlanSelectionComponent', () => {
  let component: PuckPlanSelectionComponent;
  let fixture: ComponentFixture<PuckPlanSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuckPlanSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuckPlanSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
