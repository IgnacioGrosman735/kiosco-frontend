import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id: number;             // Identificador único del proveedor (primary key)
  cuit: string;           // CUIT del proveedor, es un campo requerido
  razon_social: string;   // Razón social del proveedor, es un campo requerido
  condicion_fiscal?: string; // Condición fiscal del proveedor, es opcional
  direccion?: string;     // Dirección del proveedor, es opcional
  telefono?: string;      // Teléfono del proveedor, es opcional
  email?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:5000/proveedores'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) { }

  // Obtener todos los proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  // Crear un nuevo proveedor
  addProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  // Actualizar un proveedor existente
  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Proveedor>(url, proveedor);
  }

  // Eliminar un proveedor
  deleteProveedor(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
