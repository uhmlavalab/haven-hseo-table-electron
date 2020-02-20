import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondscreenWindowLayoutComponent } from './secondscreen-window-layout.component';

describe('SecondscreenWindowLayoutComponent', () => {
  let component: SecondscreenWindowLayoutComponent;
  let fixture: ComponentFixture<SecondscreenWindowLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondscreenWindowLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondscreenWindowLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
