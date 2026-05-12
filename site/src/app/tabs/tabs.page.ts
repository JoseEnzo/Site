import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  home,
  logoWhatsapp,
  callOutline,
  chevronDownCircleOutline,
  logoInstagram,
  homeOutline,
  personAddOutline,
  hammerOutline,
  logInOutline,
  carSportOutline,    
  clipboardOutline,    
  locationOutline,
  
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})

export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private router: Router,
    private toastController: ToastController,
  ) {
    addIcons({
      triangle,
      ellipse,
      square,
      home,
      logoWhatsapp,
      callOutline,
      logoInstagram,
      chevronDownCircleOutline,
      homeOutline,
      personAddOutline,
      hammerOutline,
      logInOutline,
      carSportOutline,    
      clipboardOutline,    
      locationOutline,
    });
  }

  get estaLogado(): boolean {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  return !!(token && usuario); 
}
  async validarAcesso(rota: string) {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
      this.router.navigate([rota]);
    } else {
      const toast = await this.toastController.create({
        message: 'Você precisa estar conectado para acessar essa área',
        duration: 3000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();

      this.router.navigate(['/tabs/tab2']);
    }
  }
}
