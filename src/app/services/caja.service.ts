import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Importa environment
import { RegistroCaja } from '../models/registro-caja.model';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private apiUrl = environment.API_URL;  // Usa environment.apiUrl

  constructor(private http: HttpClient) { }

  obtenerRegistrosCaja(): Observable<RegistroCaja[]> {
    return this.http.get<RegistroCaja[]>(`${this.apiUrl}/caja`);
  }

  // Nueva función para obtener registros por rango de fechas
  obtenerRegistrosPorRango(fechaInicio: Date, fechaFin: Date): Observable<RegistroCaja[]> {
    const params = {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    };
    return this.http.get<RegistroCaja[]>(`${this.apiUrl}/caja/filtrar`, { params });
  }
}
