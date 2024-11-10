import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Importa environment

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = environment.API_URL;  // Usa environment.apiUrl

  constructor(private http: HttpClient) {}

  getStock(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock`);
  }
}
