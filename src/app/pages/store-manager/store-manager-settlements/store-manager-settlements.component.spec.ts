import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerSettlementsComponent } from './store-manager-settlements.component';

describe('StoreManagerSettlementsComponent', () => {
  let component: StoreManagerSettlementsComponent;
  let fixture: ComponentFixture<StoreManagerSettlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerSettlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
