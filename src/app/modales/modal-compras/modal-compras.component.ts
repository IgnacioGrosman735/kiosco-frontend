import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ComprasComponent } from '../../pages/compras/compras.component';

@Component({
  selector: 'app-modal-compras',
  standalone: true,
  imports: [NgIf, ComprasComponent],
  templateUrl: './modal-compras.component.html',
  styleUrl: './modal-compras.component.css'
})
export class ModalComprasComponent {
 
  isOpen: boolean = false; // Variable para controlar la visibilidad del modal
  isMinimized: boolean = false; // Nuevo estado para minimizar

  // Método para abrir el modal
  openModal(): void {
    this.isOpen = true;
    this.isMinimized = false; // Al abrir, nos aseguramos de que no esté minimizado
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isOpen = false;
  }

  minimizeModal(): void {
    this.isMinimized = true;
  }

  restoreModal(): void {
    this.isMinimized = false;
  }

}
