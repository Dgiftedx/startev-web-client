import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageConversationsComponent } from './message-conversations.component';

describe('MessageConversationsComponent', () => {
  let component: MessageConversationsComponent;
  let fixture: ComponentFixture<MessageConversationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageConversationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
