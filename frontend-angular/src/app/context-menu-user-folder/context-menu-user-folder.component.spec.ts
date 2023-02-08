import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuUserFolderComponent } from './context-menu-user-folder.component';

describe('ContextMenuUserFolderComponent', () => {
  let component: ContextMenuUserFolderComponent;
  let fixture: ComponentFixture<ContextMenuUserFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextMenuUserFolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuUserFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
