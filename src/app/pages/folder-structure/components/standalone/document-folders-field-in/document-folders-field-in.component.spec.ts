import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentFoldersFieldInComponent} from './document-folders-field-in.component';

describe('DocumentFoldersFieldInComponent', () => {
  let component: DocumentFoldersFieldInComponent;
  let fixture: ComponentFixture<DocumentFoldersFieldInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentFoldersFieldInComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentFoldersFieldInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
