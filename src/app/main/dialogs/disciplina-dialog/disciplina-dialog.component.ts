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
export class DisciplinaDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<DisciplinaDialogComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  form: FormGroup;
  isEditing = false;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      semester: ['', [Validators.required, Validators.min(1)]],
      extra_information: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.form.patchValue(this.data);
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
