import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../services/productos.service';
import { DxDataGridModule, DxFormModule, DxButtonModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../services/proveedor.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, NgFor, DxDataGridModule, DxFormModule, DxButtonModule, DxSelectBoxModule, DxTemplateModule, NgIf],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit{
  
  productos: Producto[] = []; // Array para almacenar la lista de productos
  proveedores: Proveedor[] = []; // Array para almacenar la lista de proveedores
  isEditing = false; // Flag para determinar si se está editando
  selectedProveedor: Producto | null = null; // Proveedor seleccionado para editar o eliminar

  constructor(
    private productosService: ProductosService,
    private proveedorService: ProveedorService
  ) {}
  
  ngOnInit(): void {
    this.getProductos(); // Cargar los proveedores al iniciar el componente
    
    this.proveedorService.getProveedores().subscribe((data: any) => {
        this.proveedores = data;
        console.log('Proveedores:', this.proveedores);  // Verifica que los proveedores se hayan cargado
        
      });
  }

  // Método para obtener la lista de productos
  getProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {this.productos = data,
      console.log('Productos:', this.productos)},  // Verifica que los proveedores se hayan cargado
      error: (error) => console.error('Error al obtener productos', error)      
    });    
  }

  // Manejar cuando se empieza a editar
  onRowEditingStarted(e: any) {
    this.isEditing = true;
  }

  // Manejar cuando se está insertando un nuevo registro
  onRowInsertingStarted(e: any) {
    this.isEditing = false;
  }

  // Método para manejar la preparación del editor
  onEditorPreparing(e: any) {
    if (e.dataField === 'proveedor_id') {
      e.editorOptions.disabled = this.isEditing; // Deshabilitar si se está editando
    }
  }

  // Método para manejar la adición de una nueva fila
  onRowInserted(e: any) {
    const nuevoProveedor = e.data;  // Extrae los datos del nuevo proveedor
    this.addProdcuto(nuevoProveedor);
  }
  // Método para agregar un nuevo producto
  addProdcuto(producto: Producto): void {
    this.productosService.createProducto(producto).subscribe({
      next: (addedProducto) => {
        console.log('Producto agregado:', addedProducto);
        this.getProductos(); // Refrescar la lista de proveedores
      },
      error: (error) => console.error('Error al agregar producto', error)
    });
  }

  // Método para actualizar un producto existente
  onRowUpdated(e: any) {
    const updateProducto = e.data;
    this.updateProducto(updateProducto);
  }
  
  updateProducto(producto: Producto) {
    if (producto && producto.id) {
      this.productosService.updateProducto(producto.id, producto)
        .subscribe({
          next: (updatedProducto) => {
            console.log('Producto actualizado:', updatedProducto);
            this.getProductos(); // Refrescar la lista de productos
            this.cancelEdit(); // Cancelar la edición
          },
          error: (error) => {
            console.error('Error actualizando el producto:', error);
          }
      });
    }
  }

  // Método para eliminar un proveedor existente
  onRowRemoved(e: any) {
    const productoId = e.data.id;  // Extrae el ID del proveedor eliminado
    this.deleteProducto(productoId);  // Llama al método de eliminación con el ID
  }
  // Método para eliminar un proveedor
  deleteProducto(id: number): void {
    this.productosService.deleteProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== id);
        this.cancelEdit(); // Cancelar la edición si se estaba editando el proveedor eliminado
      },
      error: (error) => console.error('Error al eliminar producto', error)
    });
  }

  // Método para cancelar la edición
  cancelEdit(): void {
    this.selectedProveedor = null;
    this.isEditing = false;
  }
  
}
