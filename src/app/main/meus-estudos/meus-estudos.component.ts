import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
} from '../filtros-tabela/filtros-tabela.component';
import { DisciplinaDialogComponent } from '../dialogs/disciplina-dialog/disciplina-dialog.component';
import { AtividadeDialogComponent } from '../dialogs/atividade-dialog/atividade-dialog.component';

export interface Atividade {
  id: number;
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
    disciplina: 'Projeto de Sistemas',
    atividade: 'Apresentação de telas',
    data: new Date('2025-08-26'),
    status: 'Pendente',
    peso: 4,
    resultado: null,
  },
  {
    id: 2,
    disciplina: 'Empreendedorismo',
    atividade: 'Trabalho em Grupo',
    data: new Date('2025-08-26'),
    status: 'Pendente',
    peso: 3,
    resultado: null,
  },
  {
    id: 3,
    disciplina: 'Programção Web IV',
    atividade: 'Entrega do Projeto 1',
    data: new Date('2025-08-27'),
    status: 'Em Andamento',
    peso: 3,
    resultado: null,
  },
  {
    id: 4,
    disciplina: 'Programção para Dispositivos Móveis',
    atividade: 'Prova 1',
    data: new Date('2025-09-12'),
    status: 'Em Andamento',
    peso: 3,
    resultado: null,
  },
  {
    id: 5,
    disciplina: 'Projeto de Sistemas',
    atividade: 'Entrega das Telas',
    data: new Date('2025-09-02'),
    status: 'Em Andamento',
    peso: 3,
    resultado: null,
  },
  {
    id: 6,
    disciplina: 'Empreendedorismo',
    atividade: 'Entrega do Projeto 2',
    data: new Date('2025-09-23'),
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
    'Empreendedorismo',
    'Projeto de Sistemas',
    'Programção para Dispositivos Móveis',
    'Programção Web IV',
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
    this.dataSource.filter = JSON.stringify(filtros);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  trocarStatus(atividade: Atividade): void {
    const currentIndex = this.statusCycle.indexOf(atividade.status);
    const nextIndex = (currentIndex + 1) % this.statusCycle.length;
    atividade.status = this.statusCycle[nextIndex];

    console.log(
      `Status de '${atividade.atividade}' alterado para '${atividade.status}'`
    );
    this.dataSource._updateChangeSubscription();
  }

  editarAtividade(atividade: Atividade): void {
    const dialogRef = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: {
        atividade: atividade,
        disciplinas: this.disciplinasCadastradas,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Atividade atualizada:', result);
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
