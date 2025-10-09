import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyAccountSuspendedComponent } from './penalty-account-suspended.component';

describe('PenaltyAccountSuspendedComponent', () => {
  let component: PenaltyAccountSuspendedComponent;
  let fixture: ComponentFixture<PenaltyAccountSuspendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyAccountSuspendedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenaltyAccountSuspendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
