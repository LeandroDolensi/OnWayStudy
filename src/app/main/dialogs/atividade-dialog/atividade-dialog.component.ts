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
import { Atividade } from '../../meus-estudos/meus-estudos.component';

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
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AtividadeDialogComponent>,
    // O 'data' agora pode conter uma atividade para edição
    @Inject(MAT_DIALOG_DATA)
    public data: { atividade?: Atividade; disciplinas: string[] }
  ) {
    this.disciplinas = data.disciplinas;
    this.isEditMode = !!data.atividade; // Verifica se estamos em modo de edição

    this.form = this.fb.group({
      disciplina: ['', Validators.required],
      atividade: ['', Validators.required],
      data: ['', Validators.required],
      status: ['Pendente', Validators.required],
      peso: [null, [Validators.min(0)]],
      resultado: [null],
    });

    // Se for modo de edição, preenche o formulário com os dados recebidos
    if (this.isEditMode) {
      this.form.patchValue(data.atividade!);
    }
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
