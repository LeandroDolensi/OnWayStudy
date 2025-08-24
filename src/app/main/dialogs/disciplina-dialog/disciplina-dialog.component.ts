import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-disciplina-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './disciplina-dialog.component.html',
  styleUrl: './disciplina-dialog.component.scss',
})
export class DisciplinaDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DisciplinaDialogComponent>
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      // Novo campo para o semestre, numérico e obrigatório
      semestre: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      // Novo campo para informações adicionais, opcional
      informacoesAdicionais: [''],
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
