import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  ToastController,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, logOutOutline, logoWhatsapp, 
  callOutline, chevronDownCircleOutline,
  hammerOutline, colorPaletteOutline, constructOutline,
  sparklesOutline, timeOutline, settingsOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { ServicoService, Servico } from '../services/servico.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule,
    IonRefresher, IonRefresherContent, RouterModule,
    IonIcon, IonRippleEffect, IonChip, IonButton,
  ],
})
export class HomePage implements OnInit {
  usuarioLogado: any = null;
  year = new Date().getFullYear();
  servicos: Servico[] = [];
  carregando = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private servicoService: ServicoService,
  ) {
    addIcons({ 
      personCircleOutline, logOutOutline, logoWhatsapp, 
      callOutline, chevronDownCircleOutline,
      hammerOutline, colorPaletteOutline, constructOutline,
      sparklesOutline, timeOutline, settingsOutline, arrowForwardOutline
    });
  }

  ngOnInit() {
    this.carregarUsuario();
    this.carregarServicos();
  }

  // ✅ Separado em método próprio para reutilizar
  private carregarUsuario() {
    try {
      const data = localStorage.getItem('usuario');
      this.usuarioLogado = data ? JSON.parse(data) : null;
    } catch (e) {
      // JSON corrompido no localStorage — limpa para não travar
      console.warn('Dados de usuário inválidos, limpando...', e);
      localStorage.removeItem('usuario');
      this.usuarioLogado = null;
    }
  }

  carregarServicos() {
    if (this.carregando) return; // ✅ Evita chamadas duplicadas
    this.carregando = true;

    this.servicoService.getServicos().subscribe({
      next: (data) => {
        this.servicos = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao buscar serviços', err);
        this.carregando = false; // ✅ Sempre libera o flag mesmo com erro
      }
    });
  }

  ionViewWillEnter() {
    this.carregarUsuario(); // ✅ Usa o método seguro com try/catch
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.carregarUsuario();
      this.carregarServicos();
      event.target.complete();
    }, 2000);
  }

  async validarAcesso(rota: string) {
    if (this.usuarioLogado) {
      this.router.navigate([rota]);
    } else {
      localStorage.setItem('redirectAfterLogin', rota)

      const toast = await this.toastController.create({
        message: 'Você precisa estar conectado para acessar essa área',
        duration: 3000,
        position: 'top',
        color: 'danger',
        cssClass: 'garage-toast',
      });
      await toast.present();
      
      setTimeout(() => {
        this.router.navigate(['/tabs/tab2']); 
      }, 1000);
    }
  }

  irPara(slug: string) {
    const mapa: { [key: string]: () => void } = {
      funilaria: () => this.validarAcesso('/tabs/funilaria'),
      pintura: () => this.validarAcesso('/tabs/pintura'),
      serralheria: () => this.validarAcesso('/tabs/serralheria'),
      polimento: () => this.validarAcesso('/tabs/polimento'),
      restauracao: () => this.validarAcesso('/tabs/restauracao'),
      reforma: () => this.validarAcesso('/tabs/reforma'),
    };
    mapa[slug]?.();
  }

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioLogado = null;
    this.router.navigate(['/tabs/home']);
  }
}