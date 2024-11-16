import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './productos.service';
import { environment } from '../../environments/environment';  // Importa environment
import { Compras } from '../models/compras.model';


@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  
  private apiUrl = environment.API_URL;  // Usa environment.apiUrl

  constructor(private http: HttpClient) { }

  // Método para registrar una nueva compra
  registrarCompra(compraData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/compras`, compraData);
  }

  // Método para obtener todas las compras
  obtenerCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/compras`);
  }

  // Método para obtener los detalles de una compra específica
  obtenerDetalles(compraId: number): Observable<Compras> {
    return this.http.get<Compras>(`${this.apiUrl}/compras/${compraId}`); // Ajusta la ruta según tu API
  }

  getProductosPorProveedor(proveedorId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/compras/${proveedorId}/productos`);
  } 

  getPrecioPorProducto(proveedorId: number, productoId: number): Observable<{ precio: number }> {
    return this.http.get<{ precio: number }>(`${this.apiUrl}/compras/${proveedorId}/${productoId}`);
  }
}

