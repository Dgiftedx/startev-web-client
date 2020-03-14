import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManageProductsComponent } from './user-manage-products.component';

describe('UserManageProductsComponent', () => {
  let component: UserManageProductsComponent;
  let fixture: ComponentFixture<UserManageProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManageProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
