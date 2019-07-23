import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageChatGroupsComponent } from './message-chat-groups.component';

describe('MessageChatGroupsComponent', () => {
  let component: MessageChatGroupsComponent;
  let fixture: ComponentFixture<MessageChatGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageChatGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageChatGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
