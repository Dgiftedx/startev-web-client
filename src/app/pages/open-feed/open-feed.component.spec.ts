import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenFeedComponent } from './open-feed.component';

describe('OpenFeedComponent', () => {
  let component: OpenFeedComponent;
  let fixture: ComponentFixture<OpenFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
