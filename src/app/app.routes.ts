import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { MeusEstudosComponent } from './main/meus-estudos/meus-estudos.component';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'meus-estudos',
    component: MeusEstudosComponent,
    canActivate: [authGuard],
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
