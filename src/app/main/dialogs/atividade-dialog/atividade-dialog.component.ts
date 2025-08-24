import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-atividade-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './atividade-dialog.component.html',
  styleUrl: './atividade-dialog.component.scss',
})
export class AtividadeDialogComponent {
  form: FormGroup;
  statusOptions: string[] = ['Pendente', 'Em Andamento', 'Concluído'];
  disciplinas: string[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AtividadeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { disciplinas: string[] }
  ) {
    this.disciplinas = data.disciplinas;
    this.form = this.fb.group({
      disciplina: ['', Validators.required],
      atividade: ['', Validators.required],
      data: ['', Validators.required],
      status: ['Pendente', Validators.required],
      resultado: [null],
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
