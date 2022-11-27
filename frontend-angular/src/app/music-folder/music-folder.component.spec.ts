import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicFolderComponent } from './music-folder.component';

describe('MusicFolderComponent', () => {
  let component: MusicFolderComponent;
  let fixture: ComponentFixture<MusicFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicFolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
