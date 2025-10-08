import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryEmailComponent } from './password-recovery-email.component';

describe('PasswordRecoveryEmailComponent', () => {
  let component: PasswordRecoveryEmailComponent;
  let fixture: ComponentFixture<PasswordRecoveryEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordRecoveryEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
