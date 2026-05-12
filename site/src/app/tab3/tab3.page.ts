import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { AlertController } from '@ionic/angular/standalone';
import { OrcamentoService } from '@app/services/orcamentos.service';
import {
  carOutline,
  clipboardOutline,
  timeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  hourglassOutline,
  logoWhatsapp,
  lockClosedOutline,
  hammerOutline,
  arrowForwardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class Tab3Page {
  meusOrcamentos: any[] = [];
  usuario: any = null;
  carregando: boolean = false;

  constructor(
    private api: ApiService,
    private alertController: AlertController,
    private toastController: ToastController,
    private orcamentoService: OrcamentoService,
  ) {
    addIcons({
      carOutline,
      lockClosedOutline,
      clipboardOutline,
      hammerOutline,
      arrowForwardOutline,
      timeOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      hourglassOutline,
      logoWhatsapp,
    });
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

  doRefresh(event: any) {
    this.carregarDados(event);
  }

  carregarDados(event?: any) {
    const dadosStorage = localStorage.getItem('usuario');

    if (dadosStorage) {
      this.usuario = JSON.parse(dadosStorage);
      this.carregando = true;

      this.api.getOrcamentosByUser(this.usuario.id).subscribe({
        next: (res) => {
          this.meusOrcamentos = res.reverse();
          this.carregando = false;
          if (event) event.target.complete();
        },
        error: (err) => {
          console.error('Erro na conexão:', err);
          this.carregando = false;
          if (event) event.target.complete();
        },
      });
    } else {
      this.usuario = null;
      this.meusOrcamentos = [];
      if (event) event.target.complete();
    }
  }

  getStatusIcon(status: string): string {
    const mapa: any = {
      pendente: 'hourglass-outline',
      em_andamento: 'time-outline',
      concluido: 'checkmark-circle-outline',
      cancelado: 'close-circle-outline',
    };

    return mapa[status] ?? 'hourglass-outline';
  }

  getStatusLabel(status: string): string {
    const mapa: any = {
      pendente: 'Pendente',
      em_andamento: 'Em andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };
    return mapa[status] ?? 'Pendente';
  }
  getMsgContato(orc: any): string {
    return encodeURIComponent(
      `Olá! Gostaria de saber o status do meu orçamento:\n\n` +
        `🚗 *Veículo:* ${orc.veiculo}\n` +
        `🔧 *Serviço:* ${orc.servico}\n` +
        `📝 *Descrição:* ${orc.descricao}`,
    );
  }
  async cancelarOrcamento(orc: any) {
    // Confirmação antes de cancelar
    const alert = await this.alertController.create({
      header: 'Cancelar Orçamento',
      message: `Deseja cancelar o orçamento do ${orc.veiculo}?`,
      cssClass: 'garage-alert',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim, cancelar',
          role: 'confirm',
          handler: () => {
            this.confirmarCancelamento(orc);
          },
        },
      ],
    });
    await alert.present();
  }

  private confirmarCancelamento(orc: any) {
    this.api.cancelarOrcamento(orc.id).subscribe({
      next: () => {
        // Remove da lista local
        this.meusOrcamentos = this.meusOrcamentos.filter(
          (o) => o.id !== orc.id,
        );

        const msg = encodeURIComponent(
          `Olá! Estou cancelando o meu pedido de orçamento:\n\n` +
            `🚗 *Veículo:* ${orc.veiculo}\n` +
            `🔧 *Serviço:* ${orc.servico}\n` +
            `📝 *Descrição:* ${orc.descricao}`,
        );
        window.open(`https://wa.me/5518981212833?text=${msg}`, '_blank');
      },
      error: (err) => {
        console.error('Erro ao cancelar:', err);
      },
    });
  }
  async confirmarExclusao(id: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Orçamento!',
      message: 'Esta ação removerá o orçamento permanentemente do sistema.',
      buttons: [
        { text: 'Não', role: 'cancel' },
        {
          text: 'Sim, Excluir',
          handler: () => {
            this.executarExclusao(id);
          }
        }
      ]
    });
    await alert.present();
  }

  private executarExclusao(id: number) {
    this.orcamentoService.cancelar(id).subscribe({
      next: () => {
        this.meusOrcamentos = this.meusOrcamentos.filter(orc => orc.id !== id);
        this.exibirToast('Orçamento removido com sucesso!');
      },
      error: (err: any) => {
        console.error(err);
        this.exibirToast('Erro ao remover orçamento. Tente novamente.');
      }
    });
  }

  async exibirToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
