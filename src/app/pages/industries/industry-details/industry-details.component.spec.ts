import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryDetailsComponent } from './industry-details.component';

describe('IndustryDetailsComponent', () => {
  let component: IndustryDetailsComponent;
  let fixture: ComponentFixture<IndustryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
