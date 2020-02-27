import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondscreenMainMenuComponent } from './secondscreen-main-menu.component';

describe('SecondscreenMainMenuComponent', () => {
  let component: SecondscreenMainMenuComponent;
  let fixture: ComponentFixture<SecondscreenMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondscreenMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondscreenMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
