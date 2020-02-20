import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuckWindowLayoutComponent } from './puck-window-layout.component';

describe('PuckWindowLayoutComponent', () => {
  let component: PuckWindowLayoutComponent;
  let fixture: ComponentFixture<PuckWindowLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuckWindowLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuckWindowLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
