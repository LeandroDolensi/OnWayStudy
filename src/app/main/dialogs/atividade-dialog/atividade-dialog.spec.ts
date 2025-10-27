import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadeDialog } from './atividade-dialog.component';

describe('AtividadeDialog', () => {
  let component: AtividadeDialog;
  let fixture: ComponentFixture<AtividadeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AtividadeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
