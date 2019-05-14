import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentureHubComponent } from './venture-hub.component';

describe('VentureHubComponent', () => {
  let component: VentureHubComponent;
  let fixture: ComponentFixture<VentureHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentureHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentureHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
