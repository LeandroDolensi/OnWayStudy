import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { MeusEstudosComponent } from './main/meus-estudos/meus-estudos.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'meus-estudos',
    component: MeusEstudosComponent,
  },
  {
    path: 'cadastro',
    component: CadastroComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/login' },
];
