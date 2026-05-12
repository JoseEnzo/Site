import { Component } from '@angular/core';
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonRefresher, IonRefresherContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { UserService, LoginResponse } from '../services/user.service'; 
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RefresherCustomEvent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    IonContent, 
    IonInput, 
    IonItem, 
    IonButton, 
    IonRefresher, 
    IonRefresherContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle
  ],
})
export class Tab1Page {
  dados = {
    email: '',
    nome: '',
    senha: '',
    telefone: ''
  };

  carregando = false;
  erro = '';
  sucesso = '';

  constructor(private userService: UserService, private router: Router) {}

  async cadastrar() {
    this.erro = '';
    this.sucesso = '';

    if (!this.dados.email || !this.dados.nome || !this.dados.senha || !this.dados.telefone) {
      this.erro = 'Preencha todos os campos corretamente';
      this.limparMensagem(3000);
      return;
    }

    this.carregando = true;

    this.userService.cadastrar(this.dados).subscribe({
      next: (res) => {
        console.log('Cadastro e Login automático feitos!', res);
        
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.sucesso = 'Cadastro realizado com sucesso!';

        setTimeout(() => {
          this.sucesso = '';
        }, 3000);
        this.carregando = false;
        
        this.dados = { email: '', nome: '', senha: '', telefone: '' };

        const redirect = localStorage.getItem('redirectAfterLogin')
        localStorage.removeItem('redirectAfterLogin')

        setTimeout(() => {
          this.router.navigate([redirect]);
        }, 1500);
      },
      error: (err) => {
        this.carregando = false;

        this.erro = err.message || 'Erro ao cadastrar, tente novamente';
        this.limparMensagem(3000);
        console.error(err);
      }
    });
  }

  private limparMensagem(tempo: number) {
    setTimeout(() => {
      this.erro = '';
      this.sucesso = '';
    }, tempo);
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}