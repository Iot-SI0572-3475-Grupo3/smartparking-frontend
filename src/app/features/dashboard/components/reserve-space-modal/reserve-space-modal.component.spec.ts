import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveSpaceModalComponent } from './reserve-space-modal.component';

describe('ReserveSpaceModalComponent', () => {
  let component: ReserveSpaceModalComponent;
  let fixture: ComponentFixture<ReserveSpaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveSpaceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserveSpaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
