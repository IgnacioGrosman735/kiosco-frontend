import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComprasComponent } from './modal-compras.component';

describe('ModalComprasComponent', () => {
  let component: ModalComprasComponent;
  let fixture: ComponentFixture<ModalComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
