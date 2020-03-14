import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagerSettingsComponent } from './store-manager-settings.component';

describe('StoreManagerSettingsComponent', () => {
  let component: StoreManagerSettingsComponent;
  let fixture: ComponentFixture<StoreManagerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
