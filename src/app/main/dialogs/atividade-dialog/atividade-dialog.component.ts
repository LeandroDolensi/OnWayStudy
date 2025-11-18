import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './atividade-dialog.component.html',
  styleUrls: ['./atividade-dialog.component.scss'],
})
export class AtividadeDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AtividadeDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  form: FormGroup;
  isEditing = false;
  disciplines: any[] = [];

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      discipline: ['', Validators.required],
      delivery_date: [null, Validators.required],
      grade_weight: ['', [Validators.min(0), Validators.max(10)]],
      grade_result: [''],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.disciplines) {
      this.disciplines = this.data.disciplines;
    }

    if (this.data && this.data.atividade) {
      this.isEditing = true;
      const activity = this.data.atividade;

      this.form.patchValue({
        name: activity.atividade,
        grade_weight: activity.peso,
        grade_result: activity.resultado,
        delivery_date: activity.data,
        discipline: activity.disciplineId,
      });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload = {
        ...formValue,
        delivery_date: new Date(formValue.delivery_date).toISOString(),
      };

      this.dialogRef.close(payload);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
