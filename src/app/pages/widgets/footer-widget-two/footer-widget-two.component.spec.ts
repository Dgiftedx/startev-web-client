import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterWidgetTwoComponent } from './footer-widget-two.component';

describe('FooterWidgetTwoComponent', () => {
  let component: FooterWidgetTwoComponent;
  let fixture: ComponentFixture<FooterWidgetTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterWidgetTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterWidgetTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
