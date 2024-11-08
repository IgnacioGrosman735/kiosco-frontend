import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

export interface DetalleVenta {
  cantidad: number;
  venta_total: number; // O number, dependiendo de cómo lo manejes
  precio_unitario: number;
  producto_id: number;
}

export interface Ventas {
  id: number;             // Identificador único del proveedor (primary key)
  cliente_id: string;
  fecha: string;
  venta_total: number;
  detalles: DetalleVenta[];
}

export interface VentaDataGrafico {
  categoria: string;
  producto: string;
  total_venta: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiUrl = process?.env?.['API_URL'] || 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  obtenerPrecioProducto(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/productos/${id}/precio`);
  }

  registrarVenta(ventaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ventas`, ventaData);
  }

  obtenerProductos() {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  // Método para obtener todas las compras
  obtenerVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas`);
  }

  // Método para obtener los detalles de una compra específica
  obtenerDetalles(ventaId: number): Observable<Ventas> {
    return this.http.get<Ventas>(`${this.apiUrl}/ventas/${ventaId}`); // Ajusta la ruta según tu API
  }


  // Métodos para el Pivot Grid

  // Método para obtener las ventas agrupadas
  getVentasAgrupadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pivot-ventas`).pipe(
      shareReplay(1) // Comparte la respuesta entre suscriptores
    );
  }

  // Métodos para Gráfico
  // Llamada para obtener las ventas agrupadas por mes y producto
  obtenerVentasPorMes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grafico-ventas`);
  }

  // Llamada para obtener la lista de productos con sus categorías
  obtenerProductosCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos-categorias`);
  }


}