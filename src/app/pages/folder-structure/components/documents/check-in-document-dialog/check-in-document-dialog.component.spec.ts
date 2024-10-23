import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckInDocumentDialogComponent} from './check-in-document-dialog.component';

describe('CheckInDocumentDialogComponent', () => {
  let component: CheckInDocumentDialogComponent;
  let fixture: ComponentFixture<CheckInDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckInDocumentDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CheckInDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
