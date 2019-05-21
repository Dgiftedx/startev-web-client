import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerBoardComponent } from './partner-board.component';

describe('PartnerBoardComponent', () => {
  let component: PartnerBoardComponent;
  let fixture: ComponentFixture<PartnerBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
