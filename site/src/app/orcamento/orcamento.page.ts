import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonRippleEffect,
  ToastController,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  hammerOutline, carOutline, chatboxOutline, callOutline,
  logoWhatsapp, checkmarkCircleOutline, arrowBackOutline, sendOutline
} from 'ionicons/icons';
import { OrcamentoService } from '../services/orcamentos.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: 'orcamento.page.html',
  styleUrls: ['orcamento.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule,
    RouterModule, IonIcon, IonRippleEffect,
  ],
})
export class OrcamentoPage {

  dados = {
    servico: '',
    veiculo: '',
    descricao: '',
    contato: '',
  };

  carregando = false; // ✅ estava faltando a declaração
  enviado = false;

  constructor(
    private orcamentoService: OrcamentoService,
    private toastController: ToastController,
  ) {
    addIcons({
      hammerOutline, carOutline, chatboxOutline, callOutline,
      logoWhatsapp, checkmarkCircleOutline, arrowBackOutline, sendOutline
    });
  }

  async enviar() {
    if (this.carregando) return;

    if (!this.dados.servico || !this.dados.veiculo || !this.dados.descricao || !this.dados.contato) {
      const toast = await this.toastController.create({
        message: 'Preencha todos os campos do protocolo.',
        duration: 3000,
        cssClass: 'garage-toast',
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }


    const usuarioStorage = localStorage.getItem('usuario');
    if (!usuarioStorage) {
      const toast = await this.toastController.create({
        message: 'Identifique-se para solicitar um orçamento.',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.carregando = true;

    this.orcamentoService.enviar(this.dados).subscribe({
      next: () => {

        this.enviado = true;
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro ao salvar no banco:', err);
      },
    });
  }

  getMsgWhatsApp(): string {
    return encodeURIComponent(
      `Olá! Gostaria de um orçamento:\n\n` +
      `🔧 *Serviço:* ${this.dados.servico}\n` +
      `🚗 *Veículo:* ${this.dados.veiculo}\n` +
      `📝 *Descrição:* ${this.dados.descricao}\n` +
      `📞 *Contato:* ${this.dados.contato}`
    );
  }

  novoOrcamento() {
    this.dados = { servico: '', veiculo: '', descricao: '', contato: '' };
    this.carregando = false;
    this.enviado = false;
  }
}