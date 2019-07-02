import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerFieldsComponent } from './career-fields.component';

describe('CareerFieldsComponent', () => {
  let component: CareerFieldsComponent;
  let fixture: ComponentFixture<CareerFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
