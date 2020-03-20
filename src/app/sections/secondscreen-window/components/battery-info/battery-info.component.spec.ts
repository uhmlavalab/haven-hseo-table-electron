import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryInfoComponent } from './battery-info.component';

describe('BatteryInfoComponent', () => {
  let component: BatteryInfoComponent;
  let fixture: ComponentFixture<BatteryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
