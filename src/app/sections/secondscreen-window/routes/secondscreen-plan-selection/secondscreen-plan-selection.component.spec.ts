import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondscreenPlanSelectionComponent } from './secondscreen-plan-selection.component';

describe('SecondscreenPlanSelectionComponent', () => {
  let component: SecondscreenPlanSelectionComponent;
  let fixture: ComponentFixture<SecondscreenPlanSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondscreenPlanSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondscreenPlanSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
