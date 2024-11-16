// DevExtreme Modules
import { 
  DxDataGridModule, 
  DxSelectBoxModule,
  DxNumberBoxModule,
  DxTextBoxModule,
  DxButtonModule,
  DxToastModule
} from 'devextreme-angular';

import { Component, OnInit } from '@angular/core';
import { ComprasService } from '../../services/compras.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../services/proveedor.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../services/productos.service';
import { RowClickEvent } from "devextreme/ui/data_grid";
import { Compras, Compra, ProductoTemporal } from '../../models/compras.model';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    FormsModule,
    NgIf, 
    CommonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxToastModule
  ],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
  providers: [ComprasService]
})
export class ComprasComponent implements OnInit {

  mostrarFormulario = false;
  // Estructura de la compra
  compra: Compra = {
    proveedor_id: null,
    productos: [
      {
        producto_id: null,
        cantidad: 1
      }
    ]
  };

  productoTemporal: ProductoTemporal = {
    proveedor_id: null,
    producto_id: null,
    nombre: "",
    cantidad: 1,
    precio: 0
  };

  compraDataGrid: any = {
    productos: []
  };
  
  compras: Compras[] = [];
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  selectedCompra: Compras | null = null; // Para almacenar la compra seleccionada
  detalles: any[] = []; // Para almacenar los detalles de la compra seleccionada
  preciosProductos = Array(this.productosFiltrados.length).fill('0');

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

  constructor(
    private comprasService: ComprasService,
    private proveedorService: ProveedorService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.obtenerCompras();

    this.proveedorService.getProveedores().subscribe((data: any) => {
      this.proveedores = data;
    });

    this.productosService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (error) => console.error('Error al obtener productos', error)      
    });
  }

  // Método para obtener las compras desde el backend
  obtenerCompras() {
    this.comprasService.obtenerCompras().subscribe({
      next: (data) => { this.compras = data;  // Guardamos los datos de las compras en el array compras
      },
      error: (error) => console.error('Error al obtener compras', error)
    });
  }


  // Método para manejar el clic en una fila
  onRowClick(event: RowClickEvent) {
    const compraId = event.data.id; // Obtener el id de la compra seleccionada
    this.mostrarDetalles(compraId); // Llamar a la función para mostrar detalles
  }

  // Método para obtener y mostrar detalles de la compra
  mostrarDetalles(compraId: number) {
    this.comprasService.obtenerDetalles(compraId).subscribe({
      next: (data: Compras) => {
        this.selectedCompra = data; // Almacena toda la compra, incluyendo detalles
        this.detalles = this.selectedCompra.detalles; // Almacena solo los detalles
        console.log(this.selectedCompra); // Verifica que se almacenen correctamente
      },
      error: (error) => console.error('Error al obtener detalles de la compra', error)
    });
  }

   // Método para registrar una compra
   registrarCompra() {
    
    // Copia solo producto_id y cantidad de compraDataGrid.productos a compra.productos
    this.compra.productos = this.compraDataGrid.productos.map((producto: { producto_id: any; cantidad: any; precio: any;}) => ({
      producto_id: producto.producto_id,
      cantidad: producto.cantidad,
      costo_unitario: producto.precio
    }));
    
    if (this.compra.proveedor_id && this.compra.productos.length > 0) {
      this.comprasService.registrarCompra(this.compra).subscribe({
        next: () => {
          this.toastMessage = 'Compra registrada exitosamente';
          this.toastType = 'success';  // Asigna un valor permitido
          this.toastVisible = true;
          this.obtenerCompras(); // Recargar la lista de compras después de registrar una nueva
          this.limpiarFormularioCompleto();
        },
        error: (error) => {
          console.error('Error al registrar compra', error);
        }
      });
    } else {
      this.toastMessage = 'Error al registrar la compra';
      this.toastType = 'error';  // Otro valor permitido
      this.toastVisible = true;
    }
  }

  // Agregar un nuevo producto a la compra
  agregarProducto() {
    // Validar que el producto seleccionado sea válido
    if (this.productoTemporal.producto_id) {
      // Agregar el producto temporal a la lista de productos
      this.compraDataGrid.productos.push({
        producto_id: this.productoTemporal.producto_id,
        nombre: this.productoTemporal.nombre,
        cantidad: this.productoTemporal.cantidad,
        precio: this.productoTemporal.precio,
        total: this.productoTemporal.precio * this.productoTemporal.cantidad
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
    this.productoTemporal = {
      proveedor_id: null,
      producto_id: null,
      nombre: "",
      cantidad: 1,
      precio: 0
      };
  }

  // Eliminar un producto de la compra
  eliminarProducto(index: number) {
    if (this.compra.productos.length > 1) {
      this.compra.productos.splice(index, 1);
    }
  }

  onProveedorChange(proveedorId: number | null) {
    console.log("Proveedor seleccionado:", proveedorId);
    this.compra.proveedor_id = proveedorId;
    console.log("Estado de compra:", this.compra);
    if (proveedorId) {      
      // Hacemos la consulta para obtener los productos del proveedor desde la tabla intermedia
      this.comprasService.getProductosPorProveedor(proveedorId).subscribe({
        next: (productos: Producto[]) => {
          this.productosFiltrados = productos; // Aquí se asignan los productos que vienen del servidor
        },
        error: (err) => {
          console.error('Error al cargar productos para el proveedor', err);
          this.productosFiltrados = [];
        }
      });
    } else {
      // Si no hay proveedor seleccionado, vaciamos la lista de productos filtrados
      this.productosFiltrados = [];
    }

    // Limpiamos los productos seleccionados en la compra
    this.compra.productos.forEach((prod) => {
      prod.producto_id = null; // Solo modificamos producto_id, dejando las demás propiedades intactas
    });
  }

  // Evento que ocurre cuando el valor del producto cambia
  onProductoChange(productoId: number | null) {
    if (productoId !== null) {
      const proveedorId = this.compra.proveedor_id;
  
      if (proveedorId !== null) {
        // Buscar el producto seleccionado en productosFiltrados
        const productoSeleccionado = this.productosFiltrados.find(p => p.id === productoId);
        
        if (productoSeleccionado) {
          // Asignar el nombre del producto seleccionado a productoTemporal.nombre
          this.productoTemporal.nombre = productoSeleccionado.nombre;
         
        } else {
          console.error('Producto no encontrado en productosFiltrados');
        }
      } else {
        console.error('Proveedor no seleccionado');
        this.productoTemporal.precio = 0; // Si no hay proveedor, precio es 0
      }
    }
  }

  get precioTemporal(): string {
    return this.productoTemporal.precio.toString();
  }
  
  set precioTemporal(value: string) {
    this.productoTemporal.precio = parseFloat(value) || 0;
  }

  limpiarFormularioCompleto() {
    // Reinicia la información de la compra
    this.compra = {
      proveedor_id: null,
      productos: [
        {
          producto_id: null,
          cantidad: 1
        }
      ]
    };
  
    // Reinicia el producto temporal
    this.productoTemporal = {
      proveedor_id: null,
      producto_id: null,
      nombre: "",
      cantidad: 1,
      precio: 0
      };
  
    // Vaciar el grid de productos
    this.compraDataGrid.productos = [];
  
    // Limpiar el listado de productos filtrados
    this.productosFiltrados = [];
    
  }
  
  
}