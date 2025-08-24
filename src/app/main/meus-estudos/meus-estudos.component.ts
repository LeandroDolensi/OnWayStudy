import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog

// Importar os componentes dos modais
import { DisciplinaDialogComponent } from '../dialogs/disciplina-dialog/disciplina-dialog.component';
import { AtividadeDialogComponent } from '../dialogs/atividade-dialog/atividade-dialog.component';

export interface Atividade {
  disciplina: string;
  atividade: string;
  data: Date;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  resultado: number | null;
}

const ELEMENT_DATA: Atividade[] = [
  {
    disciplina: 'Cálculo II',
    atividade: 'Prova 1',
    data: new Date('2024-09-10'),
    status: 'Pendente',
    resultado: null,
  },
  {
    disciplina: 'Física Quântica',
    atividade: 'Trabalho em Grupo',
    data: new Date('2024-09-15'),
    status: 'Pendente',
    resultado: null,
  },
  {
    disciplina: 'Algoritmos Avançados',
    atividade: 'Entrega do Projeto 1',
    data: new Date('2024-09-20'),
    status: 'Em Andamento',
    resultado: null,
  },
  {
    disciplina: 'Engenharia de Software',
    atividade: 'Apresentação do Seminário',
    data: new Date('2024-08-30'),
    status: 'Concluído',
    resultado: 8.5,
  },
  {
    disciplina: 'Banco de Dados',
    atividade: 'Prova 2',
    data: new Date('2024-10-01'),
    status: 'Pendente',
    resultado: null,
  },
  {
    disciplina: 'Redes de Computadores',
    atividade: 'Lista de Exercícios 3',
    data: new Date('2024-09-25'),
    status: 'Em Andamento',
    resultado: null,
  },
  {
    disciplina: 'Inteligência Artificial',
    atividade: 'Implementação do Algoritmo Genético',
    data: new Date('2024-11-05'),
    status: 'Pendente',
    resultado: null,
  },
  {
    disciplina: 'Cálculo II',
    atividade: 'Lista de Exercícios 4',
    data: new Date('2024-09-05'),
    status: 'Concluído',
    resultado: 9.0,
  },
  {
    disciplina: 'Física Quântica',
    atividade: 'Prova Final',
    data: new Date('2024-11-20'),
    status: 'Pendente',
    resultado: null,
  },
  {
    disciplina: 'Engenharia de Software',
    atividade: 'Teste de Usabilidade',
    data: new Date('2024-10-10'),
    status: 'Pendente',
    resultado: null,
  },
  {
    disciplina: 'Banco de Dados',
    atividade: 'Projeto Final',
    data: new Date('2024-11-15'),
    status: 'Pendente',
    resultado: null,
  },
];

@Component({
  selector: 'app-meus-estudos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './meus-estudos.component.html',
  styleUrl: './meus-estudos.component.scss',
})
export class MeusEstudosComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'disciplina',
    'atividade',
    'data',
    'status',
    'resultado',
  ];
  dataSource: MatTableDataSource<Atividade>;

  // Lista de disciplinas para passar para o modal de atividade
  disciplinasCadastradas: string[] = [
    'Cálculo II',
    'Física Quântica',
    'Algoritmos Avançados',
    'Engenharia de Software',
    'Banco de Dados',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Injetar o MatDialog no construtor
  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cadastrarDisciplina() {
    const dialogRef = this.dialog.open(DisciplinaDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Altere a verificação de 'result.nome' para apenas 'result'
      if (result) {
        console.log('Dados da nova disciplina:', result); // Agora imprime o objeto completo
        this.disciplinasCadastradas.push(result.nome);
        // Futuramente, aqui você chamaria o serviço para salvar no backend
      }
    });
  }

  cadastrarAtividade() {
    const dialogRef = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: { disciplinas: this.disciplinasCadastradas }, // Passa a lista de disciplinas para o modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Nova atividade:', result);
        // Adiciona a nova atividade à tabela
        const novaAtividade: Atividade = {
          ...result,
          data: new Date(result.data),
        };

        const data = this.dataSource.data;
        data.push(novaAtividade);
        this.dataSource.data = data; // Atualiza a tabela
      }
    });
  }
}
