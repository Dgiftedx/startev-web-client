import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerApplyComponent } from './partner-apply.component';

describe('PartnerApplyComponent', () => {
  let component: PartnerApplyComponent;
  let fixture: ComponentFixture<PartnerApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
