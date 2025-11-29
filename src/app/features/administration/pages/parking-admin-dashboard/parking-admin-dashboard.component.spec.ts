import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingAdminDashboardComponent } from './parking-admin-dashboard.component';

describe('ParkingAdminDashboardComponent', () => {
  let component: ParkingAdminDashboardComponent;
  let fixture: ComponentFixture<ParkingAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingAdminDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
