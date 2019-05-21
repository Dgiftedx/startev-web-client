import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerWatchComponent } from './partner-watch.component';

describe('PartnerWatchComponent', () => {
  let component: PartnerWatchComponent;
  let fixture: ComponentFixture<PartnerWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
