import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../services/auth.service';

// Validador customizado para verificar se as senhas coincidem
export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  // Se as senhas não forem iguais, retorna um erro
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent implements OnInit {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.cadastroForm = this.fb.group(
      {
        nickname: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    ); // Aplica o validador no grupo
  }

  ngOnInit(): void {}

  onRegister(): void {
    if (this.cadastroForm.valid) {
      // Remove o campo de confirmação antes de enviar para o backend
      const { nickname, password } = this.cadastroForm.value;

      this.authService.register({ nickname, password }).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          // Opcional: Redirecionar para o login ou para o dashboard
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao realizar o cadastro:', error);
          // Adicionar feedback de erro para o usuário aqui
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigate(['/login']);
  }
}
