import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = process?.env?.['API_URL'] || 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  
  loginUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
}
