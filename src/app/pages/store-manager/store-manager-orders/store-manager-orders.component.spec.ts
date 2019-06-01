import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerOrdersComponent } from './store-manager-orders.component';

describe('StoreManagerOrdersComponent', () => {
  let component: StoreManagerOrdersComponent;
  let fixture: ComponentFixture<StoreManagerOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
