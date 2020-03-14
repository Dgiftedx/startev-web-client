import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsWidgetComponent } from './ads-widget.component';

describe('AdsWidgetComponent', () => {
  let component: AdsWidgetComponent;
  let fixture: ComponentFixture<AdsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
