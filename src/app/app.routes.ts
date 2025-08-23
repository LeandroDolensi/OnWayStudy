// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  // A rota de login
  {
    path: 'login',
    component: LoginComponent,
  },
  // Rota padrão que redireciona para o login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  // Você pode adicionar uma rota para o cadastro aqui
];
