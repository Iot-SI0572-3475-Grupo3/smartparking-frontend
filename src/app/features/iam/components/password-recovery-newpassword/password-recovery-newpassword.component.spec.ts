import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryNewpasswordComponent } from './password-recovery-newpassword.component';

describe('PasswordRecoveryNewpasswordComponent', () => {
  let component: PasswordRecoveryNewpasswordComponent;
  let fixture: ComponentFixture<PasswordRecoveryNewpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryNewpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordRecoveryNewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
