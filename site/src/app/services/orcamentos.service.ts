import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrcamentoDto {
  servico: string;
  veiculo: string;
  descricao: string;
  contato: string;
}

@Injectable({ providedIn: 'root' })
export class OrcamentoService {
  private apiUrl = `${environment.apiUrl}/orcamento`;

  constructor(private http: HttpClient) {}

  enviar(dados: OrcamentoDto): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, dados, { headers });
  }
  cancelar(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
  
}
