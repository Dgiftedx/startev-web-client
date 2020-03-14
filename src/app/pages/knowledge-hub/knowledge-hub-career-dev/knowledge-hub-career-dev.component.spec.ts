import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeHubCareerDevComponent } from './knowledge-hub-career-dev.component';

describe('KnowledgeHubCareerDevComponent', () => {
  let component: KnowledgeHubCareerDevComponent;
  let fixture: ComponentFixture<KnowledgeHubCareerDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeHubCareerDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeHubCareerDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
