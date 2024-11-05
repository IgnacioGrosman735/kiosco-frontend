import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../services/proveedor.service';
import { DxDataGridModule, DxFormModule, DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-proveedores',
  standalone: true, // Declaramos el componente como standalone
  imports: [CommonModule, NgFor, DxDataGridModule, DxFormModule, DxButtonModule, NgIf], // Importamos los módulos necesarios
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  
  /* proveedorService = inject(ProveedorService); */ // Inyección del servicio
  
  proveedores: Proveedor[] = []; // Array para almacenar la lista de proveedores
  isEditing = false; // Flag para determinar si se está editando
  selectedProveedor: Proveedor | null = null; // Proveedor seleccionado para editar o eliminar

  constructor(private proveedorService: ProveedorService) {}
  
  ngOnInit(): void {
    this.getProveedores(); // Cargar los proveedores al iniciar el componente
  }

  // Método para obtener la lista de proveedores
  getProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: (error) => console.error('Error al obtener proveedores', error)
    });
  }


  // Método para manejar la adición de una nueva fila
  onRowInserted(e: any) {
    const nuevoProveedor = e.data;  // Extrae los datos del nuevo proveedor

    console.log('Nuevo proveedor:', nuevoProveedor);  // Imprime los datos en la consola

    // Llama a tu método para agregar el nuevo proveedor en el backend
    this.addProveedor(nuevoProveedor);
  }
  // Método para agregar un nuevo proveedor
  addProveedor(proveedor: Proveedor): void {
    this.proveedorService.addProveedor(proveedor).subscribe({
      next: (addedProveedor) => {
        console.log('Proveedor agregado:', addedProveedor);
        this.getProveedores(); // Refrescar la lista de proveedores
      },
      error: (error) => console.error('Error al agregar proveedor', error)
    });
  }
 

  onRowClick(event: any): void {
  console.log("Datos de la fila clickeada:", event.data);
  if (event.data) {
    this.selectProveedor(event.data);
  } else {
    console.log("No se encontraron datos en la fila.");
  }
}

  // Métodos para manejar clics en los botones
  onEditButtonClick(event: any): void {
    const data = event.row.data;
    this.selectProveedor(data);
  }

  // Método para seleccionar un proveedor para edición
  selectProveedor(proveedor: any): void {
    console.log('Proveedor recibido:', proveedor);
    this.selectedProveedor = { ...proveedor };
    this.isEditing = true;
    console.log("Metodo llamado")
  }

  // Método para actualizar un proveedor existente
  onRowUpdated(e: any) {
    const updatedProveedor = e.data;
  
    // Llama a tu método para actualizar el proveedor en el backend
    this.updateProveedor(updatedProveedor);
  }
  
  updateProveedor(proveedor: Proveedor) {
    if (proveedor && proveedor.id) {
      this.proveedorService.updateProveedor(proveedor.id, proveedor)
        .subscribe({
          next: (updatedProveedor) => {
            console.log('Proveedor actualizado:', updatedProveedor);
            this.getProveedores(); // Refrescar la lista de proveedores
            this.cancelEdit(); // Cancelar la edición
          },
          error: (error) => {
            console.error('Error actualizando el proveedor:', error);
          }
      });
    }
  }

  // Método para eliminar un proveedor existente
  onRowRemoved(e: any) {
    const proveedorId = e.data.id;  // Extrae el ID del proveedor eliminado
    this.deleteProveedor(proveedorId);  // Llama al método de eliminación con el ID
  }
  // Método para eliminar un proveedor
  deleteProveedor(id: number): void {
    this.proveedorService.deleteProveedor(id).subscribe({
      next: () => {
        this.proveedores = this.proveedores.filter(p => p.id !== id);
        this.cancelEdit(); // Cancelar la edición si se estaba editando el proveedor eliminado
      },
      error: (error) => console.error('Error al eliminar proveedor', error)
    });
  }

  // Método para crear un proveedor vacío
  createEmptyProveedor(): Proveedor {
    return {
      id: 0,
      cuit: '',
      razon_social: '',
      condicion_fiscal: '',
      direccion: '',
      telefono: '',
      email: ''
    };
  }

  // Método para cancelar la edición
  cancelEdit(): void {
    this.selectedProveedor = null;
    this.isEditing = false;
  }

  
  onDeleteButtonClick(event: any): void {
    const rowData = event.row.data;
    if (rowData.id) {
      this.deleteProveedor(rowData.id);
    }
  }
}

