import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpsWidgetComponent } from './sign-ups-widget.component';

describe('SignUpsWidgetComponent', () => {
  let component: SignUpsWidgetComponent;
  let fixture: ComponentFixture<SignUpsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
