import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard'
export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { 
        path: 'home', 
        loadComponent: () => import('../home/home.page').then((m) => m.HomePage) 
      },
      { 
        path: 'orcamento', 
        canActivate: [authGuard],
        loadComponent: () => import('../orcamento/orcamento.page').then((m) => m.OrcamentoPage) 
      },

      { 
        path: 'tab1', 
        loadComponent: () => import('../tab1/tab1.page').then((m) => m.Tab1Page) 
      },
      { 
        path: 'tab2', 
        loadComponent: () => import('../tab2/tab2.page').then((m) => m.Tab2Page) 
      },
      { 
        path: 'tab3', 
        canActivate: [authGuard],
        loadComponent: () => import('../tab3/tab3.page').then((m) => m.Tab3Page) 
      },
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/tabs/home', pathMatch: 'full' }, 
];