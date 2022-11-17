import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParoleComponent } from './parole.component';

describe('ParoleComponent', () => {
  let component: ParoleComponent;
  let fixture: ComponentFixture<ParoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
