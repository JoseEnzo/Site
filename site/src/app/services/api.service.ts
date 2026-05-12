import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_URL = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }


  getOrcamentosByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/meus-orcamentos/${userId}`);
  }


  criarOrcamento(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/orcamento`, dados);
  }
  cancelarOrcamento(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${environment.apiUrl}/orcamento/${id}`, {
      headers,
    });
  }
}