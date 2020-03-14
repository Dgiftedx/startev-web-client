import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeHubBusinessManagementComponent } from './knowledge-hub-business-management.component';

describe('KnowledgeHubBusinessManagementComponent', () => {
  let component: KnowledgeHubBusinessManagementComponent;
  let fixture: ComponentFixture<KnowledgeHubBusinessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeHubBusinessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeHubBusinessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
