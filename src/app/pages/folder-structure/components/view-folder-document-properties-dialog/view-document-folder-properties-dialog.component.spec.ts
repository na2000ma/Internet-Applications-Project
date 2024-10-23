import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewDocumentFolderPropertiesDialogComponent} from './view-document-folder-properties-dialog.component';

describe('ViewDocumentFolderPropertiesDialogComponent', () => {
  let component: ViewDocumentFolderPropertiesDialogComponent;
  let fixture: ComponentFixture<ViewDocumentFolderPropertiesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDocumentFolderPropertiesDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewDocumentFolderPropertiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
