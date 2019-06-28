import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeHubGeneralKnowledgeComponent } from './knowledge-hub-general-knowledge.component';

describe('KnowledgeHubGeneralKnowledgeComponent', () => {
  let component: KnowledgeHubGeneralKnowledgeComponent;
  let fixture: ComponentFixture<KnowledgeHubGeneralKnowledgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeHubGeneralKnowledgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeHubGeneralKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
