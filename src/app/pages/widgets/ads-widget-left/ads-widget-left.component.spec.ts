import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsWidgetLeftComponent } from './ads-widget-left.component';

describe('AdsWidgetLeftComponent', () => {
  let component: AdsWidgetLeftComponent;
  let fixture: ComponentFixture<AdsWidgetLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsWidgetLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsWidgetLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
