import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// Interface para tipar os dados da nossa tabela
export interface Atividade {
  disciplina: string;
  atividade: string;
  data: Date;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  resultado: number | null;
}

// Dados de exemplo (MOCK) para preencher a tabela
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
  // Colunas que serão exibidas na tabela
  displayedColumns: string[] = [
    'disciplina',
    'atividade',
    'data',
    'status',
    'resultado',
  ];

  // Fonte de dados da tabela, que permite ordenação e paginação
  dataSource: MatTableDataSource<Atividade>;

  // Referências aos componentes de paginação e ordenação no template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Inicializa a fonte de dados com os dados de exemplo
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  // Este método é chamado depois que a view do componente é inicializada
  ngAfterViewInit() {
    // Conecta o paginador e o ordenador à fonte de dados
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Funções placeholder para os botões (ainda não funcionais)
  cadastrarDisciplina() {
    console.log('Botão "Cadastrar Disciplina" clicado.');
    // A lógica para abrir um modal ou navegar para outra página virá aqui
  }

  cadastrarAtividade() {
    console.log('Botão "Cadastrar Atividade" clicado.');
    // A lógica para abrir um modal ou navegar para outra página virá aqui
  }
}
