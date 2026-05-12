import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { UserService } from '@app/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RefresherCustomEvent } from '@ionic/angular/standalone';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    RouterLink,
    IonRefresherContent,
    IonInput,
    IonItem,
    FormsModule,
    IonButton,
  ],
})
export class Tab2Page {
  dados = {
    email: '',
    senha: '',
  };
  carregando = false;
  erro = '';
  sucesso = '';
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  async logar() {
    this.erro = '';
    this.sucesso = '';
    if (!this.dados.email && !this.dados.senha) {
      this.erro = 'Preencha todos os campos corretamente.';
      setTimeout(() => {
        this.erro = '';
      }, 3000);
      console.error('Email ou senha vazios');
      return;
    }
    this.carregando = true;
    this.userService.logar(this.dados).subscribe({
      next: (res) => {
        this.carregando = false;
        console.log('login realizado com sucesso!', res);
        this.sucesso = 'Login realizado com sucesso!';
        setTimeout(() => {
            this.sucesso = '';
        }, 3000);
        this.dados = { email: '', senha: '' };

        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario))
        
        const redirect = localStorage.getItem('redirectAfterLogin') ?? '/tabs/tab3'
        localStorage.removeItem('redirectAfterLogin')

        setTimeout(() => {
          this.router.navigate([redirect]);
        }, 1500);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = err.error?.message || 'Erro ao logar, tente novamente';
        setTimeout(() => {
          this.erro = '';
        }, 3000);
        console.error(err);
      },
    });
  }
  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
