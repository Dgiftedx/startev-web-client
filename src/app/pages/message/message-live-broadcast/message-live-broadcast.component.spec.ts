import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLiveBroadcastComponent } from './message-live-broadcast.component';

describe('MessageLiveBroadcastComponent', () => {
  let component: MessageLiveBroadcastComponent;
  let fixture: ComponentFixture<MessageLiveBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageLiveBroadcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageLiveBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
