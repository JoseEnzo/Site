import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private apiUrl = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient) {}

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }
}