import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentureDashboardComponent } from './venture-dashboard.component';

describe('VentureDashboardComponent', () => {
  let component: VentureDashboardComponent;
  let fixture: ComponentFixture<VentureDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentureDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
