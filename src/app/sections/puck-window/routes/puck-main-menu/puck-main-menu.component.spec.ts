import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuckMainMenuComponent } from './puck-main-menu.component';

describe('PuckMainMenuComponent', () => {
  let component: PuckMainMenuComponent;
  let fixture: ComponentFixture<PuckMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuckMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuckMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
