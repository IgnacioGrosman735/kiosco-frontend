import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotVentasComponent } from './pivot-ventas.component';

describe('PivotVentasComponent', () => {
  let component: PivotVentasComponent;
  let fixture: ComponentFixture<PivotVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PivotVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PivotVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
