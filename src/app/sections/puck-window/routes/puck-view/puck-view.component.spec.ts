import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuckViewComponent } from './puck-view.component';

describe('PuckViewComponent', () => {
  let component: PuckViewComponent;
  let fixture: ComponentFixture<PuckViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuckViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuckViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
