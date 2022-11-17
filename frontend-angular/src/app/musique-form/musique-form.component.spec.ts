import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiqueFormComponent } from './musique-form.component';

describe('MusiqueFormComponent', () => {
  let component: MusiqueFormComponent;
  let fixture: ComponentFixture<MusiqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusiqueFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusiqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
