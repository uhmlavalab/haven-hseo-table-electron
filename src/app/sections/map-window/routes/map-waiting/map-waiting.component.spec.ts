import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWaitingComponent } from './map-waiting.component';

describe('MapWaitingComponent', () => {
  let component: MapWaitingComponent;
  let fixture: ComponentFixture<MapWaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
