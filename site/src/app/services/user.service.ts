import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  telefone?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'https://mutilator-haunt-skirt.ngrok-free.dev';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': '1' });

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'ngrok-skip-browser-warning': '1',
      'Authorization': `Bearer ${token}`
    });
  }

  // Alterado para LoginResponse para capturar o token no cadastro
  cadastrar(dados: Partial<Usuario>): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/user/cadastro`, dados, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  logar(dados: { email: string; senha: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/user/login`, dados, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: any) => {
    let mensagem = 'Erro desconhecido';
    if (error.status === 400) mensagem = 'Dados inválidos';
    if (error.status === 401) mensagem = 'Não autorizado';
    if (error.status === 500) mensagem = 'Erro no servidor';
    return throwError(() => new Error(mensagem));
  }
}