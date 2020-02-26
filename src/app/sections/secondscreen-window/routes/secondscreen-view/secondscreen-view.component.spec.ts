import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondscreenViewComponent } from './secondscreen-view.component';

describe('SecondscreenViewComponent', () => {
  let component: SecondscreenViewComponent;
  let fixture: ComponentFixture<SecondscreenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondscreenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondscreenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
