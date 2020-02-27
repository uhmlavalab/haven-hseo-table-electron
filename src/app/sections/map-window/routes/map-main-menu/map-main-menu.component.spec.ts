import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMainMenuComponent } from './map-main-menu.component';

describe('MapMainMenuComponent', () => {
  let component: MapMainMenuComponent;
  let fixture: ComponentFixture<MapMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
