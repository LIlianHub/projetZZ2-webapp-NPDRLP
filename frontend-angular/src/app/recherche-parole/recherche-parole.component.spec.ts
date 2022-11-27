import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheParoleComponent } from './recherche-parole.component';

describe('RechercheParoleComponent', () => {
  let component: RechercheParoleComponent;
  let fixture: ComponentFixture<RechercheParoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheParoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercheParoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
