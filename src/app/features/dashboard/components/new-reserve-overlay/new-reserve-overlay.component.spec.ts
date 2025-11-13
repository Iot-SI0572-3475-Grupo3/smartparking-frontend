import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReserveOverlayComponent } from './new-reserve-overlay.component';

describe('NewReserveOverlayComponent', () => {
  let component: NewReserveOverlayComponent;
  let fixture: ComponentFixture<NewReserveOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReserveOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewReserveOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
