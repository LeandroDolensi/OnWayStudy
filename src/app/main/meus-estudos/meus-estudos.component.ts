import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import {
  FiltrosTabelaComponent,
  Filtros,
} from '../filtros-tabela/filtros-tabela.component'; // Importar o novo componente
import { DisciplinaDialogComponent } from '../dialogs/disciplina-dialog/disciplina-dialog.component';
import { AtividadeDialogComponent } from '../dialogs/atividade-dialog/atividade-dialog.component';

export interface Atividade {
  id: number; // Adicionando um ID para facilitar a edição
  disciplina: string;
  atividade: string;
  data: Date;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  peso: number | null;
  resultado: number | null;
}

const ELEMENT_DATA: Atividade[] = [
  {
    id: 1,
    disciplina: 'Cálculo II',
    atividade: 'Prova 1',
    data: new Date('2024-09-10'),
    status: 'Pendente',
    peso: 4,
    resultado: null,
  },
  {
    id: 2,
    disciplina: 'Física Quântica',
    atividade: 'Trabalho em Grupo',
    data: new Date('2024-09-15'),
    status: 'Pendente',
    peso: 3,
    resultado: null,
  },
  {
    id: 3,
    disciplina: 'Algoritmos Avançados',
    atividade: 'Entrega do Projeto 1',
    data: new Date('2024-09-20'),
    status: 'Em Andamento',
    peso: 3,
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
    FiltrosTabelaComponent,
  ],
  templateUrl: './meus-estudos.component.html',
  styleUrl: './meus-estudos.component.scss',
})
export class MeusEstudosComponent implements AfterViewInit {
  // Adicionando a coluna 'acoes'
  displayedColumns: string[] = [
    'disciplina',
    'atividade',
    'data',
    'status',
    'peso',
    'resultado',
    'acoes',
  ];
  statusOptions: Atividade['status'][] = [
    'Pendente',
    'Em Andamento',
    'Concluído',
  ];
  dataSource: MatTableDataSource<Atividade>;

  disciplinasCadastradas: string[] = [
    'Cálculo II',
    'Física Quântica',
    'Algoritmos Avançados',
    'Engenharia de Software',
    'Banco de Dados',
  ];
  private statusCycle: Atividade['status'][] = [
    'Pendente',
    'Em Andamento',
    'Concluído',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit(): void {
    // Lógica de filtragem personalizada
    this.dataSource.filterPredicate = (
      data: Atividade,
      filter: string
    ): boolean => {
      const filtros = JSON.parse(filter) as Filtros;
      const matchDisciplina =
        !filtros.disciplina || data.disciplina === filtros.disciplina;
      const matchStatus = !filtros.status || data.status === filtros.status;
      return matchDisciplina && matchStatus;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(filtros: Filtros): void {
    // Converte o objeto de filtros para uma string JSON para passar ao dataSource
    this.dataSource.filter = JSON.stringify(filtros);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Volta para a primeira página ao filtrar
    }
  }

  // --- NOVAS FUNÇÕES DE EDIÇÃO ---

  trocarStatus(atividade: Atividade): void {
    const currentIndex = this.statusCycle.indexOf(atividade.status);
    const nextIndex = (currentIndex + 1) % this.statusCycle.length;
    atividade.status = this.statusCycle[nextIndex];

    console.log(
      `Status de '${atividade.atividade}' alterado para '${atividade.status}'`
    );
    // Futuramente, aqui você chamaria o serviço para salvar a alteração no backend
    this.dataSource._updateChangeSubscription(); // Força a atualização da tabela
  }

  editarAtividade(atividade: Atividade): void {
    const dialogRef = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      // Passamos os dados da atividade e a lista de disciplinas para o modal
      data: {
        atividade: atividade,
        disciplinas: this.disciplinasCadastradas,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Atividade atualizada:', result);
        // Encontra a atividade no array e atualiza os seus dados
        const index = this.dataSource.data.findIndex(
          (a) => a.id === atividade.id
        );
        if (index > -1) {
          this.dataSource.data[index] = {
            ...this.dataSource.data[index],
            ...result,
          };
          this.dataSource.data = [...this.dataSource.data]; // Dispara a atualização da tabela
        }
      }
    });
  }

  cadastrarDisciplina() {
    const dialogRef = this.dialog.open(DisciplinaDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dados da nova disciplina:', result);
        this.disciplinasCadastradas.push(result.nome);
      }
    });
  }

  cadastrarAtividade() {
    const dialogRef = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: { disciplinas: this.disciplinasCadastradas },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Nova atividade:', result);

        // A lógica existente já suporta o novo campo 'peso'
        const novaAtividade: Atividade = {
          ...result,
          data: new Date(result.data),
        };

        const data = this.dataSource.data;
        data.push(novaAtividade);
        this.dataSource.data = data;
      }
    });
  }
}
