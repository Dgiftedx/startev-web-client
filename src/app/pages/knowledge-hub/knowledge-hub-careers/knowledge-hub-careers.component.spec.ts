import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeHubCareersComponent } from './knowledge-hub-careers.component';

describe('KnowledgeHubCareersComponent', () => {
  let component: KnowledgeHubCareersComponent;
  let fixture: ComponentFixture<KnowledgeHubCareersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeHubCareersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeHubCareersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
