import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuckActiveComponent } from './puck-active.component';

describe('PuckActiveComponent', () => {
  let component: PuckActiveComponent;
  let fixture: ComponentFixture<PuckActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuckActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuckActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
