import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Importa environment

export interface Producto {
  precio: any;
  id: number | null;
  nombre: string;
  descripcion: string;
  categoria: string;
  proveedor_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = environment.API_URL;  // Usa environment.apiUrl

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  getProducto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto);
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
