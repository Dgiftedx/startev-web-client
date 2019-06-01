import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerProductsComponent } from './store-manager-products.component';

describe('StoreManagerProductsComponent', () => {
  let component: StoreManagerProductsComponent;
  let fixture: ComponentFixture<StoreManagerProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
