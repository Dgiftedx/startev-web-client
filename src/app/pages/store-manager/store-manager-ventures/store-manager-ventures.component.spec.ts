import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerVenturesComponent } from './store-manager-ventures.component';

describe('StoreManagerVenturesComponent', () => {
  let component: StoreManagerVenturesComponent;
  let fixture: ComponentFixture<StoreManagerVenturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerVenturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerVenturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
