import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerTrackerComponent } from './store-manager-tracker.component';

describe('StoreManagerTrackerComponent', () => {
  let component: StoreManagerTrackerComponent;
  let fixture: ComponentFixture<StoreManagerTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
