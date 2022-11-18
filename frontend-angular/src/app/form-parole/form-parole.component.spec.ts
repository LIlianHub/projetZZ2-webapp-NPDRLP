import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormParoleComponent } from './form-parole.component';

describe('FormParoleComponent', () => {
  let component: FormParoleComponent;
  let fixture: ComponentFixture<FormParoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormParoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormParoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
