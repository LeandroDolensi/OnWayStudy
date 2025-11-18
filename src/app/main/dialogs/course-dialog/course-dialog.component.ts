import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditing ? 'Editar' : 'Novo' }} Curso</h2>
    <mat-dialog-content>
      <form
        [formGroup]="form"
        style="display: flex; flex-direction: column; gap: 10px; padding-top: 10px;"
      >
        <mat-form-field appearance="outline">
          <mat-label>Nome do Curso</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Ex: Engenharia de Software"
          />
        </mat-form-field>

        <div style="display: flex; gap: 10px;">
          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Sigla/Acacrônimo</mat-label>
            <input
              matInput
              formControlName="acronym"
              placeholder="Ex: ENGSOFT"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Semestres/Módulos</mat-label>
            <input matInput type="number" formControlName="semesters" />
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="form.invalid"
        (click)="save()"
      >
        Salvar
      </button>
    </mat-dialog-actions>
  `,
})
export class CourseDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CourseDialogComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    acronym: ['', Validators.required],
    semesters: [1, [Validators.required, Validators.min(1)]],
  });

  isEditing = false;

  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.form.patchValue(this.data);
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
