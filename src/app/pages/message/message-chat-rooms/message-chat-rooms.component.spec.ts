import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageChatRoomsComponent } from './message-chat-rooms.component';

describe('MessageChatRoomsComponent', () => {
  let component: MessageChatRoomsComponent;
  let fixture: ComponentFixture<MessageChatRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageChatRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageChatRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
