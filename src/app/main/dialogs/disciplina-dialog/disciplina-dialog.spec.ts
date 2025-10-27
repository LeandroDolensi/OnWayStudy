import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaDialog } from './disciplina-dialog.component';

describe('DisciplinaDialog', () => {
  let component: DisciplinaDialog;
  let fixture: ComponentFixture<DisciplinaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinaDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplinaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
