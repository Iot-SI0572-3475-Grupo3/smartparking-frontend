import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateAbsencesCardComponent } from './state-absences-card.component';

describe('StateAbsencesCardComponent', () => {
  let component: StateAbsencesCardComponent;
  let fixture: ComponentFixture<StateAbsencesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateAbsencesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateAbsencesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});