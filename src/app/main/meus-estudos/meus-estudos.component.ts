import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { DisciplineService } from '../../services/discipline/discipline.service';
import { ActivityService } from '../../services/activity/activity.service';
import { Institution, Course, Discipline } from '../../models/user.model';

export interface Atividade {
  id: number;
  disciplina: string;
  atividade: string;
  data: Date;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  peso: number | null;
  nota_esperada: number | null;
  resultado: number | null;
}

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
  private disciplineService = inject(DisciplineService);
  private activityService = inject(ActivityService);

  userName: string = '';

  institutions: Institution[] = [];
  selectedInstitution: Institution | null = null;
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;

  disciplines: Discipline[] = [];
  disciplinaNames: string[] = [];
  selectedDiscipline: Discipline | null = null;

  displayedColumns: string[] = [
    'disciplina',
    'atividade',
    'data',
    'status',
    'peso',
    'nota_esperada',
    'resultado',
    'acoes',
  ];
  statusOptions: Atividade['status'][] = [
    'Pendente',
    'Em Andamento',
    'Concluído',
  ];
  dataSource: MatTableDataSource<Atividade>;
  private statusCycle: Atividade['status'][] = [
    'Pendente',
    'Em Andamento',
    'Concluído',
  ];
  private statusMapRev: Record<string, Atividade['status']> = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em Andamento',
    COMPLETED: 'Concluído',
  };
  private statusMapFwd: Record<string, string> = {
    Pendente: 'PENDING',
    'Em Andamento': 'IN_PROGRESS',
    Concluído: 'COMPLETED',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource<Atividade>([]);
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_nickname') || 'Estudante';
    this.loadInstitutions();

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
      this.loadDisciplines();
    } else {
      this.selectedCourse = null;
      this.disciplines = [];
      this.dataSource.data = [];
    }
  }

  loadDisciplines() {
    if (!this.selectedCourse) {
      this.disciplines = [];
      this.selectedDiscipline = null; // Reset
      this.dataSource.data = [];
      return;
    }
    this.disciplineService.getList().subscribe((data) => {
      this.disciplines = data.filter(
        (d: any) => d.course === this.selectedCourse?.id
      );

      if (this.disciplines.length > 0) {
        this.selectedDiscipline = this.disciplines[this.disciplines.length - 1];
      } else {
        this.selectedDiscipline = null;
      }
      this.loadActivities();
    });
  }

  onDisciplineChange() {}

  loadActivities() {
    this.activityService.getList().subscribe((backendActivities) => {
      const currentDisciplineIds = this.disciplines.map((d) => d.id);

      const filtered = backendActivities.filter((a: any) => {
        return currentDisciplineIds.includes(a.discipline);
      });

      const tableData: Atividade[] = filtered.map((a: any) => {
        const disc = this.disciplines.find((d) => d.id === a.discipline);

        return {
          id: a.id,
          disciplina: disc ? disc.name : 'Desconhecida',
          disciplineId: a.discipline,
          atividade: a.name,
          data: new Date(a.delivery_date),
          status: this.statusMapRev[a.status] || 'Pendente',
          peso: a.grade_weight ? parseFloat(a.grade_weight) : null,
          nota_esperada: a.expected_grade ? parseFloat(a.expected_grade) : null, // [NEW]
          resultado: a.grade_result ? parseFloat(a.grade_result) : null,
        };
      });

      this.dataSource.data = tableData;
    });
  }

  onInstitutionChange() {
    this.filterCoursesByInstitution();
  }

  onCourseChange() {
    this.loadDisciplines();
  }

  cadastrarDisciplina() {
    if (!this.selectedCourse) {
      alert('Selecione um curso.');
      return;
    }
    const ref = this.dialog.open(DisciplinaDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
    });
    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.disciplineService
          .create({ ...res, course: this.selectedCourse!.id })
          .subscribe((newDisc) => {
            this.disciplines.push(newDisc);
            this.disciplinaNames = this.disciplines.map((d) => d.name);
            this.selectedDiscipline = newDisc;
          });
      }
    });
  }

  editarDisciplina() {
    if (!this.selectedDiscipline) return;

    const ref = this.dialog.open(DisciplinaDialogComponent, {
      width: '400px',
      backdropClass: 'blurred-backdrop',
      data: this.selectedDiscipline, // Pass data
    });

    ref.afterClosed().subscribe((result) => {
      if (result && this.selectedDiscipline) {
        this.disciplineService
          .patch(this.selectedDiscipline.id, result)
          .subscribe((updated) => {
            const index = this.disciplines.findIndex(
              (d) => d.id === updated.id
            );
            if (index !== -1) {
              this.disciplines[index] = updated;
              this.selectedDiscipline = updated;
              this.loadActivities();
            }
          });
      }
    });
  }

  deletarDisciplina() {
    if (!this.selectedDiscipline) return;

    if (
      confirm(
        `Tem certeza que deseja excluir a disciplina '${this.selectedDiscipline.name}'?`
      )
    ) {
      this.disciplineService
        .delete(this.selectedDiscipline.id)
        .subscribe(() => {
          this.disciplines = this.disciplines.filter(
            (d) => d.id !== this.selectedDiscipline!.id
          );
          this.selectedDiscipline =
            this.disciplines.length > 0
              ? this.disciplines[this.disciplines.length - 1]
              : null;
          this.loadActivities();
        });
    }
  }

  cadastrarAtividade() {
    if (!this.disciplines.length) {
      alert('Cadastre uma disciplina primeiro.');
      return;
    }

    const ref = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: { disciplines: this.disciplines },
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.activityService.create(res).subscribe(() => {
          this.loadActivities();
        });
      }
    });
  }

  editarAtividade(row: Atividade) {
    const ref = this.dialog.open(AtividadeDialogComponent, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: {
        disciplines: this.disciplines,
        atividade: row,
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.activityService.patch(row.id, res).subscribe(() => {
          this.loadActivities();
        });
      }
    });
  }

  deletarAtividade(row: Atividade) {
    if (
      confirm(`Tem certeza que deseja excluir a atividade '${row.atividade}'?`)
    ) {
      this.activityService.delete(row.id).subscribe(() => {
        this.loadActivities();
      });
    }
  }

  trocarStatus(row: Atividade) {
    const currentIndex = this.statusCycle.indexOf(row.status);
    const nextIndex = (currentIndex + 1) % this.statusCycle.length;
    const nextStatusDisplay = this.statusCycle[nextIndex];
    const nextStatusBackend = this.statusMapFwd[nextStatusDisplay];

    this.activityService
      .patch(row.id, { status: nextStatusBackend })
      .subscribe(() => {
        row.status = nextStatusDisplay;
      });
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
              this.selectedInstitution = updated;
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
    this.dataSource.filter = JSON.stringify(filtros);
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
