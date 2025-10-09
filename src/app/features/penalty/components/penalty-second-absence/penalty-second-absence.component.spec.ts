import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltySecondAbsenceComponent } from './penalty-second-absence.component';

describe('PenaltySecondAbsenceComponent', () => {
  let component: PenaltySecondAbsenceComponent;
  let fixture: ComponentFixture<PenaltySecondAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltySecondAbsenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenaltySecondAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
