import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('user_nickname');
    localStorage.removeItem('user_password');
  }

  onLogin(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { nickname, password } = this.loginForm.value;
    localStorage.setItem('user_nickname', nickname);
    localStorage.setItem('user_password', password);

    this.userService.getList().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Login successful!', response);
        this.router.navigate(['/meus-estudos']);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        localStorage.removeItem('user_nickname');
        localStorage.removeItem('user_password');
        this.errorMessage = 'Nickname or password incorrect. Please try again.';
      },
    });
  }

  onCreateAccount(): void {
    this.router.navigate(['/cadastro']);
  }
}
