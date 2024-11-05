import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private apiUrl = 'http://localhost:5000'; // Asegúrate de que la URL coincida con tu configuración backend

  constructor(private http: HttpClient) { }

  obtenerRegistrosCaja(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/caja`);
  }

  // Nueva función para obtener registros por rango de fechas
  obtenerRegistrosPorRango(fechaInicio: Date, fechaFin: Date): Observable<any[]> {
    const params = {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    };
    return this.http.get<any[]>(`${this.apiUrl}/caja/filtrar`, { params });
  }
}
