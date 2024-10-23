import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEditFoldersFieldInDialogComponent} from './add-edit-folders-field-in-dialog.component';

describe('AddEditFoldersFieldInDialogComponent', () => {
  let component: AddEditFoldersFieldInDialogComponent;
  let fixture: ComponentFixture<AddEditFoldersFieldInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditFoldersFieldInDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditFoldersFieldInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
