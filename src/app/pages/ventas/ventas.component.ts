// DevExtreme Modules
import { 
  DxDataGridModule, 
  DxSelectBoxModule,
  DxNumberBoxModule,
  DxTextBoxModule,
  DxButtonModule,
  DxToastModule
} from 'devextreme-angular';

import { Component, inject, OnInit } from '@angular/core';
import { Ventas, VentasService } from '../../services/ventas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Producto } from '../../services/productos.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    FormsModule, 
    NgFor, 
    NgIf, 
    CommonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxToastModule
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
  providers: [VentasService]
})
export class VentasComponent implements OnInit {
  
  mostrarFormulario = false;

  venta: any = {
    "cliente_id": "Consumidor Final",
    "productos": [
        {
            "producto_id": null,
            "cantidad": 1,
            "precio_venta": null
        }
    ]
  }
 
  ventaTemporal: any = {
    "cliente_id": "Consumidor Final",
    "productos": [
        {
          "nombre": null,
          "producto_id": null,
          "cantidad": 1,
          "precio_venta": 0
        }
    ]
  }

  ventaDataGrid: any = {
    productos: []
  };

  productos: any[] = [];
  ventas: Ventas[] = [];
  selectedVenta: Ventas | null = null; // Para almacenar la venta seleccionada
  detalles: any[] = []; // Para almacenar los detalles de la venta seleccionada

  // Formateador personalizado de fechas para mostrar día/mes/año
  customDateFormatter = (date: Date) => {
    const day = ('0' + date.getDate()).slice(-2); // Día con dos dígitos
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes con dos dígitos
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Formato día/mes/año
  };

  toastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' | 'warning' = 'success';  // Tipos permitidos

  private _ventasService = inject(VentasService)

  ngOnInit() {
    this.obtenerVentas();
    this.cargarProductos();
  }

  cargarProductos() {
    this._ventasService.obtenerProductos().subscribe({
      next: (data: any) => {
        this.productos = data;  // Asigna la lista de productos 
        console.log(this.productos)       
      },
      error: (error) => {
        console.error('Error al obtener los productos', error);
      }
    });
  }

  // Método que se ejecuta al cambiar el producto seleccionado
  actualizarPrecio(productoId: number | null) {
    const productoSeleccionado = this.productos.find(
      (producto) => producto.id === productoId
    );

    if (productoSeleccionado) {
      this.ventaTemporal.nombre = productoSeleccionado.nombre;
      this.ventaTemporal.precio_venta = productoSeleccionado.precio_venta;
    }
  }

  // Método para obtener las ventas desde el backend
  obtenerVentas() {
    this._ventasService.obtenerVentas().subscribe({
      next: (data) => { this.ventas = data;
      },
      error: (error) => console.error('Error al obtener ventas', error)
    });
  }

  // Método para manejar el clic en una fila
  onRowClick(event: any) {
    const ventaId = event.data.id; // Obtener el id de la venta seleccionada
    this.mostrarDetalles(ventaId); // Llamar a la función para mostrar detalles
  }

  // Método para obtener y mostrar detalles de la compra
  mostrarDetalles(ventaId: number) {
    this._ventasService.obtenerDetalles(ventaId).subscribe({
      next: (data: Ventas) => {
        this.selectedVenta = data; // Almacena toda la venta, incluyendo detalles
        this.detalles = this.selectedVenta.detalles; // Almacena solo los detalles
        console.log(this.selectedVenta); // Verifica que se almacenen correctamente
      },
      error: (error) => console.error('Error al obtener detalles de la venta', error)
    });
  }

  // Agregar un nuevo producto a la venta
  agregarProducto() {
    // Validar que el producto seleccionado sea válido
    if (this.ventaTemporal.producto_id) {
      // Agregar el producto temporal a la lista de productos
      this.ventaDataGrid.productos.push({
        producto_id: this.ventaTemporal.producto_id,
        nombre: this.ventaTemporal.nombre,
        cantidad: this.ventaTemporal.cantidad,
        precio_venta: this.ventaTemporal.precio_venta,
        total: this.ventaTemporal.precio_venta * this.ventaTemporal.cantidad
      });

      // Limpiar el formulario
      this.limpiarFormulario();
    } else {
      alert('Debe seleccionar un producto antes de agregarlo.');
    }
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
    // Reiniciar los valores del producto temporal
    this.ventaTemporal = {
      producto_id: null,
      cantidad: 1
    };
  }

  // Método para registrar una compra
  registrarVenta() {
    
    this.venta.productos = this.ventaDataGrid.productos.map((producto: { producto_id: any; cantidad: any; precio_venta: any;}) => ({
      producto_id: producto.producto_id,
      cantidad: producto.cantidad,
      precio_venta: producto.precio_venta
    }));
    
    if (this.venta.productos.length > 0) {
      this._ventasService.registrarVenta(this.venta).subscribe({
        next: () => {
          this.toastMessage = 'Venta registrada exitosamente';
          this.toastType = 'success';  // Asigna un valor permitido
          this.toastVisible = true;
          this.obtenerVentas(); // Recargar la lista de compras después de registrar una nueva
          this.limpiarFormularioCompleto();
        },
        error: (error) => {
          console.error('Error al registrar venta', error);
        }
      });
    } else {
      this.toastMessage = 'Error al registrar la venta';
      this.toastType = 'error';  // Otro valor permitido
      this.toastVisible = true;
    }
  }

  limpiarFormularioCompleto() {
    this.venta = {
      cliente_id: "Consumidor Final",
      productos: [
        {
          producto_id: null,
          cantidad: 1,
          precio_venta: 0
        }
      ]
    };
  
    this.ventaTemporal = {
      producto_id: null,
      nombre: null,
      cantidad: 1,
      precio_venta: 0
    };
  
    this.ventaDataGrid.productos = [];
  }
}