import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEditViewDocumentPropertiesDialogComponent} from './add-edit-view-document-properties-dialog.component';

describe('AddEditViewDocumentPropertiesDialogComponent', () => {
  let component: AddEditViewDocumentPropertiesDialogComponent;
  let fixture: ComponentFixture<AddEditViewDocumentPropertiesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditViewDocumentPropertiesDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditViewDocumentPropertiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
