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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user/user.service';

export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

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
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.cadastroForm = this.fb.group(
      {
        nickname: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  onRegister(): void {
    if (!this.cadastroForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { nickname, password } = this.cadastroForm.value;

    this.userService.create({ nickname, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Cadastro realizado com sucesso!', response);

        localStorage.setItem('user_nickname', nickname);
        localStorage.setItem('user_password', password);

        this.router.navigate(['/meus-estudos']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao realizar o cadastro:', error);

        if (error.status === 400 && error.error) {
          if (error.error.nickname) {
            let msg = error.error.nickname;
            if (error.error.suggestions) {
              msg += ` Suggestions: ${error.error.suggestions.join(', ')}`;
            }
            this.errorMessage = msg;
          } else {
            this.errorMessage = 'Please check the fields and try again.';
          }
        } else {
          this.errorMessage =
            'An unexpected error occurred. Please try again later.';
        }
      },
    });
  }

  onGoBack(): void {
    this.router.navigate(['/login']);
  }
}
