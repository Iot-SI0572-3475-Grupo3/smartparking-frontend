import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReserveCardComponent } from './new-reserve-card.component';

describe('NewReserveCardComponent', () => {
  let component: NewReserveCardComponent;
  let fixture: ComponentFixture<NewReserveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReserveCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewReserveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});