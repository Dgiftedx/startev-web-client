import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorsWidgetComponent } from './mentors-widget.component';

describe('MentorsWidgetComponent', () => {
  let component: MentorsWidgetComponent;
  let fixture: ComponentFixture<MentorsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
