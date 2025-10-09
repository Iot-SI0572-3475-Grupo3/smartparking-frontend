import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyFirstAbsenceComponent } from './penalty-first-absence.component';

describe('PenaltyFirstAbsenceComponent', () => {
  let component: PenaltyFirstAbsenceComponent;
  let fixture: ComponentFixture<PenaltyFirstAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyFirstAbsenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenaltyFirstAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
