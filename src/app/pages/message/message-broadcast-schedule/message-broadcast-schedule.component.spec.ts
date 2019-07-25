import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBroadcastScheduleComponent } from './message-broadcast-schedule.component';

describe('MessageBroadcastScheduleComponent', () => {
  let component: MessageBroadcastScheduleComponent;
  let fixture: ComponentFixture<MessageBroadcastScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageBroadcastScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBroadcastScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
