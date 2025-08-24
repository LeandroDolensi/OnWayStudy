import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // 1. Importar o módulo do Tooltip

export interface Filtros {
  disciplina: string;
  status: string;
}

@Component({
  selector: 'app-filtros-tabela',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './filtros-tabela.component.html',
  styleUrl: './filtros-tabela.component.scss',
})
export class FiltrosTabelaComponent implements OnInit {
  // Recebe as opções de disciplina e status do componente pai
  @Input() disciplinas: string[] = [];
  @Input() statusOptions: string[] = [];

  // Emite os valores do filtro para o componente pai
  @Output() filterChange = new EventEmitter<Filtros>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      disciplina: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    // Escuta as alterações no formulário
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300), // Espera 300ms após a última alteração
        distinctUntilChanged() // Só emite se os valores mudarem
      )
      .subscribe((values) => {
        this.filterChange.emit(values);
      });
  }

  limparFiltros(): void {
    this.filterForm.reset({ disciplina: '', status: '' });
  }
}
