import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondscreenWaitingComponent } from './secondscreen-waiting.component';

describe('SecondscreenWaitingComponent', () => {
  let component: SecondscreenWaitingComponent;
  let fixture: ComponentFixture<SecondscreenWaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondscreenWaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondscreenWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
