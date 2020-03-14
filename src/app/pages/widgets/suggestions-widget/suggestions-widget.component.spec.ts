import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsWidgetComponent } from './suggestions-widget.component';

describe('SuggestionsWidgetComponent', () => {
  let component: SuggestionsWidgetComponent;
  let fixture: ComponentFixture<SuggestionsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestionsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
