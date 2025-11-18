import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  FiltrosTabelaComponent,
  Filtros,
} from '../filtros-tabela/filtros-tabela.component';
import { InstitutionDialogComponent } from '../dialogs/institution-dialog/institution-dialog.component';
import { CourseDialogComponent } from '../dialogs/course-dialog/course-dialog.component';
import { DisciplinaDialogComponent } from '../dialogs/disciplina-dialog/disciplina-dialog.component';
import { AtividadeDialogComponent } from '../dialogs/atividade-dialog/atividade-dialog.component';
import { InstitutionService } from '../../services/institution/institution.service';
import { CourseService } from '../../services/course/course.service';
import { Institution, Course } from '../../models/user.model';

export interface Atividade {
  id: number;
  disciplina: string;
  atividade: string;
  data: Date;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  peso: number | null;
  resultado: number | null;
}

const ELEMENT_DATA: Atividade[] = [];

@Component({
  selector: 'app-meus-estudos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    FiltrosTabelaComponent,
  ],
  templateUrl: './meus-estudos.component.html',
  styleUrl: './meus-estudos.component.scss',
})
export class MeusEstudosComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private institutionService = inject(InstitutionService);
  private courseService = inject(CourseService);

  userName: string = '';
  institutions: Institution[] = [];
  selectedInstitution: Institution | null = null;

  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;

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
  ];
  private statusCycle: Atividade['status'][] = [
    'Pendente',
    'Em Andamento',
    'Concluído',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_nickname') || 'Estudante';
    this.loadInstitutions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInstitutions() {
    this.institutionService.getList().subscribe((data) => {
      this.institutions = data;
      if (this.institutions.length > 0) {
        this.selectedInstitution =
          this.institutions[this.institutions.length - 1];
        this.loadCourses();
      }
    });
  }

  loadCourses() {
    if (!this.selectedInstitution) return;

    this.courseService.getList().subscribe((data) => {
      this.allCourses = data;
      this.filterCoursesByInstitution();
    });
  }

  filterCoursesByInstitution() {
    if (!this.selectedInstitution) {
      this.filteredCourses = [];
      return;
    }

    this.filteredCourses = this.allCourses.filter(
      (c: any) => c.institution === this.selectedInstitution?.id
    );

    if (this.filteredCourses.length > 0) {
      this.selectedCourse =
        this.filteredCourses[this.filteredCourses.length - 1];
    } else {
      this.selectedCourse = null;
    }
  }

  onInstitutionChange() {
    this.filterCoursesByInstitution();
  }

  onCourseChange() {
    console.log('Course changed to:', this.selectedCourse?.name);
  }

  openInstitutionDialog() {
    const ref = this.dialog.open(InstitutionDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.institutionService.create(result).subscribe((newInst) => {
          this.institutions.push(newInst);
          this.selectedInstitution = newInst;
          this.onInstitutionChange();
        });
      }
    });
  }

  editInstitution() {
    if (!this.selectedInstitution) return;

    const ref = this.dialog.open(InstitutionDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
      data: this.selectedInstitution,
    });

    ref.afterClosed().subscribe((result) => {
      if (result && this.selectedInstitution) {
        this.institutionService
          .patch(this.selectedInstitution.id, result)
          .subscribe((updated) => {
            const index = this.institutions.findIndex(
              (i) => i.id === updated.id
            );
            if (index !== -1) {
              this.institutions[index] = updated;
              this.selectedInstitution = updated; // Update selection reference
            }
          });
      }
    });
  }

  deleteInstitution() {
    if (!this.selectedInstitution) return;

    if (
      confirm(
        `Tem certeza que deseja excluir a instituição '${this.selectedInstitution.name}'?`
      )
    ) {
      this.institutionService
        .delete(this.selectedInstitution.id)
        .subscribe(() => {
          this.institutions = this.institutions.filter(
            (i) => i.id !== this.selectedInstitution!.id
          );

          this.selectedInstitution =
            this.institutions.length > 0
              ? this.institutions[this.institutions.length - 1]
              : null;
          this.onInstitutionChange();
        });
    }
  }

  openCourseDialog() {
    if (!this.selectedInstitution) {
      alert('Selecione uma instituição primeiro.');
      return;
    }
    const ref = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        const payload = {
          ...result,
          institution: this.selectedInstitution!.id,
        };
        this.courseService.create(payload).subscribe((newCourse) => {
          const courseWithId = {
            ...newCourse,
            institution: this.selectedInstitution!.id,
          };
          this.allCourses.push(courseWithId as any);
          this.filterCoursesByInstitution();
          this.selectedCourse = courseWithId as any;
        });
      }
    });
  }

  editCourse() {
    if (!this.selectedCourse) return;

    const ref = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
      data: this.selectedCourse,
    });

    ref.afterClosed().subscribe((result) => {
      if (result && this.selectedCourse) {
        this.courseService
          .patch(this.selectedCourse.id, result)
          .subscribe((updated) => {
            const index = this.allCourses.findIndex((c) => c.id === updated.id);

            if (index !== -1) {
              const updatedWithLink = {
                ...updated,
                institution: this.selectedInstitution?.id,
              };
              this.allCourses[index] = updatedWithLink as any;
              this.filterCoursesByInstitution(); // Re-filter to update UI
              this.selectedCourse = updatedWithLink as any;
            }
          });
      }
    });
  }

  deleteCourse() {
    if (!this.selectedCourse) return;

    if (
      confirm(
        `Tem certeza que deseja excluir o curso '${this.selectedCourse.name}'?`
      )
    ) {
      this.courseService.delete(this.selectedCourse.id).subscribe(() => {
        this.allCourses = this.allCourses.filter(
          (c) => c.id !== this.selectedCourse!.id
        );
        this.filterCoursesByInstitution();
      });
    }
  }

  logout(): void {
    localStorage.removeItem('user_nickname');
    localStorage.removeItem('user_password');
    this.router.navigate(['/login']);
  }

  onFilterChange(filtros: Filtros): void {
    /* ... */
  }
  trocarStatus(atividade: Atividade): void {
    /* ... */
  }
  editarAtividade(atividade: Atividade): void {
    /* ... */
  }
  cadastrarDisciplina() {
    /* Old logic, to be updated later */
  }
  cadastrarAtividade() {
    const dialogRef = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: { disciplinas: this.disciplinasCadastradas },
    });
  }
}
